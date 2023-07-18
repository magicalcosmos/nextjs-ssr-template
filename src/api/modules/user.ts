import { userURL } from '../urls';
import { IApiModuleContainer, IResponseInstance } from '~/types/apiRepository';
export interface IUserInfo {
  /** 用户id */
  id?:           number;
  /** 公司名 */
  companyName:   string;
  /** 用户类型 */
  type:          Array<number>;
  /** 角色 */
  role:          Array<number>;
  /** 语言 */
  comment:          string;
};

// 定义接口
export interface IUserApiModuleInstance {
  /** 修改密码 */
  changePassword(data: {
    passwordOld: string,
    passwordNew: string,
    passwordConfirm: string,
  }): Promise<IResponseInstance<{}>>;
  /** 获取用户信息 */
  userInfo(): Promise<IResponseInstance<IUserInfo>>;
};

// 实现接口
const userApi: IApiModuleContainer<IUserApiModuleInstance> = (request) => ({
  changePassword(data) {
    return request({
      url: userURL.changePassword(),
      data,
    });
  },
  userInfo() {
    return request({
      url: userURL.me,
    });
  },
})

export default userApi;
