import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { ViewDetailsButton } from "../Button/buttons";
import { BadgeActive, BadgeDeleted, BadgeHidden } from "../Button/buttons";

const listItem = props => (
  <View style={styles.listItem}>
    <View style={{ width: "100%" }}>
      <Text style={[styles.textStyle, { fontSize: 18 }]}>
        {props.researchesName}
      </Text>
      <Text style={styles.textStyle}>{props.researchesCollege}</Text>
      <Text style={styles.textStyle}>{props.researchesCourse}</Text>
      {props.status === 0 ? (
        props.hidden === 0 ? (
          <BadgeActive />
        ) : (
          <BadgeHidden />
        )
      ) : (
        <BadgeDeleted />
      )}
      <TouchableOpacity
        onPress={props.onItemPressed}
        style={{ width: "40%", alignSelf: "center" }}
      >
        <View
          style={[
            styles.button,
            { backgroundColor: props.status === 0 ? "#007bff" : "#dc3545" }
          ]}
        >
          <Text style={{ color: "white" }}>View Details</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    minHeight: 70,
    maxHeight: 250,
    marginTop: 3,
    marginBottom: 3,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    borderColor: "#808080",
    borderWidth: 1,
    alignItems: "center"
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    marginLeft: 8,
    marginTop: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "#007bff"
  },
  textStyle: {
    color: "black",
    margin: 2,
    fontSize: 16
  }
});

export default listItem;
