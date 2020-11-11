import {getSortedPostsData} from "../../lib/posts"

export default function handler({ query: { page } }, res) {
  const allPostsData = getSortedPostsData();
  const perPage = 10;
  const total = allPostsData.length;
  const APD = allPostsData.slice(page * perPage - 10, page * perPage);
  res.status(200).json({postdata:APD,total:total});
}
