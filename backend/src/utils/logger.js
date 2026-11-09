const path = require('path');
const winston = require('winston');

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

// Where the log files go. In Docker this folder is a volume.
const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, '..', '..', 'logs');

// Tests and checks stay quiet and do not write files or call the cloud
const isTest = process.env.NODE_ENV === 'test';

// Copies the event name into its own "event" field, so in Grafana you can
// filter with:  | json | event="LOGIN_FAILED"
const addEventField = winston.format((info) => {
  info.event = info.message;
  return info;
});

// Readable one-line format for the console
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ level, message, timestamp: time, service, event, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${time} ${level} ${message}${extra}`;
  })
);

const transports = [new winston.transports.Console({ format: consoleFormat, silent: isTest })];

if (!isTest) {
  // Every event (info and above)
  transports.push(
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'combined.log'),
      maxsize: 5 * 1024 * 1024, // start a new file at 5 MB
      maxFiles: 3
    })
  );
  // Only warnings and errors, so problems are easy to find
  transports.push(
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'warn',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3
    })
  );
}

// Cloud logging with Grafana Cloud Loki. It only turns on when all three
// values are set in .env, so the app still works without them.
const lokiConfigured =
  process.env.GRAFANA_LOKI_URL && process.env.GRAFANA_LOKI_USER && process.env.GRAFANA_LOKI_TOKEN;

if (!isTest && lokiConfigured) {
  try {
    const LokiTransport = require('winston-loki');
    transports.push(
      new LokiTransport({
        host: process.env.GRAFANA_LOKI_URL, // for example https://logs-prod-006.grafana.net
        basicAuth: `${process.env.GRAFANA_LOKI_USER}:${process.env.GRAFANA_LOKI_TOKEN}`,
        // Labels are kept few on purpose. The event name stays inside the JSON line.
        labels: { app: 'hustlehub', env: process.env.NODE_ENV || 'development' },
        json: true,
        format: combine(timestamp(), addEventField(), json()),
        batching: true,
        interval: 5, // send a batch every 5 seconds
        replaceTimestamp: true,
        gracefulShutdown: true,
        onConnectionError: (err) => console.error('Grafana Loki connection problem:', err.message)
      })
    );
  } catch (error) {
    console.error('Cloud logging could not start:', error.message);
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), addEventField(), json()),
  defaultMeta: { service: 'hustlehub-api' },
  transports
});

// Emails are personal data, so logs only show a masked version: j***@example.com
function maskEmail(email) {
  if (typeof email !== 'string' || !email.includes('@')) return 'unknown';
  const [name, domain] = email.split('@');
  return `${name.charAt(0)}***@${domain}`;
}

module.exports = logger;
module.exports.maskEmail = maskEmail;
module.exports.cloudLoggingEnabled = Boolean(!isTest && lokiConfigured);

//Plain English Breakdown for clarity
/*
This is the one logger the whole app uses.
Every event is written as one JSON line with a time, an event name (for example
LOGIN_FAILED) and details. Lines go to the console, to logs/combined.log (all
events) and to logs/error.log (warnings and errors).
If GRAFANA_LOKI_URL, GRAFANA_LOKI_USER and GRAFANA_LOKI_TOKEN are set in .env,
the same lines are also sent to Grafana Cloud, where they can be searched.
We never log passwords or tokens, and emails are masked.
*/
