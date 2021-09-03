---
title: VercelのServerless FunctionsでFastAPIを使う
date: '2021-09-03'
tag:
- vercel
- fastapi
slug: fastapivercel
---

VercelにFastAPIをデプロイして読み込み専用のRestAPIとして利用してみます。
データベースはSQLite3を使用しています。  
Serverless Functionsではデータベースに書き込みはできないので書き込みが必要なアプリを作るなら
firestoreとか他のサービスと連携してください。

## ローカル環境にvenvで仮想環境を作成

```console
python3 -m venv fastapi-vercel
```

ディレクトリに移動してアクティベート

```console
cd fastapi-vercel
source bin/activate
または
.\scripts\activate
```

FastAPIをインストール

```console
pip install fastapi
```

## apiディレクトリの作成

Serverless Functionsはapiディレクトリにサポートされている言語ファイル（Node.js: .js .ts, Go: .go, Python: .py, Ruby: .rb ）を置くと自動で認識されるので、apiディレクトリを作ってそこに`index.py`を置きます。

[Serverless Functions](https://vercel.com/docs/serverless-functions/supported-languages#)
>Within the /api directory of your projects, Vercel will automatically recognize the languages listed on this page, through their file extensions, and serve them as Serverless Function.
>>プロジェクトの/apiディレクトリ内で、Vercelはこのページに掲載されている言語を、そのファイルの拡張子によって自動的に認識し、Serverless Functionとして提供します。

ディレクトリ構造は以下のようになります

```txt
fastapi-vercel
    |--api/
    |   |--index.py
    |
    |--requirements.txt
    |--vercel.json
```

## index.py

とりあえずテストファイルを作ります。

```py
from fastapi import FastAPI

app = FastAPI()

@app.get("/api")
async def root():
    return {"message": "Hello World"}

@app.get("/api/test")
async def test():
    return {"message": "Hello Test"}

```

## vercel.json

上記まで作成してVercelにデプロイして"~.vercel.app"や" ~.vercel.app/api"にアクセスしても404が表示されるので、
vercel.jsonで`rewrites`の設定をします。`routes`はレガシーな設定なので代わりにcleanUrls, trailingSlash, redirects, rewrites, and/or headersを使いましょう。  
→[参照](https://vercel.com/docs/cli#project-configuration/routes)

**vercel.json**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/api/index.py" }]
}
```

## requirements.txt

`pip freeze > requirements.txt`でrequirements.txt作成。

## Vercelにデプロイ

GitHubにプッシュしたらVercelでリポジトリを選択してデプロイします。
特に設定することはありません。

エラーがなければCongratulations!と表示されます。

![fastapi-vercel1](../../../images/fastapi-vercel1.jpg)

[https://fastapi-vercel-eosin.vercel.app/api](https://fastapi-vercel-eosin.vercel.app/api)にアクセスすると{"message":"Hello World"}が返っているのが確認できます。

![fastapi-vercel2](../../../images/fastapi-vercel2.jpg)

[https://fastapi-vercel-eosin.vercel.app/api/test](https://fastapi-vercel-eosin.vercel.app/api/test)

![fastapi-vercel3](../../../images/fastapi-vercel3.jpg)

[https://fastapi-vercel-eosin.vercel.app/docs](https://fastapi-vercel-eosin.vercel.app/docs)でAPIドキュメントも表示された。

![fastapi-vercel4](../../../images/fastapi-vercel4.jpg)

## SQL

SQLite3のデータを読み込むので`pip install sqlalchemy`でSQLAlchemyをインストール。  
あと、`async-generator`と`async-exit-stack`を`pip install async-generator async-exit-stack`でインストール。  
import等をする必要はないのですが、この2つがないとVercel上でDBの読み込みができません。  
再び`pip freeze > requirements.txt`

データベース関連ファイルは当ブログ[FlaskアプリをFastAPIに置き換える](https://www.ravness.com/posts/fromflasktofastapi)を流用。
apiディレクトリに"databese.py"、"model.py"、"crud.py"、schemas.pyをコピーしていくつか修正。
dbファイルはfastapi-vercel/dbに置きます。

```txt
fastapi-vercel
    |--api/
    |   |--index.py
    |   |--database.py
    |   |--model.py
    |   |--crud.py
    |   |--schemas.py
    |
    |--db/
    |   |--book.db
    |--requirements.txt
    |--vercel.json
```

**database.py**

```py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./db/book.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

**model.py**

```py
from sqlalchemy import Column, Integer, String
from .database import Base


class Book(Base):
    __tablename__ = 'book'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    author = Column(String)
    publisher = Column(String)
```

**crud.py**

```py
from sqlalchemy.orm import Session
from . import model


def all_list(db: Session):
    return db.query(model.Book).all()
```

**schemas.py**

```py
from pydantic import BaseModel
from typing import Optional

class Datasout(BaseModel):
    title: str
    author: str
    publisher: Optional[str] = None
    id: int

    class Config:
        orm_mode = True
```

**index.py**

```py
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import crud
from .database import SessionLocal, engine
from .schemas import Datasout
from typing import List

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api")
async def root():
    return {"message": "Hello World"}

@app.get("/api/test")
async def test():
    return {"message": "Hello Test"}


@app.get("/api/list", response_model=List[Datasout])
async def read_list(db: Session = Depends(get_db)):
        result = crud.all_list(db)
        return result
```

## Vercelにデプロイ

Vercelにデプロイしてエラーも出なかったので[https://fastapi-vercel-eosin.vercel.app/api/list](https://fastapi-vercel-eosin.vercel.app/api/list)にアクセスしてみると……  

![fastapi-vercel5](../../../images/fastapi-vercel5.jpg)

データベースの読み込みに成功してjsonで返ってます。


## まとめ

このように読み込み専用のAPIとして利用して、あとはフロントエンドを用意すればVercelで無料で運用できるのですごく便利です。

[GitHubリポジトリ](https://github.com/Squigly77/fastapi-vercel)
