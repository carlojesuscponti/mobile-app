import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addCourse } from "../../../../store/actions/collegeAction";
import InputComponent from "../../../../Components/Input/InputComponent";
import ButtonComponent from "../../../../Components/Button/ButtonComponent";

class AddCourseScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      initials: "",
      submitCtr: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errors.name === "Course Name already exists" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Course Name already exists!");
      this.setState({
        submitCtr: 0
      });
    }
    if (
      nextProps.errors.initials === "Course Initials is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Course Initials is required!");
      this.setState({
        submitCtr: 0
      });
    }
    if (
      nextProps.errors.initials === "Course Initials already exists" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Course Initials already exists!");
      this.setState({
        submitCtr: 0
      });
    }
    if (
      nextProps.errors.name === undefined &&
      nextProps.errors.initials === undefined &&
      this.state.submitCtr === 1
    ) {
      this.setState({
        submitCtr: 0
      });
      this.props.navigator.pop();
    }
  }

  submitHandler = () => {
    const { name, initials } = this.state;
    if (name === "" || initials === "") {
      Alert.alert("Warning", "Fill up the fields!");
    } else {
      const uname =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      const courseData = {
        name: this.state.name,
        initials: this.state.initials,
        colId: this.props.collegeData._id,
        college: this.props.collegeData,
        username: uname
      };

      Alert.alert(
        "Message",
        "Are you sure?",
        [
          {
            text: "NO",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "YES",
            onPress: () => {
              this.props.addCourse(courseData);
              this.setState({
                submitCtr: 1
              });
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
  college: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  college: state.college,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addCourse }
)(AddCourseScreen);
