import '~/styles/index.scss';
import LayoutDefault from '~/layouts/default';
import App from 'next/app';
import type { AppContext, AppProps } from 'next/app';
import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '~/theme';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '~/store';
import { appWithTranslation } from 'next-i18next';
import Layout from '../layouts/Layout';
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  data: any;
};

const onBeforeLift = () => {
  // take some action before the gate lifts

}            

const ShaBeer = ({ Component, pageProps, data }: AppPropsWithLayout) => {
  // 登录后的布局与不用登录的公共部分
  const getLayout = Component.getLayout ? ((page: ReactElement) => <Layout>{page}</Layout>) : ((page: ReactElement) => <LayoutDefault>{page}</LayoutDefault>)
  return (
    <StoreProvider store={store}>
      <PersistGate onBeforeLift={onBeforeLift} persistor={persistor}>
        <ThemeProvider theme={theme}>
          {getLayout(<Component {...pageProps} userInfo={data}/>)}
        </ThemeProvider>
      </PersistGate>
    </StoreProvider>
  );
};

ShaBeer.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, data: (appContext.ctx.res as any)['userInfo'] || {} };
}

export default appWithTranslation(ShaBeer);
