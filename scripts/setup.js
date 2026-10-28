// Runs automatically after `npm install`.
// Creates backend/.env and frontend/.env from their .env.example files if they
// don't exist yet, filling in a random JWT_SECRET. Existing .env files are never touched.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

for (const dir of ['backend', 'frontend']) {
  const target = `${dir}/.env`;
  if (existsSync(target)) continue;

  const content = readFileSync(`${dir}/.env.example`, 'utf8').replace(
    /^JWT_SECRET=.*$/m,
    `JWT_SECRET=${randomBytes(48).toString('hex')}`,
  );
  writeFileSync(target, content);
  console.log(`Created ${target}`);
}
