import Link from "next/link";
import React, { useEffect } from "react";
import utilStyles from "../styles/utils.module.css";

export default function Page({pageIndex,total,setPageIndex}) {
  return (
    <div className={utilStyles.pagination}>
      {pageIndex > 1 ? (
        <Link href="/">
          <a onClick={() => setPageIndex(pageIndex - 1)}>Prev</a>
        </Link>
      ) : (
        ""
      )}
      <span className={utilStyles.next}>
        {/* Math.floorで切り捨てMath.ceilで切り上げ */}
        {pageIndex !== Math.ceil(total / 10) ? (
          <Link href="/">
            <a onClick={() => setPageIndex(pageIndex + 1)}>Next</a>
          </Link>
        ) : (
          ""
        )}
      </span>
    </div>
  );
};
