import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const editCollege = () => (
  <View style={{ flexDirection: "row" }}>
    <Icon
      name="md-create"
      size={20}
      color="#17a2b8"
      style={{ marginRight: 5 }}
    />
    <Text style={{ color: "black" }}>Edit College</Text>
  </View>
);

export const changeLogo = () => (
  <View style={{ flexDirection: "row" }}>
    <Icon
      name="md-radio-button-off"
      size={20}
      color="#17a2b8"
      style={{ marginRight: 5 }}
    />
    <Text style={{ color: "black" }}>Change Logo</Text>
  </View>
);

export const createReport = () => (
  <View style={{ flexDirection: "row" }}>
    <MaterialCommunityIcons
      name="view-list"
      size={20}
      color="#28a745"
      style={{ marginRight: 10 }}
    />
    <Text style={{ color: "black" }}>Create Report</Text>
  </View>
);

export const moveToBin = () => (
  <View style={{ flexDirection: "row" }}>
    <Text style={{ color: "black" }}>Move to Bin</Text>
  </View>
);

export const addCourse = () => (
  <View style={{ flexDirection: "row" }}>
    <Icon name="md-add" size={20} color="#17a2b8" style={{ marginRight: 10 }} />
    <Text style={{ color: "black" }}>Add Course</Text>
  </View>
);

export const courseBin = () => (
  <View style={{ flexDirection: "row" }}>
    <Icon
      name="md-trash"
      size={20}
      color="#dc3545"
      style={{ marginRight: 10 }}
    />
    <Text style={{ color: "black" }}>Bin</Text>
  </View>
);

export const courseList = () => (
  <View style={{ flexDirection: "row" }}>
    <MaterialCommunityIcons
      name="view-list"
      size={20}
      color="#28a745"
      style={{ marginRight: 10 }}
    />
    <Text style={{ color: "black" }}>Courses</Text>
  </View>
);

export const BadgeActive = () => {
  return (
    <View style={[styles.badge, { width: 50, backgroundColor: "#28a745" }]}>
      <Text style={{ color: "white", fontSize: 13 }}>Active</Text>
    </View>
  );
};

export const BadgeInactive = () => {
  return (
    <View style={[styles.badge, { width: 60, backgroundColor: "#dc3545" }]}>
      <Text style={{ color: "white", fontSize: 13 }}>Inactive</Text>
    </View>
  );
};

export const BadgeDeleted = () => {
  return (
    <View style={[styles.badge, { width: 50, backgroundColor: "#dc3545" }]}>
      <Text style={{ color: "white", fontSize: 13 }}>Deleted</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  }
});
