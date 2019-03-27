import React, { Component } from "react";
import { View, Image, Dimensions, ImageBackground, Button } from "react-native";
import LawPic from "../../../../Pictures/COEDPic.jpg";
import startDashboardScreen from "../../../SideDrawer/dashboardPage";
export default class LandingScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  static navigatorStyle = {
    navBarHidden: true
  };

  onLayout(e) {
    const { width, height } = Dimensions.get("window");
    this.setState({
      width: width,
      height: height
    });
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
  changePlace = () => {
    startDashboardScreen();
  };
  render() {
    return (
      <ImageBackground
        resizeMode="cover"
        source={LawPic}
        style={{
          width: Dimensions.get("window").width * 1,
          height: Dimensions.get("window").height * 1,
          alignItems: "center"
        }}
      >
        <View onLayout={this.onLayout.bind(this)} />
        <View style={{ height: 400 }} />
        <View>
          <Button title="press me" onPress={this.changePlace} />
        </View>
      </ImageBackground>
    );
  }
}
