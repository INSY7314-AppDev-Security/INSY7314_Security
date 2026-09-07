// generate-cert.js
//
// Generates a local self-signed TLS certificate for development,
// as an alternative for teammates who don't have OpenSSL installed.
// Run this once with: node generate-cert.js

const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

async function main() {
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = await selfsigned.generate(attrs, { days: 365, algorithm: 'sha256', keySize: 2048 });

  const certsDir = path.join(__dirname, 'certs');

  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir);
  }

  fs.writeFileSync(path.join(certsDir, 'key.pem'), pems.private);
  fs.writeFileSync(path.join(certsDir, 'cert.pem'), pems.cert);

  console.log('Certificate generated at backend/certs/key.pem and backend/certs/cert.pem');
}

main();