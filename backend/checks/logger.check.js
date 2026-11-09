// Checks for the logger: masking, the log file, and the Grafana Cloud (Loki) sending.
// Run with: npm run test:checks
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

test('maskEmail hides most of the address', () => {
  process.env.NODE_ENV = 'test';
  const { maskEmail } = require('../src/utils/logger');
  assert.equal(maskEmail('jane.doe@example.com'), 'j***@example.com');
  assert.equal(maskEmail(undefined), 'unknown');
  assert.equal(maskEmail('not-an-email'), 'unknown');
  assert.equal(maskEmail({ $gt: '' }), 'unknown');
});

// This script runs in a separate process, as the real server would, with
// logging switched on and no test mode.
function runLoggerProcess(env, code) {
  return spawnSync(process.execPath, ['-e', code], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, NODE_ENV: 'production', ...env },
    encoding: 'utf8'
  });
}

test('events are written as JSON lines with an "event" field, and passwords never appear', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hh-logs-'));
  const result = runLoggerProcess(
    { LOG_DIR: dir },
    `const l = require('./src/utils/logger');
     l.info('LOGIN_SUCCESS', { userId: 'u1', role: 'freelancer', ip: '::1' });
     l.warn('LOGIN_FAILED', { reason: 'wrong_password', email: l.maskEmail('sam@example.com') });
     l.error('SERVER_ERROR', { error: 'boom' });
     setTimeout(() => process.exit(0), 400);`
  );
  assert.equal(result.status, 0, result.stderr);

  const combined = fs.readFileSync(path.join(dir, 'combined.log'), 'utf8').trim().split('\n').map(JSON.parse);
  assert.equal(combined.length, 3);
  assert.equal(combined[0].event, 'LOGIN_SUCCESS');
  assert.equal(combined[0].service, 'hustlehub-api');
  assert.equal(combined[1].email, 's***@example.com');
  assert.ok(combined[0].timestamp);

  // error.log only holds warnings and errors
  const errors = fs.readFileSync(path.join(dir, 'error.log'), 'utf8').trim().split('\n').map(JSON.parse);
  assert.deepEqual(errors.map((e) => e.event), ['LOGIN_FAILED', 'SERVER_ERROR']);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('with the three GRAFANA_ values set, logs are sent to Loki with login details and JSON lines', async () => {
  const received = [];
  const loki = http.createServer((req, res) => {
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      received.push({ url: req.url, auth: req.headers.authorization, body: JSON.parse(body) });
      res.writeHead(204);
      res.end();
    });
  });
  await new Promise((resolve) => loki.listen(0, '127.0.0.1', resolve));
  const port = loki.address().port;

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hh-logs-'));
  // The server must be able to answer while the logger process runs, so the
  // logger process is started without blocking (spawn, not spawnSync).
  const child = spawn(
    process.execPath,
    [
      '-e',
      `const l = require('./src/utils/logger');
       l.info('BOOKING_CREATED', { bookingId: 'b1', amount: 650 });
       l.warn('LOGIN_FAILED', { reason: 'wrong_password' });
       setTimeout(() => process.exit(0), 7500);`
    ],
    {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        NODE_ENV: 'production',
        LOG_DIR: dir,
        GRAFANA_LOKI_URL: `http://127.0.0.1:${port}`,
        GRAFANA_LOKI_USER: '123456',
        GRAFANA_LOKI_TOKEN: 'glc_test_token'
      }
    }
  );
  let stderr = '';
  child.stderr.on('data', (d) => (stderr += d));
  const exitCode = await new Promise((resolve) => child.on('close', resolve));
  loki.close();
  fs.rmSync(dir, { recursive: true, force: true });

  assert.equal(exitCode, 0, stderr);
  assert.ok(received.length >= 1, 'Loki should have received at least one batch');

  const push = received[0];
  assert.equal(push.url, '/loki/api/v1/push');
  assert.equal(push.auth, 'Basic ' + Buffer.from('123456:glc_test_token').toString('base64'));

  const streams = received.flatMap((r) => r.body.streams);
  assert.ok(streams.every((s) => s.stream.app === 'hustlehub'), 'every stream has the app label');
  const lines = streams.flatMap((s) => s.values.map((v) => JSON.parse(v[1])));
  assert.ok(lines.some((l) => l.event === 'BOOKING_CREATED' && l.amount === 650));
  assert.ok(lines.some((l) => l.event === 'LOGIN_FAILED'));
});
