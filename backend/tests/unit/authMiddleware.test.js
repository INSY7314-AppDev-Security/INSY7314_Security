const jwt = require('jsonwebtoken');
const { protect, authorizeRoles } = require('../../src/middleware/authMiddleware');
const { mockRes } = require('./testHelpers');

const TEST_SECRET = 'unit-test-secret-not-a-real-secret';

describe('authMiddleware.protect (JWT check)', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  test('rejects a request with no Authorization header', () => {
    const res = mockRes();
    const next = jest.fn();
    protect({ headers: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an Authorization header that is not a Bearer token', () => {
    const res = mockRes();
    const next = jest.fn();
    protect({ headers: { authorization: 'Basic abc123' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a garbage token', () => {
    const res = mockRes();
    const next = jest.fn();
    protect({ headers: { authorization: 'Bearer not.a.token' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects a token signed with the wrong secret', () => {
    const token = jwt.sign({ id: '1', role: 'client' }, 'some-other-secret');
    const res = mockRes();
    const next = jest.fn();
    protect({ headers: { authorization: `Bearer ${token}` } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects an expired token', () => {
    const expired = jwt.sign(
      { id: '1', role: 'client', exp: Math.floor(Date.now() / 1000) - 60 },
      TEST_SECRET
    );
    const res = mockRes();
    const next = jest.fn();
    protect({ headers: { authorization: `Bearer ${expired}` } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('accepts a valid token and attaches id and role to req.user', () => {
    const token = jwt.sign({ id: 'abc123', role: 'freelancer' }, TEST_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();
    protect(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({ id: 'abc123', role: 'freelancer' });
  });
});

describe('authMiddleware.authorizeRoles', () => {
  test('returns 403 when there is no user', () => {
    const res = mockRes();
    const next = jest.fn();
    authorizeRoles('admin')({}, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 403 when the role is not allowed', () => {
    const res = mockRes();
    const next = jest.fn();
    authorizeRoles('admin')({ user: { role: 'freelancer' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next() when the role is allowed', () => {
    const next = jest.fn();
    authorizeRoles('admin', 'freelancer')({ user: { role: 'freelancer' } }, mockRes(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});