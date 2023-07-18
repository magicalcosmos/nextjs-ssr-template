import Router, { withRouter } from 'next/router';
import { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps, NextPage, InferGetStaticPropsType } from 'next';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import UpdateLicense from './_update';
import DeleteLicense from './_delete';
import Pagination from '~/layouts/components/Pagination';

import { $api } from '~/api';
import * as TypeLicense from '~/types/licenses';
import * as Dict from '~/utils/dict';
import message from '~/utils/message';
import { useAppDispatch } from '~/store';
import { hideLoading, showLoading } from '~/store/module/globalLoading/reducer';

const SysLicenses: NextPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(['sys-licenses', 'common', 'header']);

  const dispatch = useAppDispatch();

  const { router } = props;
  const userId = Number(new URLSearchParams(window.location.search).get('userId'));

  /**
   * filter license status
   * @param status 
   * @returns 
   */
  const filterLicenseStatus = (status: Dict.TLicenseUsageStatus) => {
    let className = '';
    let text = '';
    switch (status) {
      case Dict.CLIENT_LICENSE_STATUS.TO_BE_DISTRIBUTED:
        className = 'green';
        text = t('undistributed');
      break;
      case Dict.CLIENT_LICENSE_STATUS.DISTRIBUTED:
        className = 'default';
        text = t('distributed');
      break;
      case Dict.CLIENT_LICENSE_STATUS.expired:
        className = 'red';
        text = t('expired');
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
    useOpenDelete(false);
  }

  /**
   * open update license dialog
   * @param status 
   * @returns 
   */
  const handleOpenUpdateLicense = (title: string, row?: TypeLicense.TSysLicense) => {
    useDialogProps(Object.assign({}, dialogProps, {
      title: title,
      open: true,
      licenseId: row ? row.id : null,
      onCancel: handleCloseDialog,
      onClose: handleCloseDialog,
      onConfirm: handleUpdateLicenseConfirm
    }));
  }

  /**
   * update license dialog confirm
   */
  const handleUpdateLicenseConfirm = () => {
    handleCloseDialog();
    message.success({
      content: t('common:success-message'),
    });
    fetchOverview();
    fetchList();
  }

  /**
   * delete license dialog confirm
   */
  const handleDeleteLicenseConfirm = () => {
    if (currentRow) {
      $api.sysLicense.delete({ licenseIds: [currentRow?.id as number] }).then(() => {
        handleCloseDialog();
        message.success({
          content: t('common:success-message'),
        });
        fetchOverview();
        fetchList();
      }).catch(() => {});
    }
  }

  /**
   * open delete license dialog
   * @param status 
   * @returns 
   */
  const handleOpenDeleteLicense = (row: TypeLicense.TSysLicense) => {
    useCurrentRow(row);
    useOpenDelete(true);
  }

  /**
   * back to users
   * @param status 
   */
  const goBack = () => {
    Router.back();
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

  /**
   * fetch list
   */
  const fetchList = () => {
    dispatch(showLoading());
    const param: TypeLicense.TSysLicenseQuery = {
      pagination,
      userId
    };
    if (q) {
      param.q = q;
    }
    $api.sysLicense.list(param).then((res) => {
      useTotal(res.data.pagination.total);
      useList(res.data?.licenses);
    }).catch(() => {}).finally(() => {
      dispatch(hideLoading());
    });
  }

  const fetchOverview = () => {
    $api.license.overview({
      userId
    }).then((res: any) => {
      setOverview(res.data);
    }).catch(() => {

    });
  }

  const init = () => {
    handlePageChange(1);
    fetchOverview();
  }

  /** 当前操作数据 */
  const [pagination, usePagination] = useState({
    page: 1,
    perPage: 10
  });
  const [total, useTotal] = useState(0);

  const [overview, setOverview] = useState({
    "assignedCount": 0,
    "unAssignedCount": 0,
    "expiredCount": 0
  });

  /** 搜索关键字 */
  const [q, useQ] = useState('');

  /** 列表数据 */
  const [list, useList] = useState<TypeLicense.TSysLicense[]>([]);

  /** 当前操作数据 */
  const [currentRow, useCurrentRow] = useState<TypeLicense.TSysLicense>();
  const [openDelete, useOpenDelete] = useState(false);

  /** 弹框数据 */
  const [dialogProps, useDialogProps] = useState({
    t: t,
    title: '',
    open: false,
    userId: NaN,
    licenseId: NaN,
    onClose: () => {},
    onConfirm: () => {},
  });

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
      <Box className="user-licenses-container">
        <Breadcrumbs className="pl-14" separator="|" aria-label="breadcrumb">
          <Typography className="cursor-pointer" onClick={() => goBack()} color="inherit">{t('user-list')}</Typography>
          <Typography color="inherit">{t('license-list')}</Typography>
        </Breadcrumbs>
        <Box sx={{ display: 'flex' }}>
          <Typography className="pl-14 overview" variant="body2" sx={{ flexGrow: 1 }}>
            {t('license-overview', { total: overview.assignedCount + overview.unAssignedCount })}
          </Typography>
          <Box className="search-input" sx={{ display: 'flex' }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              value={q}
              onChange={(event) => useQ(event.target.value)}
              placeholder={t('common:search')}
            />
            <IconButton type="button" aria-label="search">
              <i className="icon icon-search" />
            </IconButton>
          </Box>
          <Button className="add-button" variant="contained" onClick={() => handleOpenUpdateLicense(t('add-license'))}>{t('add-license')}</Button>
        </Box>
        <TableContainer>
          <Table className="list" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell className="pl-14">{t('license-name')}</TableCell>
                <TableCell align="center">{t('user-count')}</TableCell>
                <TableCell align="center">{t('cpu-count')}</TableCell>
                <TableCell align="center">{t('expired-date')}</TableCell>
                <TableCell align="center">{t('usage-status')}</TableCell>
                <TableCell style={{ width: '35%' }} align="center">{t('remark')}</TableCell>
                <TableCell style={{ width: 150 }} align="center">{t('operate')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((row: TypeLicense.TSysLicense) => (
                <TableRow key={row.id}>
                  <TableCell className="pl-14">{row.licenseName}</TableCell>
                  <TableCell align="center">{row.userLimit}</TableCell>
                  <TableCell align="center">{row.cpuLimit}</TableCell>
                  <TableCell align="center">{row.expires}</TableCell>
                  <TableCell align="center">{filterLicenseStatus(row.status)}</TableCell>
                  <TableCell align="center">
                    <div className="long-text text-ellipse" title={row.comment}>{row.comment}</div>
                  </TableCell>
                  <TableCell align="center">
                    <span onClick={() => handleOpenUpdateLicense(t('edit-license'), row)} className="edit cursor-pointer">{t('edit')}</span>
                    <span onClick={() => handleOpenDeleteLicense(row)} className="delete cursor-pointer">{t('delete')}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <caption className="table-blank">{!list || !list.length ? t('common:no-data') : ''}</caption>
          </Table>
        </TableContainer>
        {list.length ?
          <Pagination
            t={t}
            {...pagination}
            total={total}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange} /> : ''}
      </Box>
      <UpdateLicense
        {...dialogProps}
        userId={userId}
      />
      <DeleteLicense
        t={t}
        open={openDelete}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteLicenseConfirm}     
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['common', 'sys-licenses', 'header'])),
    },
  }
};

export default withRouter(SysLicenses);
