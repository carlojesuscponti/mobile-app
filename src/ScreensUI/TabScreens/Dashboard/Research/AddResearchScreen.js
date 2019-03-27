import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Picker,
  ScrollView,
  Alert,
  TextInput,
  WebView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";

import InputText from "../../../../Components/Input/InputText";
import ButtonComponent from "../../../../Components/Button/ButtonComponent";
import RadioGroup from "react-native-radio-buttons-group";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getColleges } from "../../../../store/actions/collegeAction";
import { createResearch } from "../../../../store/actions/researchActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../../../../Components/Spinner/Spinner";

class AddResearchScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: "thesis",
      college: "",
      course: "",
      abstract: "",
      schoolyear: "",
      pages: "",
      researchId: "",
      authorOne: "",
      submitCtr: 0,
      disabledButton: false,
      addCtr: 0
    };
  }

  componentWillMount() {
    if (!this.props.college.loading) {
      this.props.getColleges();
    }

    if (this.props.addResearchData !== undefined) {
      this.setState({
        college: this.props.addResearchData.collegeName,
        course: this.props.addResearchData.courseName,
        addCtr: 1
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errors.title === "Research Title already exists" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Research Title already exists!");
      this.setState({
        submitCtr: 0,
        disabledButton: false
      });
    }

    if (
      nextProps.errors.title === "Research title is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Research title is required!");
      this.setState({
        submitCtr: 0,
        disabledButton: false
      });
    }

    if (
      nextProps.errors.abstract ===
        "Abstract must be at least 100 characters" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Abstract must be at least 100 characters!");
      this.setState({
        submitCtr: 0,
        disabledButton: false
      });
    }

    if (
      nextProps.errors.abstract === "Research Title already exists" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Research Title already exists!");
      this.setState({
        submitCtr: 0,
        disabledButton: false
      });
    }

    if (
      nextProps.errors.authorOne === "Author One is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Author One is required!");
      this.setState({
        submitCtr: 0,
        disabledButton: false
      });
    }

    if (
      nextProps.errors.researchId === "Research ID is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Research ID is required!");
      this.setState({
        submitCtr: 0,
        disabledButton: false
      });
    }

    if (
      nextProps.errors.pages === "Research pages is invalid" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Research pages is invalid!");
      this.setState({
        submitCtr: 0,
        disabledButton: false
      });
    }

    if (
      nextProps.errors.schoolYear === "School year is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "School year is required!");
      this.setState({
        submitCtr: 0,
        disabledButton: false
      });
    }

    if (
      nextProps.errors.abstract === undefined &&
      nextProps.errors.authorOne === undefined &&
      nextProps.errors.researchId === undefined &&
      nextProps.errors.schoolYear === undefined &&
      nextProps.errors.pages === undefined &&
      nextProps.errors.title === undefined &&
      this.state.submitCtr === 1
    ) {
      this.setState({
        submitCtr: 0,
        disabledButton: false
      });
      this.props.navigator.pop();
    }
  }

  submitHandler = () => {
    const {
      title,
      college,
      course,
      abstract,
      pages,
      schoolyear,
      researchId,
      authorOne
    } = this.state;

    if (
      title === "" ||
      college === "" ||
      course === "" ||
      pages === "" ||
      abstract === "" ||
      schoolyear === "" ||
      researchId === "" ||
      authorOne === ""
    ) {
      alert("Fill up all the fields!");
    } else {
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      let converted = `<p>${this.state.abstract}</p>`;

      const researchData = {
        title: this.state.title,
        type: this.state.type,
        college: this.state.college,
        course: this.state.course,
        authorOne: this.state.authorOne,
        abstract: converted,
        researchId: this.state.researchId,
        schoolYear: this.state.schoolyear,
        pages: this.state.pages,
        username: name
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
              this.props.createResearch(researchData);
              this.setState({
                submitCtr: 1,
                disabledButton: true
              });
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  collegePickerHandler = item => {
    this.setState({ college: item });
  };

  radioGroupHandler = val => {
    const getValue = val.find(e => e.selected == true);
    this.setState({
      type: getValue.value
    });
  };

  render() {
    const { colleges, loading } = this.props.college;

    let radioCollegeOptions = [
      { label: "Thesis", value: "thesis" },
      { label: "Undergrad Research", value: "undergrad" }
    ];

    let dropCollegeOptions = [{ label: "* Select College", value: "" }];
    let dropCourseOptions = [{ label: "* Select Course", value: "" }];

    if (colleges === null || loading) {
    } else {
      if (this.props.addResearchData === undefined) {
        const activeCollege = colleges.filter(college => {
          return college.deleted === 0;
        });

        activeCollege.map(college =>
          dropCollegeOptions.push({
            label: college.name.fullName,
            value: college.name.fullName
          })
        );

        if (this.state.college !== "") {
          try {
            const chosenCollege = this.props.college.colleges.find(college => {
              return college.name.fullName === this.state.college;
            });

            chosenCollege.course.map(course => {
              if (course.deleted === 0) {
                dropCourseOptions.push({
                  label: course.name,
                  value: course.name
                });
              }
            });
          } catch (err) {}
        }
      } else {
        dropCollegeOptions.push({
          label: this.state.college,
          value: this.state.college
        });

        dropCourseOptions.push({
          label: this.state.course,
          value: this.state.course
        });
      }
    }
    let researchLayout;

    if (colleges === null || loading) {
      researchLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner />
        </View>
      );
    } else {
      researchLayout = (
        <ScrollView
          showsVerticalScrollIndicator={false}
          width="100%"
          display="flex"
        >
          <KeyboardAvoidingView
            behavior="padding"
            enabled
            keyboardVerticalOffset={0}
            style={{
              flex: 1,
              paddingTop: 20,
              flexDirection: "column",
              flex: 1,
              justifyContent: "flex-end"
            }}
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

              <InputText
                placeholder="* Research Title"
                onChangeText={val => this.setState({ title: val })}
                value={this.state.title}
              />

              <View style={styles.pickerStyle}>
                <Picker
                  enabled={this.state.addCtr === 0 ? true : false}
                  selectedValue={this.state.college}
                  onValueChange={itemValue =>
                    this.collegePickerHandler(itemValue)
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
                  enabled={this.state.addCtr === 0 ? true : false}
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

              <View style={styles.textInputContainer}>
                <TextInput
                  placeholder="* Abstract"
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                  numberOfLines={5}
                  multiline={true}
                  onChangeText={val => this.setState({ abstract: val })}
                  value={this.state.abstract}
                  style={{
                    justifyContent: "flex-start",
                    maxHeight: 300,
                    textAlignVertical: "top"
                  }}
                />
              </View>

              <InputText
                placeholder="* Author One"
                onChangeText={val => this.setState({ authorOne: val })}
                value={this.state.authorOne}
              />

              <InputText
                placeholder="* Research ID"
                onChangeText={val => this.setState({ researchId: val })}
                value={this.state.researchId}
              />

              <InputText
                placeholder="* Pages"
                onChangeText={val => this.setState({ pages: val })}
                value={this.state.pages}
              />

              <InputText
                placeholder="* Academic Year"
                onChangeText={val => this.setState({ schoolyear: val })}
                value={this.state.schoolyear}
              />

              <TouchableOpacity
                onPress={this.submitHandler}
                disabledButton={this.state.disabledButton}
              >
                <View style={[styles.button, { width: "40%" }]}>
                  <Text style={{ color: "white" }}>Submit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      );
    }

    return <View style={styles.container}>{researchLayout}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff"
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
  textInputContainer: {
    width: "80%",
    maxHeight: 200,
    borderColor: "#000",
    borderWidth: 1
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    marginLeft: 8,
    marginTop: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "#007bff"
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
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createResearch, getColleges }
)(AddResearchScreen);
