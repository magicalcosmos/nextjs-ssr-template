import * as Dict from "~/utils/dict";

/**
 * 管理端证书列表
 */
type TSysLicense = {
  id: number;
  licenseName: string;
  licenseCode: string;
  owner: string;
  cpuLimit: number;
  userLimit: number;
  expires: string;
  status: Dict.TLicenseUsageStatus;
  assignComment: string;
  comment: string;
};

/**
 * 管理端用户个数
 */
type TSysUserCount = {
  total: number;
  inUse: number;
  expired: number;
};

/**
 * 管理端用户列表请求数据
 */
type TSysUserQuery = {
  pagination: TPaginationQuery;
  q?: string;
  type?: Dict.TUserType;
};

/**
 * 管理端用户列表
 */
type TSysUser = {
  username: string;
  companyName: string;
  type: Dict.TUserType;
  roles: Dict.TUserRole[];
  comment: string;
  id: number | null;
  licenseStatus: Dict.TLicenseStatus | null;
  licenseCount: number;
};

/**
 * 管理端用户详情
 */
type TSysUserDetail = {
  password?: string;
} & TSysUser;

/**
 * 管理端证书详情
 */
type TLicenseDetail = {
  id?: number;
  licenseId?: string;
  licenseName: string;
  cpuLimit: number | null;
  userLimit: number | null;
  status?: Dict.TLicenseUsageStatus;
  autoRecycle?: string | null;
  /**版本类型*/
  versionType: Dict.TVersionType;
  comment?: string;
  /**数据收集*/
  dataCollection: Dict.TDataCollection;
  language: string[];
  modules: {
    "static-check"?: {
      expired: string;
      startTime: string;
      modules: { 
        [key: string]: {
          specs: string[];
          license?: string;
        };
      };
    };
    "unit-test"?: {
      expired: string;
      startTime: string;
      "case-format": string[];
      "case-import-format": string[];
    };
    "integration-test"?: {
      expired: string;
      startTime: string;
      "case-format": string[];
      "case-import-format": string[];
    };
  };
};

/**
 * 管理端用户列表请求数据
 */
type TSysLicenseQuery = {
  pagination: TPaginationQuery;
  q?: string;
  userId: number;
};

/** 分页 */
type TPaginationQuery = {
  page: number;
  perPage: number;
};

/** 分页 */
type TPaginationResponse = {
  total: number;
} & TPaginationQuery;