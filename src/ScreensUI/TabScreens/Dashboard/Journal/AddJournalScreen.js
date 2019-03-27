import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Picker,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { getColleges } from "../../../../store/actions/collegeAction";
import { createJournal } from "../../../../store/actions/journalAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import InputText from "../../../../Components/Input/InputComponent";
import Spinner from "../../../../Components/Spinner/Spinner";

class AddJournalScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      publisher: "",
      volume: "",
      college: "",
      course: "",
      description: "",
      issn: "",
      authorOne: "",
      pages: "",
      yearPublished: "",
      disabledButton: false,
      submitCtr: 0
    };
  }

  componentWillMount() {
    if (!this.props.college.loading) {
      this.props.getColleges();
    }

    if (this.props.editCtr) {
      const regex = /(<([^>]+)>)/gi;
      let convertedDescription = this.props.journalData.description.replace(
        regex,
        ""
      );

      this.setState({
        title: this.props.journalData.title,
        publisher: this.props.journalData.publisher,
        volume: this.props.journalData.volume,
        college: this.props.journalData.college,
        course: this.props.journalData.course,
        description: convertedDescription,
        pages: this.props.journalData.pages,
        issn: this.props.journalData.issn,
        authorOne: this.props.journalData.authorOne,
        yearPublished: this.props.journalData.yearPublished
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errors.title === "Journal title is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Journal title is required!");
      this.setState({
        submitCtr: 0
      });
    } else if (
      nextProps.errors.title === "Journal Title already exists" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Journal Title already exists!");
      this.setState({
        submitCtr: 0
      });
    } else if (
      nextProps.errors.volume === "Journal volume is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Journal volume is required!");
      this.setState({
        submitCtr: 0
      });
    } else if (
      nextProps.errors.publisher === "Journal publisher is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Journal publisher is required!");
      this.setState({
        submitCtr: 0
      });
    } else if (
      nextProps.errors.issn === "ISSN is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "ISSN is required!");
      this.setState({
        submitCtr: 0
      });
    } else if (
      nextProps.errors.pages === "Journal pages is invalid" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Journal pages is invalid!");
      this.setState({
        submitCtr: 0
      });
    } else if (
      nextProps.errors.yearPublished === "Year published is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Year published is required!");
      this.setState({
        submitCtr: 0
      });
    } else if (
      nextProps.errors.authorOne === "Author One is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "Author One is required!");
      this.setState({
        submitCtr: 0
      });
    }

    if (
      nextProps.errors.title === undefined &&
      nextProps.errors.volume === undefined &&
      nextProps.errors.publisher === undefined &&
      nextProps.errors.issn === undefined &&
      nextProps.errors.pages === undefined &&
      nextProps.errors.yearPublished === undefined &&
      nextProps.errors.authorOne === undefined &&
      this.state.submitCtr === 1
    ) {
      this.setState({
        submitCtr: 0
      });
      this.props.navigator.pop();
    }
  }

  collegePickerHandler = item => {
    this.setState({ college: item });
  };

  submitHandler = () => {
    const {
      title,
      publisher,
      volume,
      college,
      course,
      description,
      issn,
      authorOne,
      pages,
      yearPublished
    } = this.state;

    if (
      title === "" ||
      publisher === "" ||
      volume === "" ||
      college === "" ||
      course === "" ||
      issn === "" ||
      authorOne === "" ||
      pages === "" ||
      yearPublished === ""
    ) {
      alert("Fill up all the fields!");
    } else {
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      let journalData = {};
      if (this.props.editCtr) {
        journalData = {
          title: this.state.title,
          oldTitle: this.props.journalData.title,
          volume: this.state.volume,
          publisher: this.state.publisher,
          college: this.state.college,
          course: this.state.course,
          description:
            this.state.description.trim() === ""
              ? ""
              : this.state.description.trim(),
          issn: this.state.issn,
          yearPublished: this.state.yearPublished,
          pages: this.state.pages,
          authorOne: this.state.authorOne,
          id: this.props.journalData._id,
          username: name
        };
      } else {
        journalData = {
          title: this.state.title,
          volume: this.state.volume,
          publisher: this.state.publisher,
          college: this.state.college,
          course: this.state.course,
          description:
            this.state.description.trim() === ""
              ? ""
              : this.state.description.trim(),
          issn: this.state.issn,
          yearPublished: this.state.yearPublished,
          pages: this.state.pages,
          authorOne: this.state.authorOne,
          username: name
        };
      }

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
              this.props.createJournal(journalData);
              this.setState({ submitCtr: 1 });
            }
          }
        ],
        { cancelable: false }
      );
    }
  };
  render() {
    const { colleges, loading, changeStatus } = this.props.college;
    let journalLayout;
    let dropCollegeOptions = [{ label: "* Select College", value: "" }];
    let dropCourseOptions = [{ label: "* Select Course", value: "" }];

    if ((colleges === null && loading) || changeStatus) {
      journalLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          import Spinner from "../../../../Components/Spinner/Spinner";
          <Spinner />
        </View>
      );
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

      journalLayout = (
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
              <InputText
                placeholder="* Journal Title"
                onChangeText={val => this.setState({ title: val })}
                value={this.state.title}
              />

              <View style={styles.pickerStyle}>
                <Picker
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
                  placeholder="* Description"
                  underlineColorAndroid="transparent"
                  placeholderTextColor="grey"
                  numberOfLines={5}
                  multiline={true}
                  onChangeText={val => this.setState({ description: val })}
                  value={this.state.description}
                  style={{
                    justifyContent: "flex-start",
                    maxHeight: 300,
                    textAlignVertical: "top"
                  }}
                />
              </View>
              <InputText
                placeholder="* Volume"
                onChangeText={val => this.setState({ volume: val })}
                value={this.state.volume}
              />

              <InputText
                placeholder="* Author"
                onChangeText={val => this.setState({ authorOne: val })}
                value={this.state.authorOne}
              />

              <InputText
                placeholder="* Publisher"
                onChangeText={val => this.setState({ publisher: val })}
                value={this.state.publisher}
              />

              <InputText
                placeholder="* ISSN"
                onChangeText={val => this.setState({ issn: val })}
                value={this.state.issn}
              />

              <InputText
                placeholder="* Pages"
                onChangeText={val => this.setState({ pages: val })}
                value={this.state.pages}
              />

              <InputText
                placeholder="* Published Year"
                onChangeText={val => this.setState({ yearPublished: val })}
                value={this.state.yearPublished}
              />

              <TouchableOpacity
                onPress={this.submitHandler}
                disabledButton={this.state.disabledButton}
                style={{ width: "40%" }}
              >
                <View style={[styles.button]}>
                  <Text style={{ color: "white" }}>Submit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      );
    }

    return <View style={styles.container}>{journalLayout}</View>;
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

AddJournalScreen.propTypes = {
  getColleges: PropTypes.func.isRequired,
  createJournal: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getColleges, createJournal }
)(AddJournalScreen);
