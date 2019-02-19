import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ButtonText = (props) => {
    return(
        <TouchableOpacity {...props}>
            <View>
                <Text style={[styles.textStyle, props.textDesign]}>{props.children}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 12,
        color: '#404040',
        textDecorationLine: 'underline'
    }
});

export default ButtonText;