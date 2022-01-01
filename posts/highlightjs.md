---
title: remark-highlightからrehype-highlightへ
date: '2022-01-01'
categories: nextjs
tag:
- react
- nextjs
slug: highlightjs
---

[npm-check-update](https://github.com/raineorshine/npm-check-updates)で当ブログのライブラリのアップデートを行ったところ
シンタックスハイライトが効かなくなったので、[remark-highlight](https://github.com/remarkjs/remark-highlight.js)のページを訪れたら、
READMEに「もうこのパッケージは推奨されません。remarkからrehypeに変えてハイライトもrehype-highlightを使って」と書いてあったので
当ブログもrehypeに替えました。
大掛かりな変更はないのですが念のため備忘録として残しておきます。

remarkとrehypeの違いについては[Next.js のための Remark / Rehype 入門](https://qiita.com/sankentou/items/f8eadb5722f3b39bbbf8)を参照してください。

## パッケージをインストール

必要なパッケージは以下の５つ

- unified
- remark-rehype
- remark-parse
- rehype-highlight
- rehype-stringify

```
npm install unified remark-parse remark-rehype rehype-highlight rehype-stringify
```

## remarkからrehypeへ

remark
```js
import { remark } from "remark";
import html from "remark-html";
import highlight from "remark-highlight.js";
import gfm from "remark-gfm";

const processedContent = await remark()
    .use(html)
    .use(highlight)
    .use(gfm)
    .process(matterResult.content);
  const contentHtml = processedContent.toString()
```

から  
rehype

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(matterResult.content);
  const contentHtml = processedContent.toString()
```

に変更します。
あとは_app.jsに`import 'highlight.js/styles/github-dark.css';`みたいにcssを読み込めばシンタックスハイライトが適用されます。


## レンダー後にシンタックスハイライトを適用する場合

remark・rehype関係なくブログの記事ファイル（[slug].jsとか[id].js）にシンタックスハイライトを適用するなら

```js
import hljs from "highlight.js";
import { useEffect } from "react"
import 'highlight.js/styles/github-dark.css';

///以下略

useEffect(() => {
    hljs.initHighlighting();
    hljs.initHighlighting.called = false;
  },[]);
```

でいけると思う。



