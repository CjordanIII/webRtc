const video = document.getElementById("user1");
const socket = new WebSocket("ws://localhost:3000/websocket");
let pc = null;

socket.addEventListener("message", async (event) => {
  const receivedData = JSON.parse(event.data);

  if (receivedData.type === "video-offer") {
    try {
      if (!pc) {
        pc = new RTCPeerConnection();
      }

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          video.srcObject = event.streams[0];
          video.play();
        }
      };

      await pc.setRemoteDescription(
        new RTCSessionDescription(receivedData.sdp)
      );

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.send(
        JSON.stringify({
          type: "video-answer",
          sdp: pc.localDescription,
        })
      );
    } catch (error) {
      console.error("Error handling SDP offer:", error);
    }
  } else if (receivedData.type === "ice-candidate") {
    if (pc) {
      try {
        await pc.addIceCandidate(receivedData.candidate);
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    }
  }
});
