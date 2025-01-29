import Link from "next/link";
import styles from "../components/layout.module.css";
import utilstyles from "../styles/utils.module.css";

export default function Custom404() {
  return (
    <div style={{textAlign:"center"}}>
      <h1>404 - Page Not Found</h1>
      <div className={utilstyles.ftfimg}>
        <img src="/404.gif" alt="404" />
      </div>

      <div className={styles.backToHome}>
        <Link href="/">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
