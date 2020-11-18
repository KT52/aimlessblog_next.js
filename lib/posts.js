import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import highlight from "remark-highlight.js";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // /posts　配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // id を取得するためにファイル名から ".md" を削除する
    const id = fileName.replace(/\.md$/, "");

    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 投稿のメタデータ部分を解析するために gray-matter を使う
    const matterResult = matter(fileContents);

    // データを id と合わせる
    return {
      id,
      ...matterResult.data,
    };
  });
  // 投稿を日付でソートする
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // 投稿のメタデータ部分を解析するために gray-matter を使う
  const matterResult = matter(fileContents);

  // マークダウンを HTML 文字列に変換するために remark を使う
  const processedContent = await remark()
    .use(html)
    .use(highlight)
    .process(matterResult.content);
  const contentHtml = processedContent.toString()

  // データを id と組み合わせる
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

export function getTags() {
  const allTags = getSortedPostsData();
  let tags = [];
  // concat() メソッドは、2つ以上の配列を結合するために使用します。
  allTags.forEach((post) => {
    //tags = tags.concat(post.tag);
    tags = [...tags,...post.tag];
  });
  // Set オブジェクトは、プリミティブ値やオブジェクト参照を問わず、あらゆる型で一意の値を格納できます。
  const setTags = [...new Set(tags)];
  return setTags.sort();
}

export async function getTagsPosts(tag) {
  const allPosts = getSortedPostsData();
  const tagsPosts = allPosts.filter((post) => post.tag.includes(tag));
  return tagsPosts
}
