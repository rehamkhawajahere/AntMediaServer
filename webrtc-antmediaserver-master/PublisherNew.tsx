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
        case "publish":
          console.log("publish");
          this.initPeerConnection(data.streamId, "publish");
          this.publish(data.streamId);

          break;
        case "stop":
          console.log("stop adapter");

          this.stop(data.streamId);

          break;

        default:
          break;
      }
    },
    callbackError: (err, data) => {
      //   console.error("callbackError", err, data);
    },
  });

  const handleConnect = useCallback(() => {
    if (adaptor) {
      console.log("publish");
      adaptor.publish("reham");
    }
  }, [adaptor]);

  const closeConnect = useCallback(() => {
    if (adaptor) {
      console.log("close");
      adaptor.stop("reham");
    }
  }, [adaptor]);

  useEffect(() => {
    if (adaptor) {
      if (adaptor.localStream.current && adaptor.localStream.current.toURL()) {
        setLocalStream(adaptor.localStream.current.toURL());
        // handleConnect();
      }
    }
  }, [adaptor]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!!localStream && (
        <RTCView
          style={{
            flex: 1,
          }}
          objectFit="cover"
          streamURL={localStream}
        />
      )}

      <Button
        onPress={handleConnect}
        title="Start"
        color="#841584"
        accessibilityLabel="Connect to antmedia"
      />

      <Button
        onPress={closeConnect}
        title="Stop"
        color="#841584"
        accessibilityLabel="Connect to antmedia"
      />
    </SafeAreaView>
  );
};
