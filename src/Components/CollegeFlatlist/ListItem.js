import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { BadgeActive, BadgeDeleted } from "../Button/buttons";
import Icon from "react-native-vector-icons/FontAwesome5";

const listItem = props => {
  return (
    <TouchableOpacity onPress={props.onItemPressed}>
      <View style={styles.listItem}>
        <View style={{ width: 90 }}>
          <Image
            resizeMode="cover"
            source={{ uri: props.collegeImage }}
            style={styles.collegeImage}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View style={{ width: "60%" }}>
            <Text style={{ fontSize: 16, color: "black" }}>
              {props.collegeName}
            </Text>
            {props.status === 0 ? <BadgeActive /> : <BadgeDeleted />}
          </View>

          <View style={{ width: "35%" }}>
            <Text style={{ color: "#000", fontSize: 13 }}>Documents</Text>
            <View
              style={{
                borderColor: "#808080",
                borderWidth: 1,
                borderRadius: 5
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: "#808080",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Icon
                  name="book"
                  size={15}
                  color="#000"
                  style={{ marginRight: 5, marginLeft: 8 }}
                />
                <Text style={{ fontSize: 16, color: "black" }}>
                  Research Total: {props.researchTot}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="journal-whills"
                  size={15}
                  color="#000"
                  style={{ marginRight: 5, marginLeft: 8 }}
                />
                <Text style={{ fontSize: 16, color: "black" }}>
                  Journal Total: {props.journalTot}
                </Text>
              </View>
            </View>
          </View>

          {/* <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Icon name="ios-arrow-forward" size={15} />
        </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    minHeight: 80,
    marginTop: 3,
    marginBottom: 3,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    borderColor: "#808080",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  collegeImage: {
    borderRadius: 100,
    marginRight: 8,
    height: 80,
    width: 80
  }
});

export default listItem;
