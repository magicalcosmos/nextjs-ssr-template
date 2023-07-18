import type { NextPage, GetStaticProps,  GetStaticPaths, InferGetStaticPropsType } from 'next';
import { useEffect, useState } from 'react';
import { $api } from '~/api';
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import { Button } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Message from '@/utils/message';
import { getCookie } from 'cookies-next';
import BaseDialog from '~/layouts/components/BaseDialog';
import SHA256 from '@/utils/sha256';

const ResetPassword: NextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { data } = props;

  const router = useRouter();

  const { t } = useTranslation('resetPassword');

  const [passwordOld, setPasswordOld] = useState<string|undefined>(undefined);
  const [passwordNew, setPasswordNew] = useState<string|undefined>(undefined);
  const [passwordConfirm, setPasswordConfirm] = useState<string|undefined>(undefined);
  const [succeedTip, setSucceedTip] = useState<boolean>(false);

  const handlePasswordOldInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordOld(event.target.value);
  };
  const handlePasswordNewInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordNew(event.target.value);
  };
  const handlePasswordConfirmInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(event.target.value);
  };


  const validate = () => {
    if (passwordOld === undefined) {
      setPasswordOld('');
    }
    if (passwordNew === undefined) {
      setPasswordNew('');
    }
    if (passwordConfirm === undefined) {
      setPasswordConfirm('');
    }
    if (!passwordOld || !passwordNew || !passwordConfirm) {
      return false;
    }
    if ((passwordOld && passwordOld.length < 6) || (passwordNew && passwordNew.length < 6) || (passwordConfirm && passwordConfirm.length < 6)) {
      return false
    }

    if (passwordNew !== passwordConfirm) {
      Message.error({
        content: t('not_same_password'),
      });
      return false
    }
    return true;
  };
  const handleConfirm = () => {
    if (validate()) {
      $api.user.changePassword({
        passwordOld: SHA256(passwordOld),
        passwordNew: SHA256(passwordNew),
        passwordConfirm: SHA256(passwordConfirm),
      }).then(() => {
        setSucceedTip(true);
        setPasswordOld(undefined);
        setPasswordNew(undefined);
        setPasswordConfirm(undefined);
      }).catch((e) => {});
    }
  }

  const handleSignout = () => {
    router.push('/signin');
  }

  return (
    <div className="reset-password">
      <ul className="reset-password-list">
        <li className="reset-password-item">
          <label>{t('username')}</label>
          <span className="username">{getCookie('_uname')}</span>
        </li>
        <li className={`reset-password-item ${passwordOld === '' || (passwordOld && passwordOld.length < 6) ? 'no-empty' : ''}`}>
          <span className="required">*</span>
          <label>{t('password_old')}</label>
          <input 
            type="password" 
            placeholder={t('placeholder.password_old')}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordOldInput(e)}
          />
          { passwordOld && passwordOld.length < 6 ? <div className="required tips"><span>{t('bigger_than_six')}</span></div> : <></>}
        </li>        
        <li className={`reset-password-item ${passwordNew === '' || (passwordOld && passwordOld.length < 6) ? 'no-empty' : ''}`}>
          <span className="required">*</span>
          <label>{t('password_new')}</label>
          <input 
            type="password" 
            placeholder={t('placeholder.password_new')}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordNewInput(e)} 
          />
          { passwordNew && passwordNew.length < 6 ? <div className="required tips"><span>{t('bigger_than_six')}</span></div> : <></>}
        </li>
        <li className={`reset-password-item ${passwordConfirm === '' || (passwordOld && passwordOld.length < 6) ? 'no-empty' : ''}`}>
          <span className="required">*</span>
          <label>{t('password_confirm')}</label>
          <input 
            type="password" 
            placeholder={t('placeholder.password_confirm')}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordConfirmInput(e)} 
          />
          { passwordConfirm && passwordConfirm.length < 6 ? <div className="required tips"><span>{t('bigger_than_six')}</span></div> : <></>}
        </li>
      </ul>
      <div className="buttons">
        <Button variant="text" onClick={() => router.back()} sx={{
          border: '1px solid #d1d1d1',
          color: '#666',
          height: '24px',
          width: '80px',
        }}>{t('common:cancel')}</Button>
        <Button variant="contained" onClick={handleConfirm.bind(this)} sx={{
          background: '#3269f6',
          height: '24px',
          marginLeft: '13px',
          width: '80px',
        }}>{t('common:confirm')}</Button>
      </div>
      <BaseDialog 
        t={t}
        contentBody={t('change_succeed')}
        open={succeedTip}
        showCancelButton={false}   
        onConfirm={() => handleSignout()}
        onClose={() => handleSignout()}
        ></BaseDialog>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;
  const translations = await serverSideTranslations(locale || '', ['common', 'exception', 'header', 'resetPassword']);
  const i18nStore: any = translations._nextI18Next.initialI18nStore;
  return {
    props: {
      headMore: i18nStore[locale as string]['resetPassword']['title'] || null,
      ...translations,
    },
  };
};

export default ResetPassword;
