// One place to record security events (failed logins, lockouts, logouts...).
// For now it writes a JSON line to the console. The logging work (Part 3)
// can replace the inside of this function with the cloud logger without
// touching any of the code that calls it.
// NEVER pass passwords, tokens or hashes in "details".
function logSecurityEvent(event, details = {}) {
  const entry = { time: new Date().toISOString(), event, ...details };
  const level = ['ACCOUNT_LOCKED', 'LOGIN_BLOCKED_LOCKED'].includes(event) ? 'warn' : 'info';
  console[level](JSON.stringify(entry));
}

module.exports = { logSecurityEvent };
