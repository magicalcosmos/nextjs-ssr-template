// pm2 config for test
module.exports = {
  apps: [
    {
      name: 'sha_beer',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: './server/index.js',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 3389,
        NEXT_APP_ENV: 'test',
      },
    },
  ],
}