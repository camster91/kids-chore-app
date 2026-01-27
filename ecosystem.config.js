module.exports = {
  apps: [{
    name: 'kids-chore-app',
    script: '.next/standalone/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0'
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    merge_logs: true
  }]
}
