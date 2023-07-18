import type { NextPageWithLayout } from './_app';
import { useState, ChangeEvent } from 'react';
import { $api } from '~/api';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LoadingButton } from '@mui/lab';
import { GetStaticProps } from 'next';
import { useEffect } from 'react';
import SHA256 from '@/utils/sha256';

const Login: NextPageWithLayout = () => {
  const { t } = useTranslation('login');

  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);


  const submit = () => {
    if (username !== '' && username !== undefined && password !== undefined && password !== '') {
      $api.auth.signIn({
        username,
        password: SHA256(password),
      }).then(() => {
        location.href = '/';
      }).catch(() => {
        setLoading(false);
      })
    } else {
      !username && setUsername('');
      !password && setPassword('');
      setLoading(false);
    }
  }

  const bindEvent = () => {
    document.onkeydown = function(e: KeyboardEvent) {
      // 兼容FF和IE和Opera
      var code = e.keyCode || e.which || e.charCode;
      if (e.key === 'Enter' || code === 13) {
        handleLogin();
      }
    }
  }

  const handleLogin = async () => {
    setLoading(true);
    submit();
  };

  useEffect(() => {
    bindEvent();
  });

  const handleUsernameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  
  return (
    <div className="login">
        <div className="system-name">{t('system_name')}</div>
        <div className="login-frame">
          <ul className="login-frame-list">
            <li className="name">{t('login_title')}</li>
            <li className={ `username ${username === '' ? 'no-empty' : ''}`}>
              <i className="icon icon-username" /> 
              <input type="text" placeholder={t('username')} onInput={(e: React.ChangeEvent<HTMLInputElement>) => handleUsernameInput(e)}/>
             {
              username === '' ? <span className="required">{t('tips.input_username')}</span> : ''
             } 
            </li>
            <li className={ `password ${username === '' ? 'no-empty' : ''}`}>
              <i className="icon icon-password" />
              <input type="password"  placeholder={t('password')} onInput={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordInput(e)}/>
              {
              password === '' ? <span className="required">{t('tips.input_password')}</span> : ''
             } 
            </li>
            <li className="submit">
              <LoadingButton 
                loading={loading} 
                variant="contained"
                sx={{
                  background: '#3568FF',
                  color: '#fff',
                  height: '36px',
                  width: '250px',
                  '&:hover': {
                    background: '#3568FF',
                  }
                }}
                onClick={handleLogin}
              >
                {t('signin')}
              </LoadingButton>
            </li>
          </ul>
        </div>
    </div>
  );
};

Login.getLayout = (page) => {
  return <>{page}</>;
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;



  const translations = await serverSideTranslations(locale || '', ['common', 'exception', 'login']);

  return {
    props: {
      ...translations,
    },
  };
};

export default Login;
