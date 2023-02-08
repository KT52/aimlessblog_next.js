---
title: Python+SQLiteのlike句で％を使う場合のプレースホルダの書き方
date: '2018-07-06'
categories: Python
tag:
- python
- sqlite
slug: pythonsqlite
---

Python（+Flask）+SQLiteでパターンマッチングしたものを抽出するときに次のようなクエリを実行すると、  
```python
@app.route('/', methods=['POST'])
def searchPage():
    if request.method == 'POST':
        word = request.form['word']
        g.db = connect_db()
        g.db.execute("SELECT * FROM school WHERE name like '%?%'",(word,))

#以下略
```

```
sqlite3.ProgrammingError: Incorrect number of bindings supplied. The current statement uses 0, and there are 1 supplied.
```

のようなエラーが出てしまう。

### 解決法
---

変数側に％を記述する。
```python
g.db.execute("SELECT * FROM school WHERE name like ?",('%'+word+'%',))
```

あと、よくあるミスとしてexecuteの第2引数はタプルなので要素が1個のときはカンマで終わらせる   

`('%'+word+'%')`ではなく`('%'+word+'%',)`
