---
title: ブログにページネーション機能を追加する
date: '2021-01-13'
tag:
- nextjs
- pagination
slug: blogpagination
---

[公式サイトのチュートリアル](https://nextjs.org/learn/basics/create-nextjs-app?utm_source=next-site&utm_medium=nav-cta&utm_campaign=next-website)を元に製作した当ブログにページネーション機能を追加します。

## index.js

トップページ（index.js）に記事の一覧が表示されるようになっているのでページネーションをindex.jsに作ります。  

1ページあたり10件表示させるので以下の設定をする。

```js
const perPage = 10
```

記事のid（slug）はgetStaticPropsで事前に取得しているので、トータルの記事数を

```js
const total = allPostsData.length
```

で取得。

1ページ目のインデックスを１から始めるのでuseStateを

```js
const [pageIndex, setPageIndex] = useState(1);
```

このように設定。

1ページ10件表示させるので、

```js
{allPostsData.map(({ id, date, title }) => (
```

これを

```js
{allPostsData
            .slice(pageIndex * perPage - 10, pageIndex * perPage)
            .map(({ id, date, title }) => (
```

このようにsliceで10件ごとに表示できるように変更します。

2ページ目以降と戻るためのリンクボタンを作成

```js
<div>
          <div>
            {pageIndex > 1 ? (
              <Link href="/">
                <a onClick={() => setPageIndex(pageIndex - 1)}>Prev</a>
              </Link>
            ) : (
              ""
            )}
          </div>
          <div className={utilStyles.next}>
            {pageIndex !== Math.ceil(total / 10) ? (
              <Link href="/">
                <a onClick={() => setPageIndex(pageIndex + 1)}>Next</a>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
```

prevとnextを押すとpageIndexの値を増減するようにして、prevボタンは2ページ目以降に表示させるので`pageIndex > 1 ?`で条件分岐させます。  
nextボタンも`pageIndex !== Math.ceil(total / 10) ?`で次ページがないときは表示されないように条件分岐させます。  

これでページネーション機能付きのindex.jsが完成しました。

```JavaScript
import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import React, { useState } from "react";

const perPage = 10;

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData: allPostsData
    },
  };
}

export default function Home({allPostsData}) {
  const [pageIndex, setPageIndex] = useState(1);
  const total = allPostsData.length
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p className={utilStyles.headsub}>
          Webアプリ制作やWebサービスの覚え書きブログ
        </p>
        <p>
          <Link href="/tags">
            <a>Tag</a>
          </Link>
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData
            .slice(pageIndex * perPage - 10, pageIndex * perPage)
            .map(({ id, date, title }) => (
              <li className={utilStyles.listItem} key={id}>
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
                <br />
                <Link href={`/posts/${encodeURIComponent(id)}`}>
                  <a>{title}</a>
                </Link>
              </li>
            ))}
        </ul>
        <div className={utilStyles.pagination}>
          <div>
            {pageIndex > 1 ? (
              <Link href="/">
                <a onClick={() => setPageIndex(pageIndex - 1)}>Prev</a>
              </Link>
            ) : (
              ""
            )}
          </div>
          <div>
            {/* Math.floorで切り捨てMath.ceilで切り上げ */}
            {pageIndex !== Math.ceil(total / 10) ? (
              <Link href="/">
                <a onClick={() => setPageIndex(pageIndex + 1)}>Next</a>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
```

## 課題

とりあえず簡単なページネーション機能をつけたけど、ブログの記事ページからブラウザの戻るボタンを押すと1ページ目に戻ってしまうのをどうするか。  
このブログの9割は検索からの流入で直帰率も高いので、topページのページネーションもあまり利用されないだろうからpageIndexを保持する必要はないといえばないのだけど……
