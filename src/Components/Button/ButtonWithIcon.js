import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ButtonWithIcon = props => {
  return (
    <TouchableNativeFeedback onPress={props.onPress}>
      <View style={styles.buttonStyle}>
        <Icon
          name={props.iconName}
          size={20}
          color="#17a2b8"
          style={{ paddingRight: 5 }}
        />
        <Text style={styles.textStyle}>{props.children}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    width: "40%",
    height: 40,
    backgroundColor: "#f8f9fa",
    borderColor: "#17a2b8",
    borderWidth: 1,
    borderRadius: 5,
    fontStyle: "normal",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  iconStyles: {
    paddingRight: 5
  },
  textStyle: {
    fontSize: 15,
    color: "black"
  }
});

export default ButtonWithIcon;
