import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const gridViewItem = props => {
  return (
    <TouchableOpacity onPress={props.onItemPressed}>
      <View
        style={{
          flex: 1,
          alignContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={[
            styles.GridViewContainer,
            { width: props.itemWidth / 2 - 20 }
          ]}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              backgroundColor: "red"
            }}
          />
          <View style={{ height: 70 }}>
            <Text style={{ fontSize: 16, color: "black", textAlign: "center" }}>
              {props.collegeName}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  GridViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 150,
    margin: 5,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    borderColor: "#808080",
    borderWidth: 1
  }
});

export default gridViewItem;

/*
    <View style={styles.listItem}>
      <View style={{ width: "20%" }}>
         <Image
          resizeMode="cover"
          source={{ uri: props.collegeImage }}
          style={styles.collegeImage}
        /> 
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
*/
