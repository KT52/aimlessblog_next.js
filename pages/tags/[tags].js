import Layout, { siteTitle } from "../../components/layout";
import { getTags, getTagsPosts } from "../../lib/posts";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import Date from "../../components/date";
import styles from "../../components/layout.module.css";

export default function TagsPosts({ postData,tag }) {
  return (
    <Layout tags>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Tag: {tag} </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ul className={utilStyles.list}>
          {postData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${encodeURIComponent(id)}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
      <div className={styles.backToHome}>
        <Link href="/tags">
          <a>← Back to Tags</a>
        </Link>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getTags().map((tags) => {
    return `/tags/${tags}`;
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const tag = params.tags;
  const postData = await getTagsPosts(tag);
  return {
    props: {
      postData,
      tag,
    },
  };
}
