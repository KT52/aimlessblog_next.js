---
title: GCEでスワップ領域の追加をする
date: '2022-06-11'
categories: gce
tag:
- gce
- vps
slug: gceswap
---

GCEで無料枠のあるe2-microはメモリ１GBで心許ないのでスワップ領域を確保して少しだけ余裕を持たせたい。

## スワップファイルを作成

1. ddコマンドでスワップファイルを作成
    
    今回は領域を2GBにするので

    ```
    sudo dd if=/dev/zero of=/swapfile count=2048 bs=1MiB
    ```

2. スワップ領域のセットアップ
    
    ```
    sudo mkswap /swapfile
    ```
    
3. パーミッションの変更　
    
    ```
    sudo chmod 600 /swapfile
    ```

4. ちゃんとセットアップできたか確認
    
    ```
    sudo swapon -s
    ```
    
    このように表示されていれば問題なし

    ```
    xxxx@xxxx:~$ sudo swapon -s
    Filename                                Type            Size    Used    Priority
    /swapfile                               file            2097148 524     -2
    ```

5. /etc/fstabファイル編集  
    このままだと再起動した時にswapが自動マウントされないので、
    `/etc/fstab`ファイルの末尾に次の新しい行を追加し、ファイルを保存  して終了します。

    ```
    sudo vim /etc/fstab
    ```

    下を末尾に追加
    ```
    /swapfile swap swap defaults 0 0
    ```

    `free -h`で確認
    ```
    xxxxx@xxxxx:~$ free -h
                      total        used        free      shared  buff/cache   available
        Mem:          968Mi       114Mi       595Mi       0.0Ki       257Mi       709Mi
        Swap:         2.0Gi        34Mi       2.0Gi
    ```

    以上です。



