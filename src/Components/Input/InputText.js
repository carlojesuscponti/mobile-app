import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const InputComponent = props => {
  return (
    <View style={styles.SectionStyle}>
      <TextInput
        style={{ flex: 1 }}
        {...props}
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#000",
    height: 40,
    borderRadius: 5,
    margin: 10,
    width: "80%"
  },
  IconStyle: {
    margin: 10
  }
});

export default InputComponent;
