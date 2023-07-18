const devConfig = require('./env/env.development');

module.exports = function (env) {
  switch (env) {
    case 'development':
      return devConfig;
    case 'test':
      return require('./env/env.test');
    case 'production':
      return require('./env/env.production');
    default:
      return devConfig
  }
}