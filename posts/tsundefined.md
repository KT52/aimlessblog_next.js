---
title: 型 '' を型 'undefined' に割り当てることはできません
date: '2023-01-30'
tag:
- nextjs
- typescript
slug: tsundefined
---

下のコードでheadersの箇所がエラーになる(Next.js APIルート)

```ts
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const result = await fetch(
    "https://api.cloudflare.com/client/v4/accounts/以下略",
    {
      headers : {
        "X-Auth-Email" : process.env.X_AUTH_EMAIL,
        "X-Auth-Key": process.env.X_AUTH_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  const r = await result.json();
  res.status(200).json(r);
}
```

```
型 '{ "X-Auth-Email": string | undefined; "X-Auth-Key": string | undefined; "Content-Type": string; }' を型 'HeadersInit | undefined' に割り当てることはできません。
  型 '{ "X-Auth-Email": string | undefined; "X-Auth-Key": string | undefined; "Content-Type": string; }' を型 'undefined' に割り当てることはできません。ts(2322)
```


X-Auth-EmailとX-Auth-Keyはstringもしくはundefinedの可能性があることをTypescriptが教えてくれているので
これを解決する必要がある。  
調べたらいくつかの方法を見つけたので書き出してみる。

## 非nullアサーション演算子（Non-null assertion operator）を使う

非nullアサーション演算子"!"を使うことでnullやundefinedでないことをTypescriptに伝える。

```ts

{
      headers: {
        "X-Auth-Email": process.env.X_AUTH_EMAIL!,
        "X-Auth-Key": process.env.X_AUTH_KEY!,
        "Content-Type": "application/json",
      },
    }

```

## 型アサーション（type assertion）を使う

型アサーションを使って値がstringであることをTypescriptに伝える。

```ts

{
      headers: {
        "X-Auth-Email": process.env.X_AUTH_EMAIL as string,
        "X-Auth-Key": process.env.X_AUTH_KEY as string,
        "Content-Type": "application/json",
      },
    }
```

## 型ガード（type guard）を使う

もしundefinedでないなら、と分岐を作る。

```ts

{
    headers : {
        "X-Auth-Email" : process.env.X_AUTH_EMAIL !== undefined ? process.env.X_AUTH_EMAIL : "",
        "X-Auth-Key": process.env.X_AUTH_KEY !== undefined ? process.env.X_AUTH_KEY : "",
        "Content-Type": "application/json",
    },
}

```

## Null 合体演算子(??)を使う

Null 合体演算子(??)は左辺が null または undefined の場合に右の値を返し、それ以外の場合に左の値を返す。  
上記の型ガードより楽に書ける。

```ts

{
    headers : {
        "X-Auth-Email" : process.env.X_AUTH_EMAIL ?? "",
        "X-Auth-Key": process.env.X_AUTH_KEY ?? "",
        "Content-Type": "application/json",
    },
}

```

Null 合体演算子(??)の代わりに論理演算子 (||) でもOK。
