const fs   = require('fs');
const path = require('path');

const env = {};
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^#=][^=]*)=(.*)$/);
    if (m) {
      let v = m[2].trim();
      // .env values are quoted so shell-sourcing consumers (health-check cron's
      // `set -a; . ./.env`) survive & and ? in URLs. Node must strip the quotes
      // or DATABASE_URL arrives as 'postgresql://...' and Neon throws
      // ERR_INVALID_URL (took the site down 2026-08-24 on a pm2 delete+start).
      if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
        v = v.slice(1, -1);
      }
      env[m[1].trim()] = v;
    }
  });
}

module.exports = {
  apps: [{
    name:          'quantumsurety',
    script:        './dist/index.js',
    cwd:           '/var/www/quantumsurety',
    env:           env,
    restart_delay: 3000,
    max_restarts:  10,
  }]
};
