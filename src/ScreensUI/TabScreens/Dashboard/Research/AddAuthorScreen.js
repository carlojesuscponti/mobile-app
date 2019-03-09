import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addAuthor } from "../../../../store/actions/researchActions";
import InputComponent from "../../../../Components/Input/InputComponent";
import ButtonComponent from "../../../../Components/Button/ButtonComponent";

class AddAuthorScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      role: ""
    };
  }

  changedNameHandler = name => {
    this.setState({ name });
  };

  changedRoleHandler = role => {
    this.setState({ role });
  };

  submitHandler = () => {
    const { name, role } = this.state;
    if (name === "" || role === "") {
      Alert.alert("Warning", "Fill up the fields!");
    } else {
      const authorData = {
        name: name,
        role: role,
        researchId: this.props.researchId
      };

      Alert.alert(
        "Message",
        "Are you sure?",
        [
          {
            text: "Cancel",
            onPress: () => {
              this.props.navigator.pop();
            },
            style: "cancel"
          },
          {
            text: "NO",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "YES",
            onPress: () => {
              this.props.addAuthor(authorData);
              this.props.navigator.pop();
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>* = Required Fields</Text>
        <InputComponent
          placeholder="* Name"
          icon="ios-cog"
          value={this.state.name}
          onChangeText={this.changedNameHandler}
        />

        <InputComponent
          placeholder="* Role"
          icon="ios-cog"
          value={this.state.role}
          onChangeText={this.changedRoleHandler}
        />

        <ButtonComponent onPress={this.submitHandler}> Submit </ButtonComponent>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  textStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red"
  }
});

AddAuthorScreen.propTypes = {
  errors: PropTypes.object.isRequired,
  addAuthor: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  research: state.research
});

export default connect(
  mapStateToProps,
  { addAuthor }
)(AddAuthorScreen);
