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
import FontAwersome from "react-native-vector-icons/FontAwesome";
import FontAwersome5 from "react-native-vector-icons/FontAwesome5";

export const editCollege = () => (
  <View style={{ flexDirection: "row", justifyContent: "center" }}>
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
      style={{ marginRight: 5 }}
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

export const RemoveButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
          width: 60,
          backgroundColor: "#c82333",
          borderColor: "#bd2130",
          borderWidth: 1
        }}
      >
        <Text style={{ color: "white", fontSize: 13 }}>Remove</Text>
      </View>
    </TouchableOpacity>
  );
};

export const RadioOnButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Icon name="md-radio-button-on" size={28} color="#000" />
    </TouchableOpacity>
  );
};

export const RadioOffButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Icon name="md-radio-button-off" size={28} color="#000" />
    </TouchableOpacity>
  );
};

export const ViewDetailsButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          backgroundColor: "#007bff",
          padding: 12,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
          borderColor: "#007bff"
        }}
      >
        <Text style={{ color: "white", fontSize: 13 }}>View Details</Text>
      </View>
    </TouchableOpacity>
  );
};

export const BadgeHidden = () => {
  return (
    <View style={[styles.badge, { width: 50, backgroundColor: "#ffc107" }]}>
      <Text style={{ color: "black", fontSize: 13 }}>Hidden</Text>
    </View>
  );
};

export const CheckBoxComponent = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.flexDirec}>
      <CheckBox value={props.value} />
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );
};

export const DetailsTop = () => (
  <View style={{ flexDirection: "row" }}>
    <MaterialCommunityIcons name="information-outline" size={20} />
  </View>
);

export const AbstractTop = () => (
  <View style={{ flexDirection: "row" }}>
    <MaterialCommunityIcons name="file-document" size={20} />
  </View>
);

export const AuthorsTop = () => (
  <View style={{ flexDirection: "row" }}>
    <FontAwersome name="users" size={20} />
  </View>
);

export const PicturesTop = () => (
  <View style={{ flexDirection: "row" }}>
    <FontAwersome5 name="images" size={20} />
  </View>
);

export const DocumentTop = () => (
  <View style={{ flexDirection: "row" }}>
    <MaterialCommunityIcons name="file" size={20} />
  </View>
);

export const HideTop = () => (
  <View style={{ flexDirection: "row" }}>
    <MaterialCommunityIcons name="eye-off" size={20} />
  </View>
);

export const ShowTop = () => (
  <View style={{ flexDirection: "row" }}>
    <MaterialCommunityIcons name="eye" size={20} />
  </View>
);

export const ReportTop = () => (
  <View style={{ flexDirection: "row" }}>
    <FontAwersome5 name="poll-h" size={20} />
  </View>
);

export const CoursesTop = () => (
  <View style={{ flexDirection: "row" }}>
    <FontAwersome5 name="graduation-cap" size={20} />
  </View>
);

export const MoveToBinTop = () => (
  <View style={{ flexDirection: "row" }}>
    <FontAwersome5 name="trash" size={18} color="#bd2130" />
  </View>
);

export const RestoreTop = () => (
  <View style={{ flexDirection: "row" }}>
    <FontAwersome5 name="recycle" size={18} color="#5cb85c" />
  </View>
);

const styles = StyleSheet.create({
  badge: {
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  },
  flexDirec: {
    flexDirection: "row",
    margin: 5,
    alignItems: "center"
  }
});
