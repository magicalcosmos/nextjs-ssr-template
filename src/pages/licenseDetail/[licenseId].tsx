import type { NextPage, GetStaticProps,  GetStaticPaths, InferGetStaticPropsType } from 'next';
import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import { $api } from '~/api';
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import { Button } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CLIENT_LICENSE_STATUS } from '@/utils/dict';
import { IIntegrationTest, IStaticCheck, IUnitTest } from '~/api/modules/license';
import { TLicenseDetail } from '~/types/licenses';

const LicenseDetail: NextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { t } = useTranslation('license');

  const { licenseIds } = props;
  const router = useRouter();

  const [licenseData, setLicenseData] = useState<TLicenseDetail>({} as any);
  const [staticCheck, setStaticCheck] = useState<IStaticCheck>({} as any);
  const [unitTest, setUnitTest] = useState<IUnitTest>({} as any);
  const [integrationTest, setIntegrationTest] = useState<IIntegrationTest>({} as any);

  useEffect(() => {
    $api.license.detail({ licenseIds }).then((res: any) => {
      const data = res.data[0];
      const modules: any = data.modules;
      setStaticCheck(modules['static-check']);
      setUnitTest(modules['unit-test']);
      setIntegrationTest(modules['integration-test']);
      setLicenseData(data as any);
    }).catch(() => {});

  }, []);

  /**
   * 获取i18n状态
   * @param status
   */
  const getStatus = (status: number) => {
    switch (status) {
      case CLIENT_LICENSE_STATUS.TO_BE_DISTRIBUTED:
        return <>{ t('home:status.to_be_distributed')}</>;
      case CLIENT_LICENSE_STATUS.DISTRIBUTED:
        return <>{ t('home:status.distributed')}</>;
      default:
        return <>{ t('home:status.expired')}</>;
    }

  };
  /**
   * 获取规则集
   * @param modules
   */
  const getRuleSettings = () => {
    const modules: any = staticCheck['modules'];
    let specs: any[] = [];
    for (const module in modules) {
        specs = specs.concat(modules[module].specs as any[]);
    }
    return specs.join(', ');
  }

  return (
    <div className="license-detail">
      <ul className="license-detail-list">
        <li className="license-detail-item">
          <label>{t('name')}：</label><span className="license-detail-name">{licenseData.licenseName}</span>
        </li>
        <li className="license-detail-item">
          <label>{t('user_count')}：</label><span className="license-detail-name">{licenseData.userLimit}</span>
        </li>
        <li className="license-detail-item">
          <label>{t('cpu_count')}：</label><span className="license-detail-name">{licenseData.cpuLimit}</span>
        </li>
        <li className="license-detail-item">
          <label>{t('status')}：</label><span className="license-detail-name">{getStatus(licenseData.status as number)}</span>
        </li>
        {
          staticCheck ?
          <li className="license-detail-item module">
            <h5>{t('static.name')}</h5>
            <div>
              <label>{t('static.rule_settings')}</label>
              <span className="import-export">
                {getRuleSettings()}
              </span>
            </div>
            <div>
              <label>{t('validation')}</label>
              <span>{staticCheck.expired}</span>
            </div>
          </li> : '' 
        }
        {
          unitTest ?
          <li className="license-detail-item module">
            <h5>{t('unit.name')}</h5>
            <div>
              <label>{t('unit.language')}</label>
              <span>{licenseData.language?.join(', ')}</span>
            </div>
            <div>
              <label>{t('testcase_format')}</label>
              <span className="import-export">
                <span className="import">{t('import')} {unitTest['case-import-format']?.join(', ')}</span>
                <span className="export">{t('export')} {unitTest['case-format']?.join(', ')}</span>
              </span>
            </div>
            <div>
              <label>{t('validation')}</label>
              <span>{unitTest.expired}</span>
            </div>
          </li> : '' 
        }
        {
          integrationTest ?
          <li className="license-detail-item module">
            <h5>{t('integration.name')}</h5>
            <div>
              <label>{t('testcase_format')}</label>
              <span className="import-export">
                <span className="import">{t('import')} {integrationTest['case-import-format']?.join(', ')}</span>
                <span className="export">{t('export')} {integrationTest['case-format']?.join(', ')}</span>
              </span>
            </div>
            <div>
              <label>{t('validation')}</label>
              <span>{integrationTest.expired}</span>
            </div>
          </li> : '' 
        }
      </ul>
      <div>
        <Button variant="text" onClick={() => router.push('/home')}>{t('common:back')}</Button>
      </div>
    </div>
  );
};


export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  // getStaticPaths does mainly two things:
  //  Indicate which paths should be created on build time (returning a paths array)
  //  Indicate what to do when a certain page eg: "product/myProduct123" doesn't exist in the NextJS Cache (returning a fallback type)
  return {
      // indicates that no page needs be created at build time
      paths: [], 
       // indicates the type of fallback
      fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;
  const translations = await serverSideTranslations(locale || '', ['common', 'exception', 'header', 'home', 'license']);
  const i18nStore: any = translations._nextI18Next.initialI18nStore;
  const params: any = ctx.params;
  return {
    props: {
      headMore: i18nStore[locale as string]['license']['title'],
      licenseIds: [ parseInt(params.licenseId) ],
      ...translations,
    },
  };
};

export default LicenseDetail;
