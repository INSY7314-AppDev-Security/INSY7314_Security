const { hashPassword, comparePassword } = require('../../src/utils/hashPassword');
 
describe('hashPassword utilities', () => {
  const plain = 'Str0ng!Passw0rd';
 
  test('the hash is not the plain password', async () => {
    const hash = await hashPassword(plain);
    expect(hash).not.toBe(plain);
  });
 
  test('the hash is in bcrypt format with 10 salt rounds', async () => {
    const hash = await hashPassword(plain);
    expect(hash).toMatch(/^\$2[aby]\$10\$/);
  });
 
  test('hashing the same password twice gives different hashes (salting)', async () => {
    const first = await hashPassword(plain);
    const second = await hashPassword(plain);
    expect(first).not.toBe(second);
  });
 
  test('comparePassword returns true for the correct password', async () => {
    const hash = await hashPassword(plain);
    await expect(comparePassword(plain, hash)).resolves.toBe(true);
  });
 
  test('comparePassword returns false for a wrong password', async () => {
    const hash = await hashPassword(plain);
    await expect(comparePassword('WrongPassword1!', hash)).resolves.toBe(false);
  });
});