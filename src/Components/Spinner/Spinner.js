import React, { Component } from "react";
import { View, Image } from "react-native";
import spinner from "../../Pictures/gears.gif";

export default function Spinner() {
  return (
    <View>
      <Image
        source={spinner}
        style={{ width: 120, height: 120, margin: "auto" }}
      />
    </View>
  );
}
