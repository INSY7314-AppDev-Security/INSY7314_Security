// Decides whether a verified JWT may still be used, by comparing it with the
// user's current record in the database. Pure function, easy to unit test.
//
// decoded: the verified token payload ({ id, role, tv })
// user:    the user as stored now ({ role, tokenVersion }) or null if deleted
//
// Returns { ok: true, role } or { ok: false, reason }.
function evaluateSession(decoded, user) {
  if (!user) {
    return { ok: false, reason: 'user_not_found' };
  }

  // Tokens issued before this feature existed have no "tv": treat them as version 0.
  const tokenVersionInJwt = Number.isInteger(decoded.tv) ? decoded.tv : 0;
  const currentVersion = Number.isInteger(user.tokenVersion) ? user.tokenVersion : 0;

  if (tokenVersionInJwt !== currentVersion) {
    return { ok: false, reason: 'token_revoked' };
  }

  // The role comes from the database, not from the token, so a demoted
  // user loses access immediately instead of when the token expires.
  return { ok: true, role: user.role };
}

module.exports = { evaluateSession };
