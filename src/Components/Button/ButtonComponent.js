import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ButtonComponent = props => {
  return (
    <TouchableNativeFeedback
      onPress={props.onPress}
      disabled={props.disabledButton}
    >
      <View style={styles.buttonStyle}>
        <Text style={styles.textStyle}>{props.children}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    width: "50%",
    backgroundColor: "#138496",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderColor: "#117a8b"
  },
  iconStyles: {
    paddingRight: 5
  },
  textStyle: {
    fontSize: 15,
    color: "white"
  }
});

export default ButtonComponent;
