import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import displayPicture from "../../Pictures/default.jpg";
import { logoutUser } from "../../store/actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class PrivateScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      fname: "Carlo",
      mname: "C.",
      lname: "Ponti"
    };
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

  logOutHandler = () => {
    this.props.logoutUser();
  };

  render() {
    const { fname, mname, lname } = this.state;
    const fullname = fname + " " + mname + " " + lname;

    return (
      <View style={styles.container}>
        <Image source={displayPicture} style={styles.imageStyle} />
        <View>
          <Text style={styles.nameStyle}>{fullname}</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.logOutHandler}
        >
          <Text style={styles.buttonText}> Log Out </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  buttonContainer: {
    width: "50%",
    height: 30,
    backgroundColor: "orange",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 20,
    color: "white"
  },
  nameStyle: {
    fontSize: 20,
    color: "black"
  },
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 50
  }
});

PrivateScreen.propTypes = {
  logoutUser: PropTypes.func.isRequired
};

export default connect(
  null,
  { logoutUser }
)(PrivateScreen);
