import { sysLicenseURL } from '../urls';
import { IApiModuleContainer, IResponseInstance } from '~/types/apiRepository';
import * as TypeLicense from '~/types/licenses';



// 定义接口
export interface ISysLicenseApiModuleInstance {
  list(data: TypeLicense.TSysLicenseQuery, url?: string): Promise<IResponseInstance<{
    pagination: TypeLicense.TPaginationResponse,
    licenses: TypeLicense.TSysLicense[]
  }>>;
  detail(data: {
    licenseIds: number[];
  }): Promise<IResponseInstance<TypeLicense.TLicenseDetail[]>>;
  create(data: {
    userId: number,
    licenses: TypeLicense.TLicenseDetail[]
  }): Promise<IResponseInstance<{}>>;
  update(data: {
    licenses: TypeLicense.TLicenseDetail[]
  }): Promise<IResponseInstance<{}>>;
  delete(data: {
    licenseIds: number[];
  }): Promise<IResponseInstance<{}>>;
};

// 实现接口
const sysUserApi: IApiModuleContainer<ISysLicenseApiModuleInstance> = (request) => ({
  list(data) {
    return request({
      url: sysLicenseURL.list,
      data,
    });
  },
  detail(data) {
    return request({
      url: sysLicenseURL.detail,
      data,
    });
  },
  create(data) {
    return request({
      url: sysLicenseURL.create,
      data,
    });
  },
  update(data) {
    return request({
      url: sysLicenseURL.update,
      data,
    });
  },
  delete(data) {
    return request({
      url: sysLicenseURL.delete,
      data,
    });
  },
})

export default sysUserApi;
