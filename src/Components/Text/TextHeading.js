import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

const textHeading = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.textHeadingStyle}>{props.children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textHeadingStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center"
  },
  container: {
    alignItems: "center"
  }
});

export default textHeading;
