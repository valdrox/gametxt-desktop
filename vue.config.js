// vue.config.js
module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js", // or 'src/preload.js'
      files: ["dist_electron/**/*"],
      builderOptions: {
        publish: ["github"],
      },
    },
  },
};
