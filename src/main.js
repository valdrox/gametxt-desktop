import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import App from "./App.vue";
const Sentry = require("@sentry/electron/dist/renderer");

Sentry.init({
  dsn:
    "https://4f64bbf47aef4ebd884e7b92f9af5199@o232050.ingest.sentry.io/5818207",
});

const app = createApp(App);

app.use(ElementPlus);
app.mount("#app");
