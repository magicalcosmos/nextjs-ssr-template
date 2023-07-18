import { Html, Head, Main, NextScript } from 'next/document';
// 自定义模版
export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content=" NextJS SSR Template" />
         <link rel="icon" type="image/png" href="favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>

  )
};
