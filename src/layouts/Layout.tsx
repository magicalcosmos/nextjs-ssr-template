import Head from 'next/head';
import type { ReactNode } from 'react';
import settings from '~/settings';

type LayoutProps = {
  children?: ReactNode
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{settings.appName}</title>
      </Head>
      {children}
    </>
  );
};

export default Layout;
