import React, { Component } from "react";
import { View, Text } from "react-native";

class ScannerScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "sideDrawerToggle") {
        this.props.navigator.toggleDrawer({
          side: "left"
        });
      }
    }
  };

  render() {
    return (
      <View>
        <Text> Scanner Screen </Text>
      </View>
    );
  }
}

export default ScannerScreen;
