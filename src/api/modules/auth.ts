import { authURL } from '../urls';
import { IApiModuleContainer, IResponseInstance } from '~/types/apiRepository';

export interface ILogin {
  /** 鉴权token */
  token:  string;
  /** 鉴权token有效期 */
  expires: string;
};


// 定义接口
export interface IAuthApiModuleInstance {
  signIn(data: {
    username: string,
    password: string,
  }, url?: string): Promise<IResponseInstance<ILogin>>;

  signOut(): Promise<IResponseInstance<{}>>;
};

// 实现接口
const userApi: IApiModuleContainer<IAuthApiModuleInstance> = (request) => ({
  signIn(data) {
    return request({
      url: authURL.login(),
      data,
    });
  },
  signOut(url?: string) {
    return request({
      url: authURL.logout(),
    });
  }
})

export default userApi;
