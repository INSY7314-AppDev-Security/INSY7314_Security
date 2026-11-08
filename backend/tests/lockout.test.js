const {
  maxAttempts,
  lockMinutes,
  isLocked,
  lockExpired,
  minutesLeft,
  shouldLock,
  lockUntilDate
} = require('../src/utils/lockout');

describe('account lockout helpers', () => {
  const now = new Date('2026-11-09T10:00:00Z').getTime();
  const minute = 60 * 1000;

  afterEach(() => {
    delete process.env.LOCKOUT_MAX_ATTEMPTS;
    delete process.env.LOCKOUT_MINUTES;
  });

  test('defaults to 5 attempts and a 15 minute lock', () => {
    expect(maxAttempts()).toBe(5);
    expect(lockMinutes()).toBe(15);
  });

  test('settings can be changed with environment variables', () => {
    process.env.LOCKOUT_MAX_ATTEMPTS = '3';
    process.env.LOCKOUT_MINUTES = '30';
    expect(maxAttempts()).toBe(3);
    expect(lockMinutes()).toBe(30);
  });

  test('ignores invalid environment values and falls back to defaults', () => {
    process.env.LOCKOUT_MAX_ATTEMPTS = 'abc';
    process.env.LOCKOUT_MINUTES = '-4';
    expect(maxAttempts()).toBe(5);
    expect(lockMinutes()).toBe(15);
  });

  test('shouldLock is false below the limit and true at the limit', () => {
    expect(shouldLock(4)).toBe(false);
    expect(shouldLock(5)).toBe(true);
    expect(shouldLock(6)).toBe(true);
  });

  test('isLocked is true only while lockUntil is in the future', () => {
    expect(isLocked({ lockUntil: new Date(now + minute) }, now)).toBe(true);
    expect(isLocked({ lockUntil: new Date(now - minute) }, now)).toBe(false);
    expect(isLocked({ lockUntil: null }, now)).toBe(false);
    expect(isLocked(null, now)).toBe(false);
  });

  test('lockExpired is true only when a lock existed and has run out', () => {
    expect(lockExpired({ lockUntil: new Date(now - minute) }, now)).toBe(true);
    expect(lockExpired({ lockUntil: new Date(now + minute) }, now)).toBe(false);
    expect(lockExpired({ lockUntil: null }, now)).toBe(false);
  });

  test('minutesLeft rounds up and is never 0 while locked', () => {
    expect(minutesLeft({ lockUntil: new Date(now + 61 * 1000) }, now)).toBe(2);
    expect(minutesLeft({ lockUntil: new Date(now + 1000) }, now)).toBe(1);
    expect(minutesLeft({ lockUntil: null }, now)).toBe(0);
  });

  test('lockUntilDate is lockMinutes in the future', () => {
    expect(lockUntilDate(now).getTime()).toBe(now + 15 * minute);
  });
});
