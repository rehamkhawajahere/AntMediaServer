import React, { useState, useRef, useCallback, useEffect } from "react";
import { SafeAreaView, Button } from "react-native";
import { RTCView } from "react-native-webrtc";
/* importing lib */
import { useAntMedia } from "rn-antmedia";

export const PublisherNew = () => {
  const [localStream, setLocalStream] = useState("");
  const [remoteStream, setRemoteStream] = useState(null);
  const stream = useRef({ id: "" }).current;

  const adaptor = useAntMedia({
    url: "ws://3.65.15.121:5080/WebRTCAppEE/websocket",
    mediaConstraints: {
      video: true,
      audio: true,
    },
    sdp_constraints: {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    },
    bandwidth: 300,
    callback(command, data) {
      switch (command) {
        case "pong":
          break;
        case "joinedTheRoom":
        //   if ("onJoinedRoom" in events) {
        //     const tok = data.ATTR_ROOM_NAME;
        //     this.initPeerConnection(data.streamId, "publish");
        //     this.publish(data.streamId, tok);

        //     const streams = data.streams;

        //     // if (streams != null) {
        //     //   streams.forEach((item) => {
        //     //     if (item === stream.id) return;
        //     //     this.play(item, tok, roomId);
        //     //   });
        //     // }
        //   }
        //   break;

        case "publish":
          console.log("publish");
          this.initPeerConnection(data.streamId, "publish");
          this.publish(data.streamId);

          break;
        case "streamJoined":
          //   if ("onStreamJoined" in events) {
          //     this.play(data.streamId, token, roomId);
          //   }
          break;
        default:
          break;
      }
    },
    callbackError: (err, data) => {
      console.error("callbackError", err, data);
    },
  });

  const handleConnect = useCallback(() => {
    if (adaptor) {
      const streamId = "Reham";
      //   const roomId = "5abcd1";

      stream.id = streamId;

      adaptor.publish(streamId);
    }
  }, [adaptor]);

  useEffect(() => {
    if (adaptor) {
      const verify = () => {
        if (
          adaptor.localStream.current &&
          adaptor.localStream.current.toURL()
        ) {
          return setLocalStream(adaptor.localStream.current.toURL());
        }
        setTimeout(verify, 3000);
      };
      verify();
    }
  }, [adaptor]);

  //   useEffect(() => {
  //     if (adaptor && Object.keys(adaptor.remoteStreams).length > 0) {
  //       for (let i in adaptor.remoteStreams) {
  //         if (i !== stream.id) {
  //           let st =
  //             adaptor.remoteStreams[i][0] &&
  //             "toURL" in adaptor.remoteStreams[i][0]
  //               ? adaptor.remoteStreams[i][0].toURL()
  //               : null;
  //           setRemoteStream(st);
  //           break;
  //         } else {
  //           setRemoteStream(null);
  //         }
  //       }
  //     }
  //   }, [adaptor, stream.id]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {localStream ? (
        <RTCView
          style={{
            width: 200,
            height: 200,
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          objectFit="cover"
          streamURL={localStream}
        />
      ) : (
        <Button
          onPress={handleConnect}
          title="Join room"
          color="#841584"
          accessibilityLabel="Connect to antmedia"
        />
      )}

      <Button
        onPress={handleConnect}
        title="Join room"
        color="#841584"
        accessibilityLabel="Connect to antmedia"
      />
    </SafeAreaView>
  );
};
