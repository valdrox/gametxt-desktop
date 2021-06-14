<template>
  <div>
    <ul>
      <li v-for="source in sources" :key="source.title">{{ source.name }}</li>
    </ul>
    <div v-if="remoteUid">
      <button @click="toggleStream">bob</button>
    </div>
  </div>
</template>

<script>
import Peer from "peerjs/dist/peerjs.js";

export default {
  data() {
    return {
      sources: null,
      remoteUid: null,
    };
  },
  mounted() {
    window.api.receive("fromMain", (result) => {
      if (result.sources) {
        this.sources = result.sources;
        console.log("sources", this.sources.length);
      }
      if (result.service?.txt?.uid) {
        this.remoteUid = result.service.txt.uid;
        console.log("remoteUid", this.remoteUid);
      }
    });

    window.api.send("toMain", { init: true });

    var lastPeerId = null;
    var peer = null; // own peer object
    var conn = null;

    /**
     * Create the Peer object for our end of the connection.
     *
     * Sets up callbacks that handle any events related to our
     * peer object.
     */
    const initialize = () => {
      // Create own peer object with connection to shared PeerJS server
      peer = new Peer(null, {
        debug: 2,
        reliable: true,
      });

      this.peer = peer;

      peer.on("open", function () {
        // Workaround for peer.reconnect deleting previous id
        if (peer.id === null) {
          console.log("Received null id from peer open");
          peer.id = lastPeerId;
        } else {
          lastPeerId = peer.id;
        }

        console.log("ID: " + peer.id);
        join();
      });
      peer.on("connection", function (c) {
        // Disallow incoming connections
        c.on("open", function () {
          c.send("Sender does not accept incoming connections");
          setTimeout(function () {
            c.close();
          }, 500);
        });
      });
      peer.on("disconnected", function () {
        console.log("Connection lost. Please reconnect");

        // Workaround for peer.reconnect deleting previous id
        peer.id = lastPeerId;
        peer._lastServerId = lastPeerId;
        peer.reconnect();
      });
      peer.on("close", function () {
        conn = null;
        console.log("Connection destroyed");
      });
      peer.on("error", function (err) {
        console.log(err);
        alert("" + err);
      });
    };

    /**
     * Create the connection between the two Peers.
     *
     * Sets up callbacks that handle any events related to the
     * connection and data received on it.
     */
    const join = () => {
      console.log("start join!");
      // Close old connection
      if (conn) {
        conn.close();
      }

      const remotePeerId = this.remoteUid;
      // Create connection to destination peer specified in the input field
      conn = peer.connect(remotePeerId, {});

      conn.on("open", async () => {
        console.log("Connected to: " + conn.peer);
      });
      // Handle incoming data (messages only since this is the signal sender)
      conn.on("data", function (data) {
        console.log("🚀 ~ file: Streamer.vue ~ line 115 ~ data", data);
      });
      conn.on("close", function () {
        console.log("connection closed");
      });
    };

    // const sendMessage = (msg) => {
    //   if (conn && conn.open) {
    //     conn.send(msg);
    //   } else {
    //     console.log("Connection is closed");
    //   }
    // };

    // Since all our callbacks are setup, start the process of obtaining an ID
    initialize();
  },
  methods: {
    async toggleStream() {
      const source = this.sources.find((a) => (a.name = "gametxt-desktop"));

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
            minFrameRate: 2,
            maxFrameRate: 4,
          },
        },
      });

      this.peer.call(this.remoteUid, stream);
    },
  },
};
</script>

<style>
* {
  color: white;
}
</style>