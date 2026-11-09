const { sanitizeInput } = require('../../src/middleware/sanitize');

describe('sanitizeInput middleware (NoSQL injection protection)', () => {
  test('removes MongoDB operator keys such as $gt from the body', () => {
    const req = { body: { email: { $gt: '' }, name: 'Sam' }, params: {} };
    const next = jest.fn();
    sanitizeInput(req, {}, next);
    expect(req.body.email).toEqual({});
    expect(req.body.name).toBe('Sam');
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('removes top-level $ keys', () => {
    const req = { body: { $where: 'sleep(1000)', title: 'Logo design' }, params: {} };
    sanitizeInput(req, {}, jest.fn());
    expect(req.body).toEqual({ title: 'Logo design' });
  });

  test('removes keys that contain a dot', () => {
    const req = { body: { 'profile.role': 'admin', city: 'Cape Town' }, params: {} };
    sanitizeInput(req, {}, jest.fn());
    expect(req.body).toEqual({ city: 'Cape Town' });
  });

  test('cleans deeply nested objects', () => {
    const req = { body: { a: { b: { $ne: null, ok: 1 } } }, params: {} };
    sanitizeInput(req, {}, jest.fn());
    expect(req.body).toEqual({ a: { b: { ok: 1 } } });
  });

  test('cleans route params too', () => {
    const req = { body: {}, params: { id: { $gt: '' } } };
    sanitizeInput(req, {}, jest.fn());
    expect(req.params.id).toEqual({});
  });

  test('leaves safe input untouched', () => {
    const req = { body: { email: 'a@b.com', price: 100 }, params: { id: '123' } };
    sanitizeInput(req, {}, jest.fn());
    expect(req.body).toEqual({ email: 'a@b.com', price: 100 });
    expect(req.params).toEqual({ id: '123' });
  });

  test('does not crash when the body is missing', () => {
    const next = jest.fn();
    expect(() => sanitizeInput({ params: {} }, {}, next)).not.toThrow();
    expect(next).toHaveBeenCalledTimes(1);
  });
});