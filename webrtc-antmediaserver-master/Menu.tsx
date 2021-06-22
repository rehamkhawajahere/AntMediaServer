import { useNavigation } from "@react-navigation/core";
import React, { useEffect } from "react";
import { Button, StyleSheet, View, Platform } from "react-native";
import InCallManager from "react-native-incall-manager";
import {
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";

export const Menu = () => {
  const { navigate } = useNavigation();

  useEffect(() => {
    if (InCallManager.recordPermission !== "granted") {
      InCallManager.requestRecordPermission()
        .then((requestedRecordPermissionResult) => {
          console.log(
            "InCallManager.requestRecordPermission() requestedRecordPermissionResult: ",
            requestedRecordPermissionResult
          );
        })
        .catch((err) => {
          console.log("InCallManager.requestRecordPermission() catch: ", err);
        });
    }
  }, []);

  //Permissions handler
  const permissionHandler = async () => {
    let permissions = [];
    if (Platform.OS === "android") {
      permissions = [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
      ];
    } else {
      permissions = [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
    }

    const isPermissionGranted = await checkMultiplePermissions(permissions);

    if (isPermissionGranted) {
      console.log("Camera and microphone permissions granted");
    } else {
      console.log("Permissions not granted");
    }
  };

  const checkMultiplePermissions = async (permissions: any) => {
    let isPermissionGranted = false;
    const statuses = await requestMultiple(permissions);
    for (var index in permissions) {
      if (statuses[permissions[index]] === RESULTS.GRANTED) {
        isPermissionGranted = true;
      } else {
        isPermissionGranted = false;
        break;
      }
    }
    return isPermissionGranted;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button onPress={() => navigate("Viewer")} title="Viewer" />
      <Button onPress={() => navigate("PublisherNew")} title="PublisherNew" />
      <Button onPress={() => permissionHandler()} title="Permissions" />
    </View>
  );
};
