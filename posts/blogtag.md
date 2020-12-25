---
title: ブログにタグとタグページを追加する
date: '2020-12-25'
tag:
- nextjs
slug: blogtag
---

[公式サイトのチュートリアル](https://nextjs.org/learn/basics/create-nextjs-app?utm_source=next-site&utm_medium=nav-cta&utm_campaign=next-website)のメタデータにはタグがないので、
タグを追加してタグの一覧ページとタグ毎の一覧ページを作ります。

## メタデータ

メタデータはYAML Front Matterを使うので、一つの記事で複数のタグを使用するときは"-"で配列にします。

```yaml
tag:
- nextjs
- react
- blog
```

## 記事のタイトルと日付の下にタグを追加する

メタデータにタグを追加したので`postData.tag`でタグを受け取ることができます。  
日付の下にタグを表示させたいので、

```js
 <div className={utilStyles.lightText}>
    <Date dateString={postData.date} />
</div>
<div>
    <div className={utilStyles.taglist}>Tag:</div>
    {!Array.isArray(postData.tag) ? (
        <Link href={`/tags/${encodeURIComponent(postData.tag)}`}>
            <a className={utilStyles.taglist}>{postData.tag}</a>
        </Link>
    ) : (
        postData.tag.map((tag) => (
            <Link href={`/tags/${encodeURIComponent(tag)}`}>
                <a className={utilStyles.taglist}>{tag}</a>
            </Link>
        ))
    )}
</div>
```

tagが一つの場合`postData.tag.map((tag) =>`だけだとエラーになるので、`!Array.isArray(postData.tag)`でtagが配列のときとそうでない時で分けます。  
タグをクリックしたときにそのタグの記事一覧ページに飛ぶようにします。

## タグ一覧ページを作る

トップページにタグ一覧ページのリンクを追加してタグ一覧ページを作ります。  
最初に`lib/posts.js`にタグだけを取得する関数を作成します。

```js
export function getTags() {
  const allTags = getSortedPostsData();
  let tags = [];
  allTags.forEach((post) => {
    tags = [...tags, ...post.tag];
  });
  const setTags = [...new Set(tags)];
  return setTags.sort();
}
```

forEachでメタデータのtagを全部取得してtagsとpost.tagを連結。重複するタグをSetで除外して返します。
pages以下にtags.jsを置いてタグ一覧を表示するページを作成。

```js
import Layout, { siteTitle } from "../components/layout";
import { getTags } from "../lib/posts";
import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

export async function getStaticProps() {
  const allTags = getTags();
  return {
    props: {
      allTags,
    },
  };
}

export default function Tags({allTags}) {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Tags</h2>
          <ul className={utilStyles.tagspage}>
            {allTags.map((tag) => (
              <li className={utilStyles.tagsItem} key={tag}>
                <Link href={`/tags/${encodeURIComponent(tag)}`}>
                  <a>{tag}</a>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Layout>
    );
}
```

## タグ毎の記事一覧ページの作成

lib/posts.jsに指定したタグが含まれる記事だけを返す関数を作成します。

```js
export async function getAssociatedPosts(tag) {
  const allPosts = getSortedPostsData();
  const associatedPosts = allPosts.filter((data) => data.tag.includes(tag));
  return associatedPosts;
}
```

指定したタグの記事一覧ページはtags/[tags].jsに作成します。

```js
import Layout, { siteTitle } from "../../components/layout";
import { getTags, getAssociatedPosts } from "../../lib/posts";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import Date from "../../components/date";
import styles from "../../components/layout.module.css";

export default function TagsPosts({ postData,tag }) {
  return (
    <Layout tags>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Tag: {tag} </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ul className={utilStyles.list}>
          {postData.map(({ id, date, title }) => (
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
      </section>
      <div className={styles.backToHome}>
        <Link href="/tags">
          <a>← Back to Tags</a>
        </Link>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getTags().map((tags) => {
    return `/tags/${tags}`;
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const tag = params.tags;
  const postData = await getAssociatedPosts(tag);
  return {
    props: {
      postData,
      tag,
    },
  };
}
```

タグ毎の記事一覧ページは`/tags/タグ名`という動的ルートを静的生成したいので、getStaticPathsは

```js
const paths = getTags()
return {
  paths,
  fallback: false,
  };
```

ではなく、

```js
const paths = getTags().map((tags) => {
    return `/tags/${tags}`;
  });
return {
    paths,
    fallback: false,
  };
```

このようにします。

これでブログにタグ機能が追加されました。