const axios = require('axios');
const envConfig = require('../../configuration');
const utils = require('../utils');


const { NEXT_APP_ENV } = process.env

const { NEXT_APP_BASE_API } = envConfig(NEXT_APP_ENV)
axios.defaults.baseURL = NEXT_APP_BASE_API;
module.exports = () => {
  return async (ctx, next) => {
    if (utils.getCookie(ctx, 'sid')) {
      axios.defaults.headers.common.Authorization = `Bearer ${utils.getCookie(ctx, 'sid')}`;
    }
    ctx.$axios = axios;
    await next();
  }
}
