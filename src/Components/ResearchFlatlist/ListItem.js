import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Ionicons";

const listItem = props => (
  <TouchableOpacity onPress={props.onItemPressed}>
    <View style={styles.listItem}>
      <View style={{ width: "10%" }}>
        <FontAwesomeIcon name="book" size={20} style={styles.iconStyle} />
      </View>
      <View style={{ width: "85%" }}>
        <Text>{props.researchesName}</Text>
        <Text>{props.researchesCollege}</Text>
        <Text>{props.researchesCourse}</Text>
      </View>

      <View style={{ width: "5%" }}>
        <Icon name="ios-arrow-forward" size={15} />
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    height: 100,
    marginTop: 3,
    marginBottom: 3,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    borderColor: "#808080",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  iconStyle: {
    marginRight: 8
  }
});

export default listItem;
