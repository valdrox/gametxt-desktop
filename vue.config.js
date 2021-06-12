// vue.config.js
module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js", // or 'src/preload.js'
    },
  },
};
