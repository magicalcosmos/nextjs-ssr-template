// pm2 config for production
module.exports = {
  apps: [
    {
      name: 'sha_beer',
      // exec_mode: 'cluster',
      // instances: '2', // Or a number of instances
      script: './server/index.js',
      /** centos目录只能部署17及以下 */
      interpreter: '/usr/local/n/versions/node/17.9.1/bin/node',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 3389,
        NEXT_APP_ENV: 'production',
      },
      env_production: {
        HOST: '0.0.0.0',
        PORT: 3389,
        NEXT_APP_ENV: 'production',
        NODE_ENV: 'production'
      }
    },
  ],
}