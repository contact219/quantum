const fs   = require('fs');
const path = require('path');

const env = {};
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^#=][^=]*)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
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
