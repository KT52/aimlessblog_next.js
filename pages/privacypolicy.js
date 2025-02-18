
import styles from "../components/layout.module.css";
import Link from "next/link";

export default function Privacy() {
    return (
      <div className={styles.container}>
        <h2>アクセス解析ツールについて</h2>
        当サイトは、Googleの「Google
        Analytics」をアクセス解析ツールとして利用しています。トラフィックデータ収集のためにCookieを使用していますが、個人を特定するものではございません。トラフィックデータ収集は、Cookieの無効化により拒否することが可能です。詳しい利用規約につきましては、下記のページをご参照ください。
        [Terms of Service | Google Analytics -
        Google](https://www.google.com/intl/ja/analytics/terms/)
        <h2>広告の配信について</h2>
        当サイトではGoogle AdSenseの広告を配信しています。 Google AdSense
        当サイトはGoogle及びGoogleのパートナー（第三者配信事業者）の提供する広告を設置しております。その広告配信にはCookieを使用し、当サイトへの過去のアクセス情報に基づいて広告を配信します。
        Double Click Cookie
        を使用することにより、GoogleやGoogleのパートナーは当サイトや他のサイトへのアクセス情報に基づいて、適切な広告を当サイト上でお客様に表示できます。Double
        Click
        Cookieは氏名、住所、メールアドレス、電話番号など個人を特定するものではございません。
        お客様は下記のGoogleアカウントの広告設定ページで、インタレストベースでの広告掲載に使用される
        Double Click Cookie を無効にできます。また www.aboutads.info
        のページにアクセスして頂き、インタレストベースでの広告掲載に使用される第三者配信事業者のCookieを無効にできます。
        その他、Googleの広告におけるCookieの取り扱い詳細については、Googleのポリシーと規約ページをご覧ください。
        <h2>免責事項</h2>
        当サイトに掲載された情報については充分な注意を払っておりますが、その内容の正確性等に対して、一切保障するものではありません。
        当サイトの利用で起きたいかなる結果について、一切責任を負わないものとします。リンク先の参照は各自の責任でお願い致します。
        当サイトは著作権の侵害を目的とするものではありません。使用している版権物の知的所有権は、それぞれの著作者・団体に帰属しております。著作権や肖像権に関して問題がありましたらご連絡下さい。著作権所有者様からの警告及び修正・撤去のご連絡があった場合は、迅速に対処または削除いたします。
        <div className={styles.backToHome}>
          <Link href="/">
            ← Back to home
          </Link>
        </div>
      </div>
    );
}
