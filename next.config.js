/*const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  // 設定を"withCSS"に渡す
  // 各種設定
});*/

module.exports = {
  webpack: (config) => {
    config.node = {
      fs: "empty",
      /*child_process: "empty",
      net: "empty",
      dns: "empty",
      tls: "empty",*/
    };
    return config;
  },
};