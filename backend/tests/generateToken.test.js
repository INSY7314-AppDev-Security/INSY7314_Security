const jwt = require('jsonwebtoken');
const generateToken = require('../src/utils/generateToken');

describe('generateToken', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'unit_test_secret';
  });
  afterEach(() => {
    delete process.env.JWT_EXPIRES_IN;
  });

  test('puts id, role and token version in the token', () => {
    const token = generateToken({ _id: 'abc123', role: 'freelancer', tokenVersion: 3 });
    const decoded = jwt.verify(token, 'unit_test_secret');
    expect(decoded).toMatchObject({ id: 'abc123', role: 'freelancer', tv: 3 });
  });

  test('uses version 0 when the user has no tokenVersion yet', () => {
    const decoded = jwt.decode(generateToken({ _id: 'x', role: 'client' }));
    expect(decoded.tv).toBe(0);
  });

  test('expires after 2 hours by default', () => {
    const decoded = jwt.decode(generateToken({ _id: 'x', role: 'client' }));
    expect(decoded.exp - decoded.iat).toBe(2 * 60 * 60);
  });

  test('expiry can be changed with JWT_EXPIRES_IN', () => {
    process.env.JWT_EXPIRES_IN = '30m';
    const decoded = jwt.decode(generateToken({ _id: 'x', role: 'client' }));
    expect(decoded.exp - decoded.iat).toBe(30 * 60);
  });
});
