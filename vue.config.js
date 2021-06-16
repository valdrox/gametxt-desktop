// vue.config.js
module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js", // or 'src/preload.js'
      builderOptions: {
        appId: "gametxt.desktop",
        productName: "GameTxt Desktop",
        publish: ["github"],
        mac: {
          category: "public.app-category.education",
        },
        dmg: {
          icon: false,
        },
        linux: {
          target: ["AppImage"],
          category: "Education",
        },
      },
    },
  },
};
