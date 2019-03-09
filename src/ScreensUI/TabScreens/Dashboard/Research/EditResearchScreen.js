import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  KeyboardAvoidingView,
  Picker,
  TextInput,
  ScrollView,
  Alert
} from "react-native";

import CNRichTextEditor, {
  CNToolbar,
  getInitialObject,
  getDefaultStyles,
  convertToHtmlString,
  convertToObject
} from "react-native-cn-richtext-editor";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getColleges } from "../../../../store/actions/collegeAction";
import { getResearches } from "../../../../store/actions/researchActions";
import InputComponent from "../../../../Components/Input/InputComponent";
import ButtonComponent from "../../../../Components/Button/ButtonComponent";
import RadioGroup from "react-native-radio-buttons-group";
const defaultStyles = getDefaultStyles();

class EditResearchScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };
  constructor(props) {
    super(props);

    const selResearch = this.props.research.researches.find(research => {
      return research._id === this.props.researchId;
    });

    this.state = {
      title: "",
      type: "Thesis",
      college: "",
      course: "",
      abstract: "",
      pages: "",
      submitCtr: 0,
      selectedTag: "body",
      selectedStyles: [],
      value: [getInitialObject()],
      testValue: selResearch.abstract
    };
    this.state.value = [getInitialObject()];
    this.editor = null;
  }

  componentWIllMount() {
    if (!this.props.college.loading) {
      this.props.getColleges();
    }
  }

  componentWillMount() {
    this.props.getResearches();
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

  onStyleKeyPress = toolType => {
    this.editor.applyToolbar(toolType);
  };

  onSelectedTagChanged = tag => {
    this.setState({
      selectedTag: tag
    });
  };

  onSelectedStyleChanged = styles => {
    this.setState({
      selectedStyles: styles
    });
  };

  onValueChanged = value => {
    try {
      this.setState({
        value: value
      });
    } catch (e) {
      alert(JSON.stringify(e));
    }
  };

  render() {
    alert(JSON.stringify(this.state.testValue));
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
          <Text>{this.state.datasss}</Text>
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

            <View
              style={{
                width: "80%",
                minHeight: 200,
                borderColor: "#000",
                borderWidth: 1
              }}
            >
              <KeyboardAvoidingView
                behavior="padding"
                enabled
                keyboardVerticalOffset={0}
                style={{
                  flex: 1,
                  backgroundColor: "#eee",
                  flexDirection: "column",
                  justifyContent: "flex-end"
                }}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.main}>
                    <CNRichTextEditor
                      ref={input => (this.editor = input)}
                      onSelectedTagChanged={this.onSelectedTagChanged}
                      onSelectedStyleChanged={this.onSelectedStyleChanged}
                      value={this.state.testValue}
                      style={{ backgroundColor: "#fff" }}
                      styleList={defaultStyles}
                      onValueChanged={this.onValueChanged}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <View
                  style={{
                    minHeight: 35
                  }}
                >
                  <CNToolbar
                    size={28}
                    bold={
                      <Text style={[styles.toolbarButton, styles.boldButton]}>
                        B
                      </Text>
                    }
                    italic={
                      <Text style={[styles.toolbarButton, styles.italicButton]}>
                        I
                      </Text>
                    }
                    underline={
                      <Text
                        style={[styles.toolbarButton, styles.underlineButton]}
                      >
                        U
                      </Text>
                    }
                    lineThrough={
                      <Text
                        style={[styles.toolbarButton, styles.lineThroughButton]}
                      >
                        S
                      </Text>
                    }
                    body={<Text style={styles.toolbarButton}>T</Text>}
                    title={<Text style={styles.toolbarButton}>h1</Text>}
                    heading={<Text style={styles.toolbarButton}>h3</Text>}
                    ul={<Text style={styles.toolbarButton}>ul</Text>}
                    ol={<Text style={styles.toolbarButton}>ol</Text>}
                    selectedTag={this.state.selectedTag}
                    selectedStyles={this.state.selectedStyles}
                    onStyleKeyPress={this.onStyleKeyPress}
                  />
                </View>
              </KeyboardAvoidingView>
            </View>

            <InputComponent
              placeholder="* Pages"
              onChangeText={this.changedPagesHandler}
              value={this.state.pages}
              icon="ios-cog"
            />

            <ButtonComponent
            // onPress={this.submitHandler}
            >
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
  },
  main: {
    flex: 1,
    alignItems: "stretch"
  },
  toolbarButton: {
    fontSize: 20,
    width: 28,
    height: 28,
    textAlign: "center"
  },
  italicButton: {
    fontStyle: "italic"
  },
  boldButton: {
    fontWeight: "bold"
  },
  underlineButton: {
    textDecorationLine: "underline"
  },
  lineThroughButton: {
    textDecorationLine: "line-through"
  }
});

EditResearchScreen.propTypes = {
  getColleges: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  research: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  research: state.research
});

export default connect(
  mapStateToProps,
  { getColleges, getResearches }
)(EditResearchScreen);
