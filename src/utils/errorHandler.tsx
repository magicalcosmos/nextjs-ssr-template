import { AxiosError, AxiosResponse } from "axios";
import message from './message';
import { getCookie } from 'cookies-next';
import { translate } from './localTranslate';
import { ERROR_CODE } from './dict';
import { $api } from "~/api";

type TResponse = {
  code: number | string;
  msg: string;
  traceId?: string;
};


export default function ErrorHandler(resp: AxiosError) {
  const status = resp.response && resp.response.status;
  const data = (resp.response && resp.response.data || resp) as TResponse;
  if (getCookie('_e') === 'I am sha_beer') {
    console.error(JSON.stringify(resp, null, 2));
  }

  let error = '';
  if (status === 500) {
    switch (data.code) {
      case ERROR_CODE.MIN_STRING_LENGTH: // 参数输入错误
        error = translate('exception', 'min_string_length');
        break;

      case ERROR_CODE.UNAUTHENTICATED: // 未授权
        error = translate('exception', 'unauthenticated');
        // 退出登录
        $api.auth.signOut().finally(() => {
          location.href = '/signin';
        });
        break;
      case ERROR_CODE.FORBIDDEN: // 没有权限
        error = translate('exception', 'forbidden');
        break;
      case ERROR_CODE.USER_NOT_EXIST: // 用户不存在
        error = translate('exception', 'user_not_exist');
        break;
      case ERROR_CODE.LOGIN_USER_PASSWORD_NOT_MATCH: // 登录时，密码错误
        error = translate('exception', 'login_username_password_not_match');
        break;
      case ERROR_CODE.CHANGE_OLD_NEW_PASSWORD_SAME: // 修改密码时，新旧密码一样
        error = translate('exception', 'change_old_new_password_same');
        break;
      case ERROR_CODE.CHANGE_OLD_NEW_PASSWORD_DIFF: // 修改密码时，新密码和确认密码不一致
        error = translate('exception', 'change_old_new_password_diff');
        break;
      case ERROR_CODE.USER_EXISTED: // 用户名已存在
        error = translate('exception', 'user_existed');
        break;
      case ERROR_CODE.NO_FILED_CHANGE: // 修改用户信息时，未改变任何字段
        error = translate('exception', 'no_field_change');
        break;
      case ERROR_CODE.CHANGE_USER_OLD_NEW_PASSWORD_NOT_MATCH: // 修改密码时，旧密码错误
        error = translate('exception', 'change_user_old_new_password_not_match');
        break;

      case ERROR_CODE.LICENSE_NOT_EXIST: // 许可证不存在
        error = translate('exception', 'license_not_exist');
        break;
      case ERROR_CODE.LICENSE_DUPLICATE: // 许可证重名
        error = translate('exception', 'license_duplicate');
        break;
      case ERROR_CODE.LICENSE_ASSIGNED_NO_EDIT: // 已分发的许可证不允许编辑
        error = translate('exception', 'license_assigned_no_edit');
        break;
      case ERROR_CODE.LICENSE_NOT_BELONG_CURRENT_USER: // 许可证不属于当前用户
        error = translate('exception', 'license_no_belong_current_user');
        break;
      case ERROR_CODE.LICENSE_ASSIGN_EXCEPTION: // 许可证颁发当前状态异常
        error = translate('exception', 'license_assign_exception');
        break;
      case ERROR_CODE.LICENSE_RECYCLE_EXCEPTION: // 许可证回收当前状态异常
        error = translate('exception', 'license_recycle_exception');
        break;
      case ERROR_CODE.LICENSE_ASSIGN_FAILED: // 许可证颁发失败
        error = translate('exception', 'license_assign_failed');
        break;
      case ERROR_CODE.LICENSE_RECYCLE_FAILED: // 许可证回收失败 
        error = translate('exception', 'license_recycle_failed');
        break;
      case ERROR_CODE.LICENSE_NO_KEY_CHAIN: // 缺少许可证密钥
        error = translate('exception', 'license_no_key_chain');
        break;
      case ERROR_CODE.NETWORK_ERROR: // 网络连接错误
        error = translate('exception', 'network_exception');
        break;
      default: // 未知错误
        error = translate('exception', 'network_exception');
    }
  }
  if (error) {
    message.error({
      content:  error,
    });
  }
};