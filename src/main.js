import { createApp } from "vue";
import App from "./App.vue";

window.api.receive("fromMain", (result) => {
  console.log(result);
});

window.api.send("toMain", { status: false });

createApp(App).mount("#app");
