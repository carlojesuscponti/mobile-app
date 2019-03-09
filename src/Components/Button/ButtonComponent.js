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
        <Icon
          name={props.iconName}
          size={20}
          color="white"
          style={{ paddingRight: 5 }}
        />
        <Text style={styles.textStyle}>{props.children}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    width: "50%",
    height: 40,
    backgroundColor: "#17a2b8",
    borderRadius: 20,
    margin: 10,
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
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
    color: "white"
  }
});

export default ButtonComponent;
