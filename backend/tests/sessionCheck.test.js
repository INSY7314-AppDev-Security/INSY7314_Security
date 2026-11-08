const { evaluateSession } = require('../src/utils/sessionCheck');

describe('evaluateSession (token vs current user record)', () => {
  test('accepts a token whose version matches and returns the role from the database', () => {
    const result = evaluateSession({ id: '1', role: 'admin', tv: 2 }, { role: 'client', tokenVersion: 2 });
    expect(result).toEqual({ ok: true, role: 'client' }); // role comes from DB, not the token
  });

  test('rejects a token whose version is older than the user record (after logout)', () => {
    const result = evaluateSession({ id: '1', role: 'client', tv: 0 }, { role: 'client', tokenVersion: 1 });
    expect(result).toEqual({ ok: false, reason: 'token_revoked' });
  });

  test('rejects a token for a user that no longer exists', () => {
    expect(evaluateSession({ id: '1', role: 'client', tv: 0 }, null)).toEqual({
      ok: false,
      reason: 'user_not_found'
    });
  });

  test('treats tokens without a version (issued before this feature) as version 0', () => {
    expect(evaluateSession({ id: '1', role: 'client' }, { role: 'client', tokenVersion: 0 }).ok).toBe(true);
    expect(evaluateSession({ id: '1', role: 'client' }, { role: 'client' }).ok).toBe(true);
    expect(evaluateSession({ id: '1', role: 'client' }, { role: 'client', tokenVersion: 1 }).ok).toBe(false);
  });
});
