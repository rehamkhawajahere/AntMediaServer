import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { SignalingChannel } from "./SignalingChannel";
import InCallManager from "react-native-incall-manager";

import {
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescriptionType,
  RTCView,
} from "react-native-webrtc";
import { config } from "./config";

const STREAM_ID = "reham";

export const Viewer = () => {
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [reconnect, setReconnect] = useState(true);
  const peerConnection = useRef<RTCPeerConnection>();

  useEffect(() => {
    InCallManager.start({ media: "video" });
    return () => {
      InCallManager.stop();
    };
  }, []);

  const startStreaming = async (
    remoteDescription: RTCSessionDescriptionType
  ) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [],
    });

    peerConnection.current.onaddstream = (event) => {
      console.log("on add stream");
      setRemoteStream(event.stream);
    };

    peerConnection.current.onremovestream = () => console.log("stream removed");

    peerConnection.current.onconnectionstatechange = (event) => {
      console.log(
        "state change connection: ",
        peerConnection.current?.connectionState
      );
      if (
        peerConnection.current?.connectionState === "new" ||
        peerConnection.current?.connectionState === "connecting" ||
        peerConnection.current?.connectionState === "connected"
      ) {
        setReconnect(false);
      } else {
        setReconnect(true);
      }
    };

    peerConnection.current.onsignalingstatechange = () =>
      console.log(peerConnection.current?.signalingState);

    peerConnection.current.onicecandidateerror = () => {
      setReconnect(true);
    };

    peerConnection.current.onicecandidate = (event) => {
      const candidate = event.candidate;
      if (
        candidate &&
        signalingChannel.current?.isChannelOpen() &&
        peerConnection.current?.signalingState === "have-remote-offer"
      ) {
        console.log("sending local ice candidates");
        signalingChannel.current?.sendJSON({
          command: "takeCandidate",
          streamId: STREAM_ID,
          label: candidate.sdpMLineIndex.toString(),
          id: candidate.sdpMid,
          candidate: candidate.candidate,
        });
      }
    };

    await peerConnection.current?.setRemoteDescription(remoteDescription);

    const answer = await peerConnection.current.createAnswer();

    await peerConnection.current.setLocalDescription(answer);
  };

  const signalingChannel = useRef<SignalingChannel>(
    new SignalingChannel(config.SIGNALING_URL, {
      onopen: () => {
        signalingChannel.current?.sendJSON({
          command: "play",
          streamId: STREAM_ID,
        });
      },
      start: async () => {
        console.log("start called");
      },
      stop: () => {
        console.log("stop called");
      },
      takeCandidate: (data) => {
        console.log("onIceCandidate remote");
        peerConnection.current?.addIceCandidate({
          candidate: data?.candidate || "",
          sdpMLineIndex: Number(data?.label) || 0,
          sdpMid: data?.id || "",
        });
      },
      takeConfiguration: async (data) => {
        console.log("got offer: ", data?.type);
        const offer = data?.sdp || "";

        await startStreaming({
          sdp: offer,
          type: data?.type || "",
        });

        signalingChannel.current?.sendJSON({
          command: "takeConfiguration",
          streamId: STREAM_ID,
          type: "answer",
          sdp: peerConnection?.current?.localDescription?.sdp,
        });
      },
    })
  );

  useEffect(() => {
    return () => {
      signalingChannel.current.close();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      reconnectStream(reconnect);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [reconnect]);

  const reconnectStream = (reconnect: boolean) => {
    console.log("reconnect: ", reconnect);
    if (reconnect) {
      signalingChannel.current.close();
      signalingChannel.current.open();
    }
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Button title="Play" onPress={() => signalingChannel.current.open()} />
        <Button title="Stop" onPress={() => signalingChannel.current.close()} />
      </View> */}
      {!!remoteStream && (
        <RTCView
          streamURL={remoteStream?.toURL()}
          style={{ flex: 1, backgroundColor: "black" }}
          objectFit="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-evenly",
    marginBottom: 30,
  },
});
