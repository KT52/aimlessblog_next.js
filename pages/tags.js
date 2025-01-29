import Layout, { siteTitle } from "../components/layout";
import { getTags } from "../lib/posts";
import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

export async function getStaticProps() {
  const allTags = getTags();
  return {
    props: {
      allTags,
    },
  };
}

export default function Tags({allTags}) {
    return (
      <Layout>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Tags</h2>
          <ul className={utilStyles.tagspage}>
            {allTags.map((tag) => (
              <li className={utilStyles.tagsItem} key={tag}>
                <Link href={`/tags/${encodeURIComponent(tag)}`}>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Layout>
    );
}
