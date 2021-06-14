<template>
  <div id="wrapper">
    <div id="left-container">
      <h1>
        <img id="logo" src="~@/assets/logo.png" alt="electron-vue" />GameTxt
      </h1>

      <h2 class="title">Stream PC to Phone</h2>

      <h2 id="instruction-title">Instructions</h2>
      <ol id="instruction-list">
        <li>
          Install and open the app on your phone. Get it
          <a href="#" @click="openMobileAppLink" class="open-browser">here</a>.
        </li>
        <li>
          Open a PC Game, or start a game streaming session in browser now via
          Xbox Game Pass (new!). Link
          <a href="#" @click="openGamePassLink" class="open-browser">here</a>.
        </li>
        <li>
          Click the start streaming button on the right. The devices must be on
          the same wifi network.
        </li>
      </ol>
    </div>
    <div id="right-container">
      <Streamer />
      <button
        id="toggle-streaming"
        @click="toggleStream"
        v-if="localStreamingAddress"
      >
        {{ isStreaming ? "stop streaming" : "start streaming" }}
      </button>
    </div>
  </div>
</template>

<script>
import Streamer from "./Streamer.vue";
export default {
  name: "landing-page",
  data() {
    return { isStreaming: false, localStreamingAddress: null };
  },
  components: {
    Streamer,
  },
  methods: {
    toggleStream() {
      this.videoStreamer.toggleStream();
    },
    openMobileAppLink() {
      // shell.openExternal(
      //   "https://play.google.com/store/apps/details?id=com.learningmachine.big"
      // );
    },
    openGamePassLink() {
      // shell.openExternal("https://www.xbox.com/play");
    },
  },
  mounted() {},
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
  color: white;
}

#wrapper {
  background: #000;
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
  display: flex;
  flex-direction: row;
}

#logo {
  height: 24px;
  width: 24px;
  margin-right: 4px;
}

.title {
  color: #9bbbdb;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 26px;
}

#toggle-streaming {
  font-size: 1.2em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 4px;
  color: #fff;
  background: none;
  border: 1px solid white;
  margin-bottom: 7px;
}

#instruction-title {
  margin-top: 3em;
  margin-bottom: 0.5em;
  font-size: 1.2em;
  line-height: 1.5em;
}

#instruction-list {
  font-size: 1.2em;
  line-height: 1.5em;
  list-style-position: inside;
  padding-left: 0;
}

.open-browser {
  text-decoration-line: none;
  color: orange;
}

#left-container {
  flex: 1;
}

#right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
