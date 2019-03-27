import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  CheckBox
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const ViewResearch = props => {
  return (
    <View style={[styles.textContainer, { flexDirection: "row" }]}>
      <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
        {props.label + " "}
      </Text>
      <View style={{ width: "80%" }}>
        <Text style={styles.textStyle}>{props.data}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    margin: 5,
    flex: 1
  },
  textStyle: {
    color: "black",
    fontSize: 18
  }
});
