import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  KeyboardAvoidingView,
  Picker,
  ScrollView,
  Alert
} from "react-native";

import CNRichTextEditor, {
  CNToolbar,
  getInitialObject,
  getDefaultStyles,
  convertToHtmlString
} from "react-native-cn-richtext-editor";

import InputComponent from "../../../../Components/Input/InputComponent";
import ButtonComponent from "../../../../Components/Button/ButtonComponent";
import RadioGroup from "react-native-radio-buttons-group";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { getColleges } from "../../../../store/actions/collegeAction";
import { createResearch } from "../../../../store/actions/researchActions";

import { connect } from "react-redux";
import PropTypes from "prop-types";
const defaultStyles = getDefaultStyles();

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
      schoolyear: "",
      pages: "",
      submitCtr: 0,
      selectedTag: "body",
      selectedStyles: [],
      value: [getInitialObject()],
      disabledButton: false
    };

    this.state.value = [getInitialObject()];
    this.editor = null;
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
      nextProps.errors.abstract === undefined &&
      nextProps.errors.pages === undefined &&
      this.state.submitCtr === 1
    ) {
      this.setState({
        submitCtr: 0,
        disabledButton: false
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

  submitHandler = () => {
    const { title, college, course, abstract, pages, schoolyear } = this.state;
    let convertedData = convertToHtmlString(this.state.value);

    if (
      title === "" ||
      college === "" ||
      course === "" ||
      pages === "" ||
      schoolyear === ""
    ) {
      alert("Fill up all the fields!");
    } else {
      const researchData = {
        title: this.state.title,
        type: this.state.type,
        college: this.state.college,
        course: this.state.course,
        abstract: convertedData,
        schoolYear: this.state.schoolyear,
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
    this.setState({
      value: value
    });
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
      const activeCollege = colleges.filter(college => {
        return college.deleted === 0;
      });

      activeCollege.map(college =>
        dropCollegeOptions.push({
          label: college.name.fullName,
          value: college.name.fullName
        })
      );

      activeCollege.map(college =>
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
              onChangeText={val => this.setState({ title: val })}
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
                      value={this.state.value}
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
              placeholder="* School Year"
              onChangeText={val => this.setState({ schoolyear: val })}
              value={this.state.schoolyear}
              icon="ios-cog"
            />

            <InputComponent
              placeholder="* Pages"
              onChangeText={val => this.setState({ pages: val })}
              value={this.state.pages}
              icon="ios-cog"
            />

            <ButtonComponent
              onPress={this.submitHandler}
              disabledButton={this.state.disabledButton}
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

/*

            <View style={styles.main}>
              <CNRichTextEditor
                ref={input => (this.editor = input)}
                onSelectedTagChanged={this.onSelectedTagChanged}
                onSelectedStyleChanged={this.onSelectedStyleChanged}
                value={this.state.value}
                onValueChanged={this.onValueChanged}
                style={{ backgroundColor: "#fff", padding: 10 }}
              />
            </View>

            <View
              style={{
                minHeight: 35
              }}
            >
              <CNToolbar
                size={28}
                bold={<MaterialCommunityIcons name="format-bold" />}
                italic={<MaterialCommunityIcons name="format-italic" />}
                underline={<MaterialCommunityIcons name="format-underline" />}
                lineThrough={
                  <MaterialCommunityIcons name="format-strikethrough-variant" />
                }
                body={<MaterialCommunityIcons name="format-text" />}
                title={<MaterialCommunityIcons name="format-header-1" />}
                heading={<MaterialCommunityIcons name="format-header-3" />}
                ul={<MaterialCommunityIcons name="format-list-bulleted" />}
                ol={<MaterialCommunityIcons name="format-list-numbers" />}
                selectedTag={this.state.selectedTag}
                selectedStyles={this.state.selectedStyles}
                onStyleKeyPress={this.onStyleKeyPress}
              />
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




                           <RichTextEditor
                ref={r => (this.richtext = r)}
                contentPlaceholder={"*Abstract"}
                hiddenTitle={true}
                initialContentHTML={""}
                editorInitializedCallback={() => this.onEditorInitialized()}
              />
              <RichTextToolbar
                getEditor={() => this.richtext}
                actions={[
                  actions.setBold,
                  actions.setUnderline,
                  actions.setItalic,
                  actions.insertBulletsList,
                  actions.insertOrderedList
                ]}
                selectedButtonStyle={{ backgroundColor: "#06c" }}
              /> 

*/
