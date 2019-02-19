import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import ButtonComponent from "../Button/ButtonComponent";

class CollegeOptionsModal extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  render() {
    return (
      <View style={styles.container}>
        <ButtonComponent onPress={() => alert("Hello")} iconName="ios-add">
          Add Course
        </ButtonComponent>

        <ButtonComponent onPress={() => alert("Hello")} iconName="md-create">
          Edit College
        </ButtonComponent>

        <ButtonComponent onPress={() => alert("Hello")} iconName="ios-cog">
          Change Logo
        </ButtonComponent>

        <ButtonComponent onPress={() => alert("Hello")} iconName="md-trash">
          Delete College
        </ButtonComponent>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  buttonStyle: {}
});

export default CollegeOptionsModal;
