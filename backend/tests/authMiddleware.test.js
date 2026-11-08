const jwt = require('jsonwebtoken');

// The database is replaced with a fake, so these tests need no MongoDB.
const mockLean = jest.fn();
jest.mock('../src/models/User', () => ({
  findById: jest.fn(() => ({ select: jest.fn(() => ({ lean: mockLean })) }))
}));
jest.mock('../src/utils/securityEvents', () => ({ logSecurityEvent: jest.fn() }));

const { protect } = require('../src/middleware/authMiddleware');
const { logSecurityEvent } = require('../src/utils/securityEvents');

const SECRET = 'unit_test_secret';

function fakeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
function reqWith(token) {
  return { headers: token ? { authorization: `Bearer ${token}` } : {}, ip: '127.0.0.1' };
}

describe('protect middleware', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('401 when no token is sent', async () => {
    const res = fakeRes();
    const next = jest.fn();
    await protect(reqWith(null), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('401 and a logged event for a token with a bad signature', async () => {
    const bad = jwt.sign({ id: '1', role: 'admin', tv: 0 }, 'some_other_secret');
    const res = fakeRes();
    const next = jest.fn();
    await protect(reqWith(bad), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(logSecurityEvent).toHaveBeenCalledWith('TOKEN_REJECTED', expect.objectContaining({ reason: 'invalid_or_expired' }));
    expect(next).not.toHaveBeenCalled();
  });

  test('lets a valid, current token through and takes the role from the database', async () => {
    mockLean.mockResolvedValue({ role: 'client', tokenVersion: 0 });
    const token = jwt.sign({ id: 'u1', role: 'admin', tv: 0 }, SECRET); // token claims admin
    const req = reqWith(token);
    const next = jest.fn();
    await protect(req, fakeRes(), next);
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({ id: 'u1', role: 'client' }); // database wins
  });

  test('rejects a revoked token (user logged out)', async () => {
    mockLean.mockResolvedValue({ role: 'client', tokenVersion: 1 });
    const token = jwt.sign({ id: 'u1', role: 'client', tv: 0 }, SECRET);
    const res = fakeRes();
    const next = jest.fn();
    await protect(reqWith(token), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(logSecurityEvent).toHaveBeenCalledWith('TOKEN_REJECTED', expect.objectContaining({ reason: 'token_revoked' }));
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a token for a deleted user', async () => {
    mockLean.mockResolvedValue(null);
    const token = jwt.sign({ id: 'gone', role: 'client', tv: 0 }, SECRET);
    const res = fakeRes();
    await protect(reqWith(token), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(logSecurityEvent).toHaveBeenCalledWith('TOKEN_REJECTED', expect.objectContaining({ reason: 'user_not_found' }));
  });

  test('a database failure is passed on as an error, not reported as a bad login', async () => {
    const boom = new Error('db down');
    mockLean.mockRejectedValue(boom);
    const token = jwt.sign({ id: 'u1', role: 'client', tv: 0 }, SECRET);
    const res = fakeRes();
    const next = jest.fn();
    await protect(reqWith(token), res, next);
    expect(next).toHaveBeenCalledWith(boom);
    expect(res.status).not.toHaveBeenCalled();
  });
});
