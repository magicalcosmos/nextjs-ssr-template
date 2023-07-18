import user, { IUserApiModuleInstance } from './modules/user';
import auth, { IAuthApiModuleInstance } from './modules/auth';
import license, { ILicenseApiModuleInstance } from './modules/license';
import sysUser, { ISysUserApiModuleInstance } from './modules/sysUser';
import sysLicense, { ISysLicenseApiModuleInstance } from './modules/sysLicense';
import { IRequestInstance } from '~/types/apiRepository';
import request from '~/utils/fetch';

/**
 * api 仓库
 */
export interface IApiRepository {
  user: IUserApiModuleInstance;
  auth: IAuthApiModuleInstance;
  license: ILicenseApiModuleInstance;
  sysUser: ISysUserApiModuleInstance;
  sysLicense: ISysLicenseApiModuleInstance;
};

export interface IApiRepositoryFactory {
  (fn: IRequestInstance): IApiRepository;
};

export let $api: IApiRepository;

export const apiRepo: IApiRepositoryFactory = (request) => {
  $api = {
    user: user(request),
    auth: auth(request),
    license: license(request),
    sysUser: sysUser(request),
    sysLicense: sysLicense(request),
  };

  return $api;
};

apiRepo(request);
