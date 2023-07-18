import Head from 'next/head';
import settings from '~/settings';

export default function DefaultHeader() {
  return (
    <Head>
      <title>{settings.appName}</title>
    </Head>
  )
}