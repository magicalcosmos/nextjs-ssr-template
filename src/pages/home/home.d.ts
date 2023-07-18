type Summary = {
  licenseId?: string;
  id?: string;
  licenseName: string;
  cpuLimit: number;
  userLimit: number;
  expires: string;
  status: number;
  assignComment: string;
  owner: string;
  autoRecycle?: string;
  licenseCode: string;
};

interface IHomeProps {
  t: Function;
  visible: Boolean;
  license?: any;
  setShowDialog: Function;
  reload?: Function;
};