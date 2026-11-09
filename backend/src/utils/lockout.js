// Account lockout settings and helpers.
// Settings are read when needed (not at import time) so they can be changed
// through environment variables and tested easily.

function maxAttempts() {
  const n = parseInt(process.env.LOCKOUT_MAX_ATTEMPTS, 10);
  return Number.isInteger(n) && n > 0 ? n : 5;
}

function lockMinutes() {
  const n = parseInt(process.env.LOCKOUT_MINUTES, 10);
  return Number.isInteger(n) && n > 0 ? n : 15;
}

// True while the account is still locked
function isLocked(user, now = Date.now()) {
  return Boolean(user && user.lockUntil && new Date(user.lockUntil).getTime() > now);
}

// True when a lock was set earlier and has now run out
function lockExpired(user, now = Date.now()) {
  return Boolean(user && user.lockUntil && new Date(user.lockUntil).getTime() <= now);
}

// Whole minutes left on the lock (always at least 1 while locked)
function minutesLeft(user, now = Date.now()) {
  if (!isLocked(user, now)) return 0;
  return Math.max(1, Math.ceil((new Date(user.lockUntil).getTime() - now) / 60000));
}

// Should this failure count trigger a lock?
function shouldLock(failedAttempts) {
  return failedAttempts >= maxAttempts();
}

// The moment the lock should end if it starts now
function lockUntilDate(now = Date.now()) {
  return new Date(now + lockMinutes() * 60 * 1000);
}

module.exports = {
  maxAttempts,
  lockMinutes,
  isLocked,
  lockExpired,
  minutesLeft,
  shouldLock,
  lockUntilDate
};
