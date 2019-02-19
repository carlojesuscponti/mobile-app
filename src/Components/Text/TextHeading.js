import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';

const textHeading = (props) => {
    return(
        <View>
            <Text style={styles.textHeadingStyle}>
                {props.children}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    textHeadingStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    }
});

export default textHeading;