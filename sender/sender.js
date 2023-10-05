const video = document.getElementById("user1");
const pc = new RTCPeerConnection();
const socket = new WebSocket("ws://localhost:3000/websocket");

async function getLocalMediaAndSendData() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    video.srcObject = mediaStream;

    video.addEventListener("loadedmetadata", () => {
      video.play();
    });

    for (const track of mediaStream.getTracks()) {
      pc.addTrack(track, mediaStream);
    }

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    pc.setConfiguration(configuration);

    pc.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({
            type: "ice-candidate",
            candidate: event.candidate,
          })
        );
      }
    });

    const myUsername = "jeff";
    const targetUsername = "black";
    socket.send(
      JSON.stringify({
        name: myUsername,
        target: targetUsername,
        type: "video-offer",
        sdp: pc.localDescription,
      })
    );
  } catch (error) {
    console.log(error);
  }
}

socket.addEventListener("open", () => {
  getLocalMediaAndSendData();
});

function sendToServer(data) {
  const jsonMessage = JSON.stringify(data);
  socket.send(jsonMessage);
}
