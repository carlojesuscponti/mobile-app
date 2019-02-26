import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Picker,
  TextInput,
  ScrollView,
  Alert
} from "react-native";

import InputComponent from "../../../Components/Input/InputComponent";
import ButtonComponent from "../../../Components/Button/ButtonComponent";
import RadioGroup from "react-native-radio-buttons-group";
import { RichTextEditor } from "react-native-zss-rich-text-editor";

import { getColleges } from "../../../store/actions/collegeAction";
import { createResearch } from "../../../store/actions/researchActions";

import { connect } from "react-redux";
import PropTypes from "prop-types";

class AddResearchScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: "Thesis",
      college: "",
      course: "",
      abstract: "",
      pages: "",
      submitCtr: 0
    };
  }

  componentWIllMount() {
    if (!this.props.college.loading) {
      this.props.getColleges();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errors.pages === "Research pages is invalid" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Research pages is invalid!");
      this.setState({
        submitCtr: 0
      });
    }

    if (
      nextProps.errors.abstract ===
        "Abstract must be at least 100 characters" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Abstract must be at least 100 characters!");
      this.setState({
        submitCtr: 0
      });
    }

    if (
      nextProps.errors.abstract === undefined &&
      nextProps.errors.pages === undefined &&
      this.state.submitCtr === 1
    ) {
      this.setState({
        submitCtr: 0
      });
      this.props.navigator.pop();
    }
  }

  radioGroupHandler = val => {
    const getValue = val.find(e => e.selected == true);

    this.setState({
      type: getValue.value
    });
  };

  changedTitleHandler = val => {
    this.setState({
      title: val
    });
  };

  changedPagesHandler = val => {
    this.setState({
      pages: val
    });
  };

  changedAbstractHandler = val => {
    this.setState({
      abstract: val
    });
  };

  submitHandler = () => {
    const { title, college, course, abstract, pages } = this.state;
    if (
      title === "" ||
      college === "" ||
      course === "" ||
      abstract === "" ||
      pages === ""
    ) {
      alert("Fill up all the fields!");
    } else {
      const researchData = {
        title: this.state.title,
        type: this.state.type,
        college: this.state.college,
        course: this.state.course,
        abstract: this.state.abstract,
        pages: this.state.pages
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
              this.props.createResearch(researchData);
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

  render() {
    const { colleges, loading } = this.props.college;

    let radioCollegeOptions = [
      { label: "Thesis", value: "Thesis" },
      { label: "Undergrad Research", value: "Undergrad Research" }
    ];

    let dropCollegeOptions = [{ label: "* Select College", value: "" }];
    let dropCourseOptions = [{ label: "* Select Course", value: "" }];

    if (colleges === null || loading) {
    } else {
      this.props.college.colleges.map(college =>
        dropCollegeOptions.push({
          label: college.name.fullName,
          value: college.name.fullName
        })
      );

      this.props.college.colleges.map(college =>
        college.course.map(course => {
          dropCourseOptions.push({
            label: course.name,
            value: course.name
          });
        })
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          width="100%"
          display="flex"
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "red" }}>
              * = Required Fields
            </Text>

            <RadioGroup
              radioButtons={radioCollegeOptions}
              flexDirection="row"
              onPress={this.radioGroupHandler}
            />

            <InputComponent
              placeholder="* Research Title"
              onChangeText={this.changedTitleHandler}
              value={this.state.title}
              icon="ios-cog"
            />

            <View style={styles.pickerStyle}>
              <Picker
                selectedValue={this.state.college}
                onValueChange={itemValue =>
                  this.setState({ college: itemValue })
                }
              >
                {dropCollegeOptions.map((colOptions, key) => {
                  return (
                    <Picker.Item
                      key={key}
                      label={colOptions.label}
                      value={colOptions.value}
                    />
                  );
                })}
              </Picker>
            </View>

            <View style={styles.pickerStyle}>
              <Picker
                selectedValue={this.state.course}
                onValueChange={itemValue =>
                  this.setState({ course: itemValue })
                }
              >
                {dropCourseOptions.map((corOptions, key) => {
                  return (
                    <Picker.Item
                      key={key}
                      label={corOptions.label}
                      value={corOptions.value}
                    />
                  );
                })}
              </Picker>
            </View>

            <View style={styles.textContainer}>
              <TextInput
                multiline={true}
                numberOfLines={5}
                style={{ maxHeight: 150, textAlignVertical: "top" }}
                placeholder="* Abstract"
                onChangeText={this.changedAbstractHandler}
              />
            </View>

            <InputComponent
              placeholder="* Pages"
              onChangeText={this.changedPagesHandler}
              value={this.state.pages}
              icon="ios-cog"
            />
            <ButtonComponent onPress={this.submitHandler}>
              Submit
            </ButtonComponent>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%"
  },
  pickerStyle: {
    width: "80%",
    height: 40,
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 0.5,
    justifyContent: "center",
    marginBottom: 10
  },
  textContainer: {
    width: "80%",
    borderColor: "#000",
    borderWidth: 0.5
  }
});

AddResearchScreen.propTypes = {
  createResearch: PropTypes.func.isRequired,
  getColleges: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createResearch, getColleges }
)(AddResearchScreen);
