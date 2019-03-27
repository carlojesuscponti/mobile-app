import React, { Component } from "react";
import { View, Text } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { Card } from "react-native-elements";

export const SummaryDashboard = props => {
  return (
    <View
      style={{
        width: "90%",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Card
        containerStyle={{
          width: "100%",
          height: 100,
          justifyContent: "center"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{
                color: props.color,
                fontSize: 19,
                fontWeight: "500"
              }}
            >
              {props.label}
            </Text>
            <Text
              style={{
                color: "black",
                fontSize: 22,
                fontWeight: "500"
              }}
            >
              {props.total}
            </Text>
          </View>
          <View style={{ marginRight: 15 }}>
            <FontAwesome5Icon name={props.icon} size={30} color={props.color} />
          </View>
        </View>
      </Card>
    </View>
  );
};
