import React, { Component } from "react";
import { View, Text, Button, StyleSheet, Alert, CheckBox } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { editCourse } from "../../../../store/actions/collegeAction";
import InputComponent from "../../../../Components/Input/InputComponent";
import ButtonComponent from "../../../../Components/Button/ButtonComponent";

class EditCourseScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      initials: "",
      totalRes: "",
      totalJour: "",
      deleted: "",
      collegeId: "",
      courseId: "",
      deactivate: false,
      submitCtr: 0
    };
  }

  componentDidMount() {
    this.setState({
      name: this.props.courseData.courseName,
      initials: this.props.courseData.courseInitials,
      totalRes: this.props.courseData.courseTotalRes,
      totalJour: this.props.courseData.courseTotalJour,
      deleted: this.props.courseData.courseDeleted,
      collegeId: this.props.courseData.collegeId,
      courseId: this.props.courseData.courseId,
      deactivate: this.props.courseData.courseStatus === 0 ? false : true
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errors.name === "Course Name is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Course Name is required!");
      this.setState({
        submitCtr: 0
      });
    } else if (
      nextProps.errors.name === "Course Name already exists" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Course Name already exists!");
      this.setState({
        submitCtr: 0
      });
    } else if (
      nextProps.errors.initials === "Course Initials is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Course Initials is required!");
      this.setState({
        submitCtr: 0
      });
    } else if (
      nextProps.errors.initials === "Course Initials already exists" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Course Initials already exists!");
      this.setState({
        submitCtr: 0
      });
    } else if (
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
    const {
      name,
      initials,
      totalRes,
      totalJour,
      deleted,
      collegeId,
      courseId,
      deactivate
    } = this.state;
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
        name: name,
        initials: initials,
        researchTotal: totalRes,
        journalTotal: totalJour,
        deleted: deleted,
        colId: collegeId,
        courseId: courseId,
        deactivate: deactivate,
        colInit: this.props.courseData.collegeInit,
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
              this.props.editCourse(courseData);
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
        <View style={{ alignItems: "center" }}>
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

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CheckBox
              value={this.state.deactivate}
              onValueChange={() =>
                this.setState({
                  deactivate:
                    this.props.courseData.courseStatus === 1 ? false : true
                })
              }
            />
            <Text style={{ color: "black", fontSize: 15 }}>Deactivate</Text>
          </View>

          <ButtonComponent onPress={this.submitHandler}>Submit</ButtonComponent>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

EditCourseScreen.propTypes = {
  editCourse: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
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
  { editCourse }
)(EditCourseScreen);
