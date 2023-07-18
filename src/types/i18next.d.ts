import 'i18next';
import common from '../../public/locales/zh/common.json';
import exception from '../../public/locales/zh/exception.json';
import header from '../../public/locales/zh/header.json';
import home from '../../public/locales/zh/home.json';
import license from '../../public/locales/zh/license.json';
import login from '../../public/locales/zh/login.json';
import resetPassword from '../../public/locales/zh/resetPassword.json';
import secondPage from '../../public/locales/zh/second-page.json';
import sideBar from '../../public/locales/zh/side-bar.json';
import sysUsers from '../../public/locales/zh/sys-users.json';


interface I18nNamespaces {
  common: typeof common;
  exception: typeof exception;
  header: typeof header;
  license: typeof license;
  home: typeof home;
  login: typeof login;
  resetPassword: typeof resetPassword;
  secondPage: typeof secondPage;
  sideBar: typeof sideBar;
  sysUsers: typeof sysUsers;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common',
    resources: I18nNamespaces;
  }
}