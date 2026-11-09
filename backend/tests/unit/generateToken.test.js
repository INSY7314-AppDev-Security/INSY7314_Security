const jwt = require('jsonwebtoken');
const generateToken = require('../../src/utils/generateToken');
 
const TEST_SECRET = 'unit-test-secret-not-a-real-secret';
const user = { _id: '507f1f77bcf86cd799439011', role: 'freelancer' };
 
describe('generateToken', () => {
  const originalSecret = process.env.JWT_SECRET;
 
  beforeAll(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });
 
  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });
 
  test('token contains the user id and role', () => {
    const decoded = jwt.verify(generateToken(user), TEST_SECRET);
    expect(decoded.id).toBe(user._id);
    expect(decoded.role).toBe('freelancer');
  });
 
  test('token expires after one day', () => {
    const decoded = jwt.verify(generateToken(user), TEST_SECRET);
    expect(decoded.exp - decoded.iat).toBe(24 * 60 * 60);
  });
 
  test('token is rejected when verified with the wrong secret', () => {
    const token = generateToken(user);
    expect(() => jwt.verify(token, 'a-different-secret')).toThrow();
  });
 
  test('a tampered token is rejected', () => {
    const token = generateToken(user);
    const [header, payload, signature] = token.split('.');
    const forgedPayload = Buffer.from(
      JSON.stringify({ id: user._id, role: 'admin' })
    ).toString('base64url');
    const forged = [header, forgedPayload, signature].join('.');
    expect(() => jwt.verify(forged, TEST_SECRET)).toThrow();
  });
});