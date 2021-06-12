const { desktopCapturer } = require("electron");

// const handleStream = (stream) => {
//   //   const video = document.querySelector("video");
//   //   video.srcObject = stream;
//   //   video.onloadedmetadata = (e) => video.play();
// };

// const handleError = (e) => {
//   console.log(e);
// };

import Bonjour from "bonjour";

const bonjour = Bonjour();

const getSourcesWithThumbnails = async () => {
  const sources = await desktopCapturer.getSources({
    types: ["window", "screen"],
  });

  for (const source of sources) {
    const thumbnailJPEG = await source.thumbnail.toJPEG(60);
    const size = await source.thumbnail.getSize();
    source.thumbnail = { size, thumbnailJPEG };
  }
  return sources;
};

const findLocalService = () => {
  return new Promise((resolve, reject) => {
    bonjour.find({ type: "gametxt" }, (service) => {
      const { address } = service.referer;
      const { protocol, port } = service;
      resolve({ protocol, address, port });
      // initialize converter.
    });
  });
};

export default async (status) => {
  const sources = await getSourcesWithThumbnails();

  const { protocol, address, port } = await findLocalService();

  //   for (const source of sources) {
  //     if (source.name === "Electron") {
  //       try {
  //         const stream = await navigator.mediaDevices.getUserMedia({
  //           audio: false,
  //           video: {
  //             mandatory: {
  //               chromeMediaSource: "desktop",
  //               chromeMediaSourceId: source.id,
  //               minWidth: 1280,
  //               maxWidth: 1280,
  //               minHeight: 720,
  //               maxHeight: 720,
  //             },
  //           },
  //         });
  //         handleStream(stream);
  //       } catch (e) {
  //         handleError(e);
  //       }
  //       return;
  //     }
  //   }

  return { status, sources, protocol, address, port };
};
