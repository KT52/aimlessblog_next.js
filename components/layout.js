import Head from "next/head";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

const name = "Aimless Blog";
export const siteTitle = "Aimless Blog";

export default function Layout({ children, home, tags }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:type" content="article" />
        <meta
          name="description"
          content="Webアプリ制作やWebサービスの覚え書きブログ"
        />
        <meta
          property="og:image"
          contente="https://www.ravness.com/squigly_3.png"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary" />
        <meta property="og:image:alt" content="{siteTitle}" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="315" />
      </Head>
      <header className={styles.header}>
        {home ? (
          <>
            {/*<img
              src="/images/profile.jpg"
              className={`${styles.headerHomeImage} ${utilStyles.borderCircle}`}
              alt={name}
            />*/}
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            {/*<Link href="/" legacyBehavior>
              <a>
                <img
                  src="/images/profile.jpg"
                  className={`${styles.headerImage} ${utilStyles.borderCircle}`}
                  alt={name}
                />
              </a>
        </Link>*/}
            <h2 className={utilStyles.headingLg}>
              <Link href="/" legacyBehavior>
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && !tags && (
        <div className={styles.backToHome}>
          <Link href="/">
            ← Back to home
          </Link>
        </div>
      )}
      <footer className={styles.footer}>
        <div>Copyright &copy; ravness.com 2025 All rights reserved.</div>
        <div>
          <Link href="/privacypolicy">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
