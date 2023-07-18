import { licenseURL } from '../urls';
import { IApiModuleContainer, IPagnation, IResponseInstance } from '~/types/apiRepository';

export interface ITestCase {
  expired: string;
  startTime: string;
  'case-format': Array<string>;
  'case-import-format': Array<string>;
};


export interface IUnitTest extends ITestCase {}

export interface IIntegrationTest extends ITestCase {}

export interface ISpecs {
  specs: Array<string>;
  license?: string;
}

export interface IStaticModules {
  certify?: ISpecs;
  cppcheck?: ISpecs;
  hcscli?: ISpecs;
  wukong?: ISpecs;
}
export interface IStaticCheck {
  expired: string;
  startTime: string;
  modules: IStaticModules;
}

export interface ILicenseModules {
  'static-check': IStaticCheck;
  'unit-test': IUnitTest;
  'integration-test': IIntegrationTest;
}

export interface ILicense {
  licenseId?: number;
  licenseName?: string;
  cpuLimit?: number;
  userLimit?: number;
  status?: number;
  expires?: string;
  assignment?: string;
  owner?: string;
  machineCode?: string;
  autoRecycle?: string;
  versionType?: number;
  dataCollection?: number;
  comment?: string;
  language?: Array<string>;
  modules?: ILicenseModules;
}

export interface IRecycleParams {
  licenseId: string;
  recycleCode: string;
}

export interface IListParams {
  userId: number;
  q?: string;
  pagination?: IPagnation;
}


export interface IStatistics {
  assignedCount: number;
  unAssignedCount: number;
  expiredCount: number;
}

export interface ILicenseApiModuleInstance {
  /** 
   * 分发证书
   * @param data
   */
  assign(data: ILicense): Promise<IResponseInstance<ILicense>>;
  /** 
   * 回收证书
   * @param data
   */
  recycle(data: IRecycleParams): Promise<IResponseInstance<{ code: number, message: string }>>;
  /** 
   * 许可证
   * @param data
   */
  list(data: IListParams): Promise<IResponseInstance<{ licenses: ILicense, pagination: IPagnation}>>;
  /** 
   * 用户许可证统计
   * @param data
   */
  overview(data: { userId: number }): Promise<IResponseInstance<IStatistics>>;
  /** 
   * 许可证详情
   * @param data
   */
  detail(data: { licenseIds: Array<number> }): Promise<IResponseInstance<ILicense>>;
};



// 实现接口
const licenseApi: IApiModuleContainer<ILicenseApiModuleInstance> = (request) => ({
  assign(data) {
    return request({
      url: licenseURL.assign,
      data,
    });
  },
  recycle(data) {
    return request({
      url: licenseURL.recycle,
      data,
    });
  },
  list(data) {
    return request({
      url: licenseURL.list,
      data,
    });
  },
  overview(data) {
    return request({
      url: licenseURL.overview,
      data,
    });
  },
  detail(data) {
    return request({
      url: licenseURL.get,
      data,
    });
  },
})

export default licenseApi;
