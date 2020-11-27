---
title: ブログをHugoからNext.jsに変更
date: '2020-11-25'
tag:
- nextjs
slug: blognextjs
---

今年のはじめにReactを学び、４月ころからNext.jsを使い始めてNext.js推しになったので  
当ブログもNext.jsで作ったブログに変更しました。  

今まで使ってたHugoのテーマ[「Kiss」](https://themes.gohugo.io/kiss/)が"Kiss is a stupidly simple blog theme"と作者が言うくらいシンプルなテーマだったので、それを継承するようにNext.jsのチュートリアルで作るブログをベースにして自作。以下の機能などを追加しました。

- ページネーション
- タグとタグページ
- remark-highlight.js
- Highlight.js
- react-adsense
- react-share
- Sitemap plugin（Netlifyのplugin）
- Google AnalyticsやAdsense用に_document.jsとgtag.jsを追加

Next.jsを使ったブログの作成については  
[公式サイトのチュートリアル](https://nextjs.org/learn/basics/create-nextjs-app?utm_source=next-site&utm_medium=nav-cta&utm_campaign=next-website)  
と、[その日本語訳されたページ（大幅にリニューアルされた Next.js のチュートリアルをどこよりも早く全編和訳しました）](https://qiita.com/thesugar/items/01896c1faa8241e6b1bc)
を参照してください。

ページネーションとタグは１記事として使えそうなので次回以降に説明するとして、以下に追加したものについて少し書きます。

## remark-highlight.jsとHighlight.js

ブログのコードブロックとシンタックスハイライトに必要なremark-highlight.jsとHighlight.jsを入れました。
remark-highlight.jsだけだとコードが色付けされないのでHighlight.jsを入れて"[id].js"に使いたいthemeをインポートします。
`import "highlight.js/styles/dracula.css";`。  
当ブログの[theme](https://highlightjs.org/static/demo/)はdraculaを使ってます。

## Google Analytics

Google AnalyticsはNext.jsの[example](https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics)ページをほぼ丸パクリ。
libディレクトリに`gtag.js`を追加。中身は

```js
export const GA_TRACKING_ID = process.env.GA_TRACKING_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

のようになってます。トラッキングIDは環境変数から渡すのでNetlifyの`Site settings`→`Build ＆ Deploy`の`Environment variables`のkeyに`GA_TRACKING_ID`、ValueにトラッキングIDを記入します。

次にpages以下に`_document.js`を置いて、`<Head>～</Head>`内に以下のコードをコピペ

```js
import Document, { Html, Head, Main, NextScript } from "next/document";
import { GA_TRACKING_ID } from "../lib/gtag.js";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

これでGoogle Analyticsの設定完了。

## Google AdSense

Google AdSenseの設置は[react-adsense](https://github.com/hustcc/react-adsense)を使用。
使い方は`_document.js`の<Head></Head>内に

```js
<script 
async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">
</script>
```

を記述して、  

```js
import AdSense from "react-adsense";

<AdSense.Google
  client='ca-pub-xxxxxxxxxx'
  slot='xxxxxxxx'
  style={{ display: 'block' }}
  format='auto'
  responsive='true'
  layoutKey='-gw-1+2a-9x+5c'
/>
```

[id].jsに`AdSense`をインポートして、広告を入れたい場所にAdSense.Google以下のコードを置くだけ。上記はresponsive adsのコードです。

## シェアボタンの設置

シェアボタンは[react-share](https://github.com/nygardk/react-share#readme)を使います。
[id].jsにreact-shareのコードを書くと見づらくなるのでcomponents内にsocial.jsを作ってコンポーネント化します。

social.js

```js
import {
  FacebookShareButton,
  FacebookIcon,
  HatenaShareButton,
  HatenaIcon,
  PocketShareButton,
  PocketIcon,
  TumblrShareButton,
  TumblrIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import utilstyle from "../styles/utils.module.css";

export default function Social({slug,title}) {
    return (
      <footer className={utilstyle.socialbutton}>
        <div className={utilstyle.button}>
          <HatenaShareButton
            url={`https://ravness.com/posts/${slug}`}
            title={`${title}`}
          >
            <HatenaIcon size={32} round />
          </HatenaShareButton>
        </div>
        <div className={utilstyle.button}>
          <TwitterShareButton
            url={`https://ravness.com/posts/${slug}`}
            title={`${title}`}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
        <div className={utilstyle.button}>
          <FacebookShareButton
            url={`https://ravness.com/posts/${slug}`}
            quote={`${title}`}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
        <div className={utilstyle.button}>
          <PocketShareButton
            url={`https://ravness.com/posts/${slug}`}
            quote={`${title}`}
          >
            <PocketIcon size={32} round />
          </PocketShareButton>
        </div>
        <div className={utilstyle.button}>
          <TumblrShareButton
            url={`https://ravness.com/posts/${slug}`}
            title={`${title}`}
          >
            <TumblrIcon size={32} round />
          </TumblrShareButton>
        </div>
      </footer>
    );
}
```

[id].js

```js
import Social from "../../components/social"

<Social slug={postData.slug} title={postData.title} />
```

## 今後改善したり追加したりするかもしれないこと

- カテゴリーページ
- ２ページ目以降の記事からブラウザの戻るボタンなどで戻るとトップページに戻ってしまう問題
- TypeScriptに変更する
- Related Post


[このブログのGitHubリポジトリ](https://github.com/Squigly77/aimlessblog_next.js)