import Document, { Head, Main, NextScript } from "next/document";
import React from "react";
import flush from "styled-jsx/server";

const globalStyles = `
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}
* {
  box-sizing: border-box;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color:rgba(255,255,255,0);
}
*::focus {
  outline: none;
}
img.lazyload:not([src]) {
  visibility: hidden;
}
`;

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const { html, head } = ctx.renderPage();
    const styles = flush();
    return { html, head, styles, ...initialProps };
  }

  render() {
    return (
      <html lang="ko">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
          />
          <meta name="robots" content="index, follow" />
          <meta name="google" content="notranslate" />
          <meta name="title" content="마스크인포 - 공적 마스크 재고 알리미" />
          <meta name="keywords" content="공적 마스크 재고 알리미" />
          <meta
            name="description"
            content="전국 약국의 공적 마스크 재고를 지도에서 한눈에! 마스크에 대한 모든 정보를 확인할 수 있어요."
          />
          <meta property="og:locale" content="ko_KR" />
          <meta property="og:site_name" content="마스크인포" />
          <meta
            property="og:title"
            content="마스크인포 - 공적 마스크 재고 알리미"
          />
          <meta
            property="og:description"
            content="전국 약국의 공적 마스크 재고를 지도에서 한눈에! 마스크에 대한 모든 정보를 확인할 수 있어요."
          />
          <meta property="og:url" content="https://mask-info.now.sh/" />
          <meta
            property="og:image"
            content="https://mask-info.now.sh/images/share-link.png"
          />
          <meta property="twitter:card" content="마스크인포" />
          <meta property="twitter:url" content="https://mask-info.now.sh/" />
          <meta
            property="twitter:title"
            content="마스크인포 - 공적 마스크 재고 알리미"
          />
          <meta
            property="twitter:description"
            content="전국 약국의 공적 마스크 재고를 지도에서 한눈에! 마스크에 대한 모든 정보를 확인할 수 있어요."
          />
          <meta
            property="twitter:image"
            content="https://mask-info.now.sh/images/talk-link.jpg"
          />
          <meta name="msapplication-TileColor" content="#8c7ae6" />
          <meta
            name="msapplication-TileImage"
            content="/images/ms-icon-144x144.png"
          />
          <meta name="theme-color" content="#8c7ae6" />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/images/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/images/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/images/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/images/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/images/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/images/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/images/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/images/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/images/android-icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/images/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon-16x16.png"
          />
          <link rel="stylesheet" type="text/css" href="/nprogress.css" />
          <link rel="manifest" href="/manifest.json" />
          <style type="text/css">{globalStyles}</style>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: `{
              "@context": "http://schema.org/",
              "@type": "Organization",
              "url": "https://mask-info.now.sh/",
              "logo": "https://mask-info.now.sh/images/share-link.png",
              "sameAs": [
                "https://www.facebook.com/mask-info",
              ],
            }`
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
