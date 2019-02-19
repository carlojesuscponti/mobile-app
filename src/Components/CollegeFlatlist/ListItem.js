import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const listItem = props => (
  <TouchableOpacity onPress={props.onItemPressed}>
    <View style={styles.listItem}>
      <View style={{ width: "10%" }}>
        <Image
          resizeMode="cover"
          source={{ uri: props.collegeImage }}
          style={styles.collegeImage}
        />
      </View>
      <View style={{ width: "85%" }}>
        <Text>{props.collegeName}</Text>
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
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center"
  },

  collegeImage: {
    marginRight: 8,
    height: 30,
    width: 30
  }
});

export default listItem;
