import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

class SideDrawerScreen extends Component {
  render() {
    return (
      <View style={[styles.container, {width: Dimensions.get("window").width * 0.8}]}>
        <Text> SideDrawerScreen </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',   
    }
});

export default SideDrawerScreen;
