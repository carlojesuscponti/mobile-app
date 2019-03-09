import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {} from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
const listItem = props => (
  <TouchableOpacity onPress={props.onItemPressed}>
    <View style={styles.listItem}>
      <View style={{ width: "20%" }}>
        {/* <Image
          resizeMode="cover"
          source={{ uri: props.collegeImage }}
          style={styles.collegeImage}
        /> */}
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            backgroundColor: "red"
          }}
        />
      </View>
      <View style={{ width: "75%" }}>
        <Text style={{ fontSize: 16, color: "black" }}>
          {props.collegeName}
        </Text>
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
    height: 80,
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

  collegeImage: {
    marginRight: 8,
    height: 50,
    width: 50
  }
});

export default listItem;
