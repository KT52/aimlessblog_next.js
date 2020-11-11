import {
  FacebookShareButton,
  FacebookIcon,
  HatenaShareButton,
  HatenaIcon,
  PocketShareButton,
  PocketIcon,
  TumblrShareButton,
  TumblrIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import utilstyle from "../styles/utils.module.css";

export default function Social({slug,title}) {
    return (
      <footer className={utilstyle.socialbutton}>
        <div className={utilstyle.button}>
          <HatenaShareButton
            url={`https://ravness.com/posts/${slug}`}
            title={`${title}`}
          >
            <HatenaIcon size={32} round />
          </HatenaShareButton>
        </div>
        <div className={utilstyle.button}>
          <TwitterShareButton
            url={`https://ravness.com/posts/${slug}`}
            title={`${title}`}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
        <div className={utilstyle.button}>
          <FacebookShareButton
            url={`https://ravness.com/posts/${slug}`}
            quote={`${title}`}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
        <div className={utilstyle.button}>
          <PocketShareButton
            url={`https://ravness.com/posts/${slug}`}
            quote={`${title}`}
          >
            <PocketIcon size={32} round />
          </PocketShareButton>
        </div>
        <div className={utilstyle.button}>
          <TumblrShareButton
            url={`https://ravness.com/posts/${slug}`}
            title={`${title}`}
          >
            <TumblrIcon size={32} round />
          </TumblrShareButton>
        </div>
      </footer>
    );
}