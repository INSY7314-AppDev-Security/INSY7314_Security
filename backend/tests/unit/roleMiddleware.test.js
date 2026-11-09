const { authorizeRoles } = require('../../src/middleware/roleMiddleware');
const { mockRes } = require('./testHelpers');

describe('roleMiddleware.authorizeRoles (RBAC)', () => {
  test('returns 401 when no user is attached to the request', () => {
    const res = mockRes();
    const next = jest.fn();
    authorizeRoles('freelancer')({}, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 when the user has no role', () => {
    const res = mockRes();
    const next = jest.fn();
    authorizeRoles('freelancer')({ user: { id: '1' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 403 when the role is not allowed', () => {
    const res = mockRes();
    const next = jest.fn();
    authorizeRoles('freelancer')({ user: { id: '1', role: 'client' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    expect(next).not.toHaveBeenCalled();
  });

  test('calls next() when the role is allowed', () => {
    const res = mockRes();
    const next = jest.fn();
    authorizeRoles('freelancer')({ user: { id: '1', role: 'freelancer' } }, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('accepts any of several allowed roles', () => {
    const next = jest.fn();
    authorizeRoles('freelancer', 'admin')({ user: { role: 'admin' } }, mockRes(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('a client cannot act as an admin', () => {
    const res = mockRes();
    const next = jest.fn();
    authorizeRoles('admin')({ user: { role: 'client' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});