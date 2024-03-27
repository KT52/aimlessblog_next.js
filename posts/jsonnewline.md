---
title: JSONの値の改行
date: '2024-03-27'
tag:
- nextjs
- astro
slug: jsonnewline
---

AstroやNext.jsでAPIから呼び出したりしたJSONのテキストで改行したいケースが生じたので、改行コード「\\n」を入れたが改行されなかった。

やりたかったことはサッカーのカップ戦でホームアンドアウェーの2戦合計の結果を2戦目の結果と一緒に表示させるということ。

```json
{
    "day": "2024-01-01",
    "home": "Manchester City",
    "score": "3 - 1 \n(6 - 2)",
    "away": "Manchester United"
},
```

このように改行コードをいれても「3 - 1 (6 - 2)」とそのまま表示されて改行されない

## cssのwhite-spaceを使う

cssのwhite-spaceを使うことで改行されました。

[white-space](https://developer.mozilla.org/ja/docs/Web/CSS/white-space)
> white-space は CSS のプロパティで、要素内のホワイトスペースをどのように扱うかを設定します。

white-spaceの値をpreもしくはpre-wrapにすることで\\nがきちんと改行されるようになりました。

下記はAstroのコードの一部です

```jsx
<div>
{
      data.map((contents: Result) => (
        <tbody>
          <tr>
            <td>{contents.day}</td>
            <td>
              {contents.home}
            </td>
            <td　class="newline">
            {/*  改行されて表示された */}
                {contents.score}
            </td>
            <td>
              {contents.away}
            </td>
          </tr>
        </tbody>
      ))
    }
</div>
// styleを追加
<style>
  .newline {
    white-space: pre-wrap;
  }
</style>
```


