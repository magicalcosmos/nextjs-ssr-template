import axios, { AxiosError } from 'axios';
import type { ICreateRequestApi } from '~/types/apiRepository';
import store from '~/store';
import { getCookie } from 'cookies-next';
import { authURL } from '@/api/urls';
import ErrorHandler from './errorHandler';
import { ERROR_CODE } from './dict';

const assign = (obj: {}, def: {}) => {
  return Object.assign({}, obj, def);
};

const redirect = (path: string) => {
  if (typeof window !== undefined) {
    window.location.href = path;
  }
};

const NEXT_APP_BASE_API = process.env.NEXT_APP_BASE_API;
const NEXT_APP_MOCK_API = process.env.NEXT_APP_MOCK_API;

const createAxiosInstance = () => {
  const axiosInstance = axios.create({
    timeout: 50000,
    // 默认都是post请求，与后端约定许可证
    method: 'post',
  });

  // 请求拦截
  axiosInstance.interceptors.request.use(
    (config) => {

      if (getCookie('sid')) {
        config.headers.Authorization = `Bearer ${getCookie('sid') }`;
      }

      return config;
    },
    (err) => {
      console.error('[Request Error]：', err);

      return Promise.reject(err);
    }
  );

  // 响应拦截
  // axiosInstance.interceptors.response.use(
  //   (resp) => {
  //     return resp.data;
  //   }, (err) => {
  //     const code = err.response?.status;
  //     console.error('[HTTP Response Error Code]:', code);
  //     console.error('[HTTP Response Error Info]:', err);

  //     if (code === ERROR_CODE.UNAUTHENTICATED) {
  //       // token 失效
  //       redirect('/signin');
  //     }

  //     if (err.isAxiosError) {
  //       console.error('[Axios Response Error Info]:', err);
  //     }

  //     return Promise.reject(err);
  //   }
  // );

  return axiosInstance;
}

// 创建请求api
const createRequestApi: ICreateRequestApi =
  (axiosInstance) =>
  (option, extraOption = {}) => {
    const { dataType = 'json', mock = false, loading = false } = extraOption;
    // 是否 mock 数据模式
    if (mock && NEXT_APP_MOCK_API) {
      option.url = `${NEXT_APP_MOCK_API}${option.url}`;
    } else if (option.url?.indexOf('http') === -1) {
      option.url = `${NEXT_APP_BASE_API}${option.url}`;
    }

    let contentType = '';
    switch (dataType) {
      case 'formData':
        // 发送 formData 数据格式
        contentType = 'application/x-www-form-urlencoded';
        option.data = new URLSearchParams(option.data).toString();
        break;
      case 'formData2':
        // 含文件
        contentType = 'multipart/form-data';
        break;
      default:
    }

    if (contentType) {
      option.headers = assign(
        {
          'Content-Type': contentType,
        },
        option.headers || {},
      );
    }

    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && loading) {
        // $layer.showLoading()
      };

      axiosInstance(option)
        .then(resolve)
        .catch((e: AxiosError) => {
          ErrorHandler(e);
          reject(e);
        })
        .finally(() => {
          // if (window && loading) $layer.closeLoading()
        });
    });
  };

// axios instance
const axiosInstance = createAxiosInstance();

// 二次包装请求方法
const request = createRequestApi(axiosInstance);

export default request;
