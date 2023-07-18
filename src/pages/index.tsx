import Router, { withRouter } from 'next/router';
import { useState, useEffect, type ChangeEvent } from 'react';
import { $api } from '~/api';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, NextPage, InferGetStaticPropsType } from 'next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SideMenu from '~/layouts/components/SideMenu';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import BaseDialog from '~/layouts/components/BaseDialog';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '~/layouts/components/Pagination';

import message from '~/utils/message';

import * as TypeLicense from '~/types/licenses';
import * as Dict from '~/utils/dict';
import { sha256 } from '~/utils/sha256';
import { useAppDispatch } from '~/store';
import { hideLoading, showLoading } from '~/store/module/globalLoading/reducer';

const SysUsers: NextPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(['sys-users', 'common']);

  const dispatch = useAppDispatch();

  const dialogType = {
    create: 0,
    update: 1,
    delete: 2
  };

  const { router } = props;

  /**
   * filter license status
   * @param status 
   * @returns 
   */
  const filterLicenseStatus = (status: Dict.TLicenseStatus) => {
    let className = '';
    let text = '';
    switch (status) {
      case Dict.LICENSE_STATUS.IN_USE:
        className = 'green';
        text = t('license-using');
      break;
      case Dict.LICENSE_STATUS.NOT_CREATE:
        className = 'default';
        text = t('license-unset');
      break;
      case Dict.LICENSE_STATUS.EXPIRED:
        className = 'red';
        text = t('license-expired');
      break;
    }
    return (
      <span className={`status-badge ${className}`}>{text}</span>
    );
  }

  /**
   * close dialog
   * @param status
   */
  const handleCloseDialog = () => {
    useDialogProps(Object.assign({}, dialogProps, {
      open: false
    }));
  }

  /**
   * generate password
   */
  const handleGeneratePassword = () => {
    const param = JSON.parse(JSON.stringify(userForm));
    const randomNum = parseInt((Math.random()*1000000).toString(), 10);
    const random = randomNum.toString();
    param.password = random.length < 6 ? (randomNum * Math.pow(10, Math.abs(6 - random.length))).toString() : random;
    useUserForm(param);
  }

  /**
   * input form
   * @param name 
   * @param value 
   */
  const setUserForm = (name: string, value: any) => {
    useUserForm({
      ...userForm,
      [name]: value
    });
  }

  /**
   * open update user dialog
   * @param status 
   * @returns 
   */
  const handleOpenUpdateUser = async (title: string, row?: TypeLicense.TSysUser) => {
    if (row) {
      const userDetailData = await fetchUserDetail(row.id as number);
      useUserForm(userDetailData.data);
      useDialogType(dialogType.update);
    } else {
      useUserForm(originForm);
      useDialogType(dialogType.create);
    }
    useDialogProps(Object.assign({}, dialogProps, {
      title: title,
      dialogClass: 'admin-update-user',
      open: true,
      onCancel: handleCloseDialog,
      onClose: handleCloseDialog
    }));
  }

  /**
   * valid userForm when save
   */
  const validUpdateForm = () => {
    let msg = '';
    if (!userForm.companyName) {
      msg = 'sys-users:please-input-company-name';
    }
    if (!userForm.username || userForm.username && /^[0-9a-zA-Z]+$/.test(userForm.username) === false) {
      msg = 'sys-users:user-name-format';
    }
    if (typeOfDialog === dialogType.create) {
      if (!userForm.password) {
        msg = 'sys-users:limit-password';
      }
    } else {
      if (!userForm.password) {
        delete userForm.password;
      }
    }
    if (userForm.password) {
      if (userForm.password.length < 6) {
        msg = 'sys-users:limit-password';
      }
    }
    if (msg) {
      message.error({
        content: t(msg),
      });
      return false;
    }
    return true;
  }

  /**
   * update user dialog confirm
   */
  const handleUpdateUserConfirm = () => {
    if (typeOfDialog === dialogType.delete) {
      handleDeleteUserConfirm();
    } else {
      let saveApi;
      if (validUpdateForm()) {
        const param = JSON.parse(JSON.stringify(userForm));
        if (param.password) {
          param.password = sha256(param.password);
        }
        dispatch(showLoading());
        if (typeOfDialog === dialogType.create) {
          saveApi = $api.sysUser.create;
        } else {
          saveApi = $api.sysUser.update;
        }
        saveApi(param).then((res) => {
          freshCurrentPage();
          handleCloseDialog();
          message.success({
            content: t('common:success-message'),
          });
        }).catch(() => {}).finally(() => {
          dispatch(hideLoading());
        });
      }
    }
  }

  /**
   * delete user dialog confirm
   */
  const handleDeleteUserConfirm = () => {
    $api.sysUser.delete({ id: userForm.id as number }).then(() => {
      freshCurrentPage();
      handleCloseDialog();
      message.success({
        content: t('common:success-message'),
      });
    }).catch(() => {});
  }

  /**
   * open delete user dialog
   * @param status 
   * @returns 
   */
  const handleOpenDeleteUser = (row: TypeLicense.TSysUser) => {
    useUserForm(row);
    useDialogType(dialogType.delete);
    useDialogProps(Object.assign({}, dialogProps, {
      title: t('common:tip-title'),
      dialogClass: 'tip-base-dialog',
      open: true,
      onCancel: handleCloseDialog,
      onClose: handleCloseDialog
    }));
  }

  /**
   * to license list of one user
   * @param status 
   */
  const toLicenseList = (row: TypeLicense.TSysUser) => {
    Router.push({
      pathname: '/sysLicenses',
      query: {
        userId: row.id
      }
    });
  }

  /**
   * fetch user list
   */
  const fetchList = () => {
    dispatch(showLoading());
    const param: TypeLicense.TSysUserQuery = {
      pagination
    };
    const userType = new URLSearchParams(window.location.search).get('user_type');
    if (userType) {
      param.type = Number(userType) as Dict.TUserType;
    }
    if (q) {
      param.q = q;
    }
    $api.sysUser.list(param).then((res) => {
      useTotal(res.data.pagination.total);
      useUser(res.data?.users);
    }).catch(() => {}).finally(() => {
      dispatch(hideLoading());
    });
  }

  /**
   * fetch user overview
   */
  const fetchOverview = () => {
    $api.sysUser.overview().then((res) => {
      useOverview(res.data);
    }).catch(() => {})
  }

  /**
   * fetch user detail
   */
  const fetchUserDetail = (id: number) => {
    return $api.sysUser.detail({ id });
  }

  /** 
   * 切换页数
   */
  const handlePageChange = (value: number) => {
    usePagination({
      ...pagination,
      page: value
    });
  }

  /** 
   * 切换条数
   */
  const handlePerPageChange = (value: number) => {
    usePagination({
      page: 1,
      perPage: value
    });
  }

  /** 当前操作数据 */
  const [pagination, usePagination] = useState({
    page: 1,
    perPage: 10
  });
  const [total, useTotal] = useState(0);

  /** 搜索关键字 */
  const [q, useQ] = useState('');

  /** 列表数据 */
  const [users, useUser] = useState<TypeLicense.TSysUser[]>([]);

  /** 用户信息总览 */
  const [overview, useOverview] = useState<TypeLicense.TSysUserCount>({
    total: 0,
    inUse: 0,
    expired: 0
  });

  /** 表单原始数据 */
  const originForm = {
    "username": '',
    "companyName": '',
    "type": Dict.USER_TYPE.APPROVAL,
    "roles": [
      Dict.USER_ROLE.REGULAR
    ],
    "comment": '',
    "password": '',
    "id": null,
    "licenseStatus": null,
    "licenseCount": 0
  };
  /** 表单数据 */
  const [userForm, useUserForm] = useState<TypeLicense.TSysUserDetail>(originForm);

  /** 弹框数据 */
  const [dialogProps, useDialogProps] = useState({
    t: t,
    open: false
  });

  /** 是否是删除用户弹框 */
  const [typeOfDialog, useDialogType] = useState<number>(dialogType.delete);

  const freshCurrentPage = () => {
    fetchList();
    fetchOverview();
  }

  const init = () => {
    handlePageChange(1);
    fetchOverview();
  }
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    handlePageChange(1);
  }, [q]);
  useEffect(() => {
    fetchList();
  }, [pagination]);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <SideMenu t={t} user_type={router.query?.user_type} onChange={init}></SideMenu>
        <Box className="users-container" sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex' }}>
            <Typography className="users-overview" variant="body2" sx={{ flexGrow: 1 }}>
              {t('license-overview', overview)}
            </Typography>
            <Box className="search-input" sx={{ display: 'flex' }}>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={t('common:search')}
                value={q}
                onChange={(event) => useQ(event.target.value)}
              />
              <IconButton type="button" aria-label="search">
                <i className="icon icon-search" />
              </IconButton>
            </Box>
            <Button className="add-button" variant="contained" onClick={() => handleOpenUpdateUser(t('add-user'))}>{t('add-user')}</Button>
          </Box>
          <TableContainer>
            <Table className="user-list" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell className="pl-50">{t('company-name')}</TableCell>
                  <TableCell>{t('user-name')}</TableCell>
                  <TableCell align="center">{t('license-count')}</TableCell>
                  <TableCell align="center">{t('license-status')}</TableCell>
                  <TableCell style={{ width: '35%' }} align="center">{t('user-remark')}</TableCell>
                  <TableCell style={{ width: 150 }} align="center">{t('user-operate')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((row: TypeLicense.TSysUser) => (
                  <TableRow key={row.id}>
                    <TableCell className="cursor-pointer pl-50" onClick={() => toLicenseList(row)}>{row.companyName}</TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell align="center">{row.licenseCount}</TableCell>
                    <TableCell align="center">{filterLicenseStatus(row.licenseStatus as Dict.TLicenseStatus)}</TableCell>
                    <TableCell align="center">
                      <div className="long-text text-ellipse" title={row.comment}>{row.comment}</div>
                    </TableCell>
                    <TableCell align="center">
                      <span onClick={() => handleOpenUpdateUser(t('user-edit-title'), row)} className="edit cursor-pointer">{t('user-edit')}</span>
                      <span onClick={() => handleOpenDeleteUser(row)} className="delete cursor-pointer">{t('user-delete')}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <caption className="table-blank">{!users || !users.length ? t('common:no-data') : ''}</caption>
            </Table>
          </TableContainer>
          {users.length ?
            <Pagination
              t={t}
              {...pagination}
              total={total}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange} /> : ''}
        </Box>
      </Box>
      <BaseDialog 
        {...dialogProps}
        onConfirm={handleUpdateUserConfirm}
        contentBody={
          typeOfDialog === dialogType.delete ? (
            <>
              <i className="icon icon-warning"></i>
              <span className="warning-text">{t('delete-user-tips')}</span>
            </>
          ) : (
            <form>
              <Box className="form-line">
                <Typography className="form-line-label required" variant="body2" sx={{ flexGrow: 1 }}>
                  {t('user-type')}
                </Typography>
                <RadioGroup
                  row
                  value={userForm.type}
                  name="type"
                  className="form-line-content form-radio"
                  onChange={event => setUserForm('type', Number(event.target.value))}
                >
                  <FormControlLabel value={Dict.USER_TYPE.PAID} control={<Radio size="small" />} label={t('user-paid')} />
                  <FormControlLabel value={Dict.USER_TYPE.APPROVAL} control={<Radio size="small" />} label={t('user-approval')} />
                  <FormControlLabel value={Dict.USER_TYPE.INTERNAL} control={<Radio size="small" />} label={t('user-internal')} />
                </RadioGroup>
              </Box>
              <Box className="form-line">
                <Typography className="form-line-label required" variant="body2" sx={{ flexGrow: 1 }}>
                  {t('company-name')}
                </Typography>
                <Box className="form-line-content">
                  <input className="form-input" name="companyName" defaultValue={userForm.companyName} onChange={event => setUserForm('companyName', event.target.value)} placeholder={t('please-input-company-name')} />
                </Box>
              </Box>
              <Box className="form-line">
                <Typography className="form-line-label required" variant="body2" sx={{ flexGrow: 1 }}>
                  {t('user-name')}
                </Typography>
                <Box className="form-line-content">
                  <input className="form-input" defaultValue={userForm.username} onChange={event => setUserForm('username', event.target.value)} placeholder={t('please-input-user-name')} />
                </Box>
              </Box>
              <Box className="form-line">
                <Typography className={`form-line-label ${typeOfDialog === dialogType.create && 'required'}`} variant="body2" sx={{ flexGrow: 1 }}>
                  {t('password')}
                </Typography>
                <Box className="form-line-content">
                  <input className="form-input" value={userForm.password || ''} onChange={event => setUserForm('password', event.target.value)} placeholder={t('please-input-password')} />
                </Box>
              </Box>
              <div className="generate-password"><a onClick={() => handleGeneratePassword()} href="#">{t('generate-password')}</a></div>
              <Box className="form-line">
                <Typography className="form-line-label" variant="body2" sx={{ flexGrow: 1 }}>
                  {t('user-remark')}
                </Typography>
                <Box className="form-line-content">
                  <textarea className="form-input" defaultValue={userForm.comment} onChange={event => setUserForm('comment', event.target.value)} placeholder={t('please-input-remark')} />
                </Box>
              </Box>
            </form>
          )
        }
      ></BaseDialog>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['sys-users', 'common', 'side-bar', 'header'])),
    },
  }
};

export default withRouter(SysUsers);
