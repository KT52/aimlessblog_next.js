import "../styles/global.css";
import 'highlight.js/styles/github-dark.css';
import GoogleTagManager from "../components/GoogleTagManager";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleTagManager />
      <Component {...pageProps} />
    </>
  );
}
