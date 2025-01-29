---
title: Bunでlockfile had changes, but lockfile is frozenのエラーが出る
date: '2025-01-29'
tag:
- bun
- cloudflare
slug: bunlockb
---

先日Cloudflare Pagesにデプロイすると`error: lockfile had changes, but lockfile is frozen`のエラーが出てデプロイできなかったのですが凄く単純な理由でできなかったようです。  
私はBunを使っているのに`npm install`コマンドを使用していたため`package.json`は更新されても、Bunのロックファイル`bun.lockb`が更新されていませんでした。  
なので、改めて`Bun install` することで`bun.lockb`ファイルが更新されて無事デプロイできました。
