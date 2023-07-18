import { sysUserURL } from '../urls';
import { IApiModuleContainer, IResponseInstance } from '~/types/apiRepository';
import * as TypeLicense from '~/types/licenses';



// 定义接口
export interface ISysUserApiModuleInstance {
  list(data: TypeLicense.TSysUserQuery, url?: string): Promise<IResponseInstance<{
    pagination: TypeLicense.TPaginationResponse,
    users: TypeLicense.TSysUser[]
  }>>;
  overview(): Promise<IResponseInstance<TypeLicense.TSysUserCount>>;
  detail(data: {
    id: number;
  }): Promise<IResponseInstance<TypeLicense.TSysUserDetail>>;
  create(data: TypeLicense.TSysUserDetail): Promise<IResponseInstance<{}>>;
  update(data: TypeLicense.TSysUserDetail): Promise<IResponseInstance<{}>>;
  delete(data: {
    id: number;
  }): Promise<IResponseInstance<{}>>;
};

// 实现接口
const sysUserApi: IApiModuleContainer<ISysUserApiModuleInstance> = (request) => ({
  list(data) {
    return request({
      url: sysUserURL.list,
      data,
    });
  },
  overview() {
    return request({
      url: sysUserURL.overview,
    });
  },
  detail(data) {
    return request({
      url: sysUserURL.detail,
      data,
    });
  },
  create(data) {
    return request({
      url: sysUserURL.create,
      data,
    });
  },
  update(data) {
    return request({
      url: sysUserURL.update,
      data,
    });
  },
  delete(data) {
    return request({
      url: sysUserURL.delete,
      data,
    });
  },
})

export default sysUserApi;
