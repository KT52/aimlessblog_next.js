---
title: GitHubのSSH鍵をWindowsとWSL2で共有
date: '2021-08-02'
tag:
- github
slug: sshshare
---

WSL2でGitHubのSSH鍵はどうするのだろう？と思ったらWindowsからコピーするだけだった。終わり。
……なんですが、少しだけつまづいたところとかのメモ。
WindowsでGitHubのSSH鍵が既に存在している前提で進めます。

## GitHubのSSH鍵をWSL2側にコピー

SSH鍵はデフォルトだと`/c/Users/ユーザー名/.ssh`に作られるのでこれをWSL2側にコピー

```console
cp -r /mnt/c/Users/ユーザー名/.ssh ~/.ssh
```

## パーミッションの変更

```console
chmod 600 .ssh/id_rsa
```

## SSH接続の確認でエラーがでたら

`ssh -T git@github.com`コマンドで

```console
ssh: Could not resolve hostname github: Name or service not known
```

のようなエラーが表示されたら、`~/.ssh/config`を作成して

```console
Host github github.com
  HostName github.com
  IdentityFile ~/.ssh/id_rsa
  User git
```

と記述しましょう。

再び`ssh -T git@github.com`コマンドで

```console
Hi アカウント名! You've successfully authenticated, but GitHub does not provide shell access.
```

と表示されれば大丈夫です。