import type { NextPage, GetStaticProps, GetServerSideProps } from 'next';
import { SSRConfig, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CLIENT_LICENSE_STATUS } from '@/utils/dict';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import Assign from './_assign';
import Recycle from './_recycle';
import Download from '~/utils/download';
import Pagination from '@/layouts/components/Pagination';
import { $api } from '~/api';
import { IStatistics } from '~/api/modules/license';
import { Box, InputBase, IconButton } from '@mui/material';
import { useAppSelector } from '~/store';

const ClientHome: NextPage = () => {
  const { t } = useTranslation('home');
  const router = useRouter();

  const userInfo = useAppSelector((state) => state.site.userInfo || {});

  /** 表头 */
  const theadData = [
    t('license.name'),
    t('license.user_count'),
    t('license.cpu_count'),
    t('license.expires'),
    t('license.status'),
    t('license.user'),
    t('remark'),
    t('operation.name')
  ];

  const [ showAssign, setShowAssign ] = useState(false);
  const [ showRecycle, setShowRecycle ] = useState(false);
  const [ currentItem, setCurrentItem ] = useState({});
  const [ pagination, setPagination ] = useState({
    page: 1,
    perPage: 10,
  });
  const [total, useTotal] = useState(0);
  const [ list, setList] = useState([]);
  const [ overviewData, setOverviewData] = useState<IStatistics>({
    assignedCount: 0,
    unAssignedCount: 0,
    expiredCount: 0,
  });
  const [q, setQ] = useState('');

  useEffect(() => {
    getOverviewData();
  }, []);

  const getOverviewData = () => {
    userInfo && userInfo.id && $api.license.overview({
      userId: userInfo.id,
    }).then((res: any) => {
      setOverviewData(res.data);
    }).catch(() => {

    });
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    handlePageChange(1);
  }, [q]);
  
  const getList = () => {
    userInfo.id && $api.license.list({
      q,
      userId: userInfo.id,
      ...pagination,
    }).then((res: any) => {
      useTotal(res.data.pagination.total);
      setList(res.data.licenses);
    }).catch(() => {

    });
  }

  /**
   * 获取状态
   * @param item 
   */
  const getStatus = (item: Summary) => {
    switch (item.status) {
      case CLIENT_LICENSE_STATUS.TO_BE_DISTRIBUTED:
        return <><span className="to-be-distributed"></span>{ t('status.to_be_distributed')}</>;
      case CLIENT_LICENSE_STATUS.DISTRIBUTED:
        return <><span className="distributed"></span>{ t('status.distributed')}</>;
      default:
        return <><span className="expired"></span>{ t('status.expired')}</>;
    }
  };

  /**
   * 分发证书
   * @param item 
   */
  const handleDistribute = (item: Summary) => {
    setCurrentItem(item);
    setShowAssign(true);
  };

  /**
   * 下载证书
   * @param item 
   */
  const handleDownload = (item: Summary) => {
    Download.download(item.licenseCode, 'license');
  };

  /**
   * 回收证书
   * @param item 
   */
  const handleRecycle = (item: Summary) => {
    setCurrentItem(item);
    setShowRecycle(true);
  };

  /**
   * 获取操作项
   * @param item 
   */
  const getOperation = (item: Summary) => {
    switch (item.status) {
      case CLIENT_LICENSE_STATUS.TO_BE_DISTRIBUTED:
        return <><button className="distribute" onClick={handleDistribute.bind(this, item)}>{t('operation.distribute')}</button></>;
      case CLIENT_LICENSE_STATUS.DISTRIBUTED:
        return <>
            <button className="download" onClick={handleDownload.bind(this, item)}>{t('operation.download')}</button>
            <button className="recycle" onClick={handleRecycle.bind(this, item)}>{t('operation.recycle')}</button>
        </>;
      default:
        return <>
            <button className="download disable">{t('operation.download')}</button>
            <button className="recycle disable">{t('operation.recycle')}</button>
        </>;
    }
  };

  const gotoDetail = (item: Summary) => {
    router.push(`/licenseDetail/${item.id}`);
  };

  /** 
   * 切换页数
   */
  const handlePageChange = (page: number) => {
    setPagination(Object.assign(pagination, { page }));
    getList();
  }

  /**
   * 切换条数
   */
  const handlePerPageChange = (perPage: number) => {
    setPagination(Object.assign(pagination, { page: 1, perPage }));
    getList();
  }

  return <div className="client-home">
    <div className="summary">
      {t('summary', { m: (overviewData.assignedCount + overviewData.unAssignedCount) || '0', n: overviewData.assignedCount || 0, 'm-n': overviewData.unAssignedCount || 0 })}
      
      <Box className="search-input" sx={{ display: 'flex' }}>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={t('common:search')}
                value={q}
                onChange={(event) => {
                  setQ(event.target.value);
                }}
              />
              <IconButton type="button" aria-label="search">
                <i className="icon icon-search" />
              </IconButton>
            </Box>
    </div>
    <table cellPadding={0} cellSpacing={0}>
      <thead>
        <tr>
          { 
            theadData.map((item, i) => {
              return <th key={i} className={ i === 6 ? 'remark' : ''}>{item}</th>;
            })
          }
        </tr>
      </thead>
      <tbody>
        { 
          list && list.length ? list.map((item: Summary, i: number) => {
                                  return <tr key={i}>
                                      <td><span className="cursor" onClick={gotoDetail.bind(this, item)}>{item.licenseName}</span></td>
                                      <td>{item.userLimit}</td>
                                      <td>{item.cpuLimit}</td>
                                      <td>{item.expires}</td>
                                      <td>
                                        { getStatus(item) }
                                      </td>
                                      <td>{item.owner}</td>
                                      <td title={item.assignComment}>{item.assignComment}</td>
                                      <td>
                                        {getOperation(item)}
                                      </td>
                                  </tr>
                                }) : <tr className="no-data"><td colSpan={theadData.length} className="text-center no-border">{t('common:no_data')}</td></tr>
        }
      </tbody>
    </table>
    {
      list && list.length ? <div className="pagination">
                              <Pagination
                                t={t}
                                {...pagination}
                                total={total}
                                onPageChange={handlePageChange}
                                onPerPageChange={handlePerPageChange}
                              />
                            </div> : ''
    }
    <Assign 
      t={t} 
      visible={showAssign}
      setShowDialog={setShowAssign}
      license={currentItem}
      reload={getList}
    />
    <Recycle 
      t={t} 
      visible={showRecycle} 
      setShowDialog={setShowRecycle}
      license={currentItem}
      reload={getList}
    />
    
  </div>;
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { locale } = ctx;
 
  const translations = await serverSideTranslations(locale || '', ['common', 'exception', 'header', 'home']);

  return {
    props: {
      ...translations,
    },
  };
};

export default ClientHome;
