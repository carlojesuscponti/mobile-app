import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addCourse } from "../../../store/actions/collegeAction";
import InputComponent from "../../../Components/Input/InputComponent";
import ButtonComponent from "../../../Components/Button/ButtonComponent";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

class AddCourseScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      initials: "",
      errors: {}
    };
  }
  submitHandler = () => {
    const { name, initials } = this.state;
    if (name === "" || initials === "") {
      Alert.alert("Warning", "Fill up the fields!");
    } else {
      const courseData = {
        name: this.state.name,
        initials: this.state.initials,
        colId: this.props.collegeData._id,
        college: this.props.collegeData
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
              this.props.addCourse(courseData);
              this.props.navigator.pop();
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  changedNameHandler = val => {
    this.setState({ name: val });
  };

  changedInitialsHandler = val => {
    this.setState({ initials: val });
  };

  render() {
    return (
      <View style={styles.container}>
        <InputComponent
          placeholder="* Course Name"
          onChangeText={this.changedNameHandler}
          value={this.state.name}
          icon="ios-cog"
        />

        <InputComponent
          placeholder="* Course Initials"
          onChangeText={this.changedInitialsHandler}
          value={this.state.initials}
          icon="ios-cog"
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
  }
});

AddCourseScreen.propTypes = {
  errors: PropTypes.object.isRequired,
  addCourse: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  college: state.college
});

export default connect(
  mapStateToProps,
  { addCourse }
)(AddCourseScreen);
