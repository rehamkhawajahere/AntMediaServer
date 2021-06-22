import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Menu } from "./Menu";
import { Publisher } from "./Publisher";
import { PublisherNew } from "./PublisherNew";
import { Viewer } from "./Viewer";

const StackNavigator = createStackNavigator();

export const App = () => {
  return (
    <StackNavigator.Navigator initialRouteName="Menu">
      <StackNavigator.Screen name="Menu" component={Menu} />
      <StackNavigator.Screen name="Publisher" component={Publisher} />
      <StackNavigator.Screen name="PublisherNew" component={PublisherNew} />
      <StackNavigator.Screen name="Viewer" component={Viewer} />
    </StackNavigator.Navigator>
  );
};
