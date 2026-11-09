const { notFound, errorHandler } = require('../../src/middleware/errorHandler');
const { mockRes } = require('./testHelpers');

describe('errorHandler middleware', () => {
  beforeEach(() => {
    // The handler logs the full error on the server; keep test output quiet.
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('notFound returns 404 with the method and path', () => {
    const res = mockRes();
    notFound({ method: 'GET', originalUrl: '/api/nope' }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(false);
    expect(body.message).toContain('GET');
    expect(body.message).toContain('/api/nope');
  });

  test('malformed JSON returns 400', () => {
    const res = mockRes();
    errorHandler({ type: 'entity.parse.failed' }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('mongoose ValidationError returns 400', () => {
    const res = mockRes();
    errorHandler({ name: 'ValidationError' }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('mongoose CastError returns 400', () => {
    const res = mockRes();
    errorHandler({ name: 'CastError' }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('duplicate key error (code 11000) returns 409', () => {
    const res = mockRes();
    errorHandler({ code: 11000 }, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
  });

  test('unknown errors return 500 and never leak internal details', () => {
    const res = mockRes();
    const err = new Error('database password is hunter2 at C:\\secret\\path.js');
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    const body = res.json.mock.calls[0][0];
    expect(JSON.stringify(body)).not.toContain('hunter2');
    expect(JSON.stringify(body)).not.toContain('secret');
    expect(body).not.toHaveProperty('stack');
  });

  test('errors with a 4xx statusCode pass their message through', () => {
    const res = mockRes();
    const err = new Error('Gig not found');
    err.statusCode = 404;
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json.mock.calls[0][0].message).toBe('Gig not found');
  });

  test('a statusCode below 400 is treated as a 500', () => {
    const res = mockRes();
    const err = new Error('odd');
    err.statusCode = 200;
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });
});