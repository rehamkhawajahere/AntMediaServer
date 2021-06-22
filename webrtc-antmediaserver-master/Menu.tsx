import { useNavigation } from "@react-navigation/core";
import React, { useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import InCallManager from "react-native-incall-manager";

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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button onPress={() => navigate("Viewer")} title="Viewer" />
      <Button onPress={() => navigate("Publisher")} title="Publisher" />
    </View>
  );
};
