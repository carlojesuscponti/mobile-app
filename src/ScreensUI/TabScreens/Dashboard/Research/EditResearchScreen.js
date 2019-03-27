import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Picker,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import Spinner from "../../../../Components/Spinner/Spinner";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getColleges } from "../../../../store/actions/collegeAction";
import { getResearches } from "../../../../store/actions/researchActions";
import ButtonComponent from "../../../../Components/Button/ButtonComponent";
import InputText from "../../../../Components/Input/InputText";
import Icon from "react-native-vector-icons/Ionicons";
import { createResearch } from "../../../../store/actions/researchActions";

class EditResearchScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      oldTitle: "",
      type: "thesis",
      college: "",
      course: "",
      abstract: "",
      schoolYear: "",
      pages: "",
      researchId: "",
      authorOne: "",
      submitCtr: 0
    };
  }

  componentWillMount() {
    if (!this.props.college.loading) {
      this.props.getColleges();
    }
  }

  componentDidMount() {
    if (!this.props.college.loading) {
      this.props.getColleges();
      const selResearch = this.props.research.researches.find(research => {
        return research._id === this.props.researchId;
      });

      const regex = /(<([^>]+)>)/gi;
      let result = selResearch.abstract.replace(regex, " ");

      let getAuthorOne = "";
      selResearch.author.map(au => {
        if (au.role === "Author One") {
          getAuthorOne = au.name;
        }
      });

      this.setState({
        id: selResearch._id,
        type: selResearch.type,
        title: selResearch.title,
        oldTitle: selResearch.title,
        type: selResearch.type,
        college: selResearch.college,
        course: selResearch.course,
        abstract: result,
        authorOne: getAuthorOne,
        schoolYear: selResearch.schoolYear,
        pages: selResearch.pages,
        researchId: selResearch.researchID
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

  submitHandler = () => {
    const {
      title,
      oldTitle,
      college,
      course,
      abstract,
      pages,
      schoolYear,
      researchId,
      authorOne,
      type,
      id
    } = this.state;

    if (
      title === "" ||
      college === "" ||
      course === "" ||
      pages === "" ||
      abstract === "" ||
      schoolYear === "" ||
      researchId === "" ||
      authorOne === ""
    ) {
      alert("Fill up all the fields!");
    } else {
      let convert = `<p>${abstract}</p>`;
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      const researchData = {
        title: this.state.title,
        oldTitle: this.state.oldTitle,
        type: this.state.type,
        college: this.state.college,
        course: this.state.course,
        abstract: convert,
        pages: this.state.pages,
        researchId: this.state.researchId,
        schoolYear: this.state.schoolYear,
        authorOne: this.state.authorOne,
        id: id,
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
    let dropCollegeOptions = [{ label: "* Select College", value: "" }];
    let dropCourseOptions = [{ label: "* Select Course", value: "" }];
    let researchLayout = <View />;

    if (colleges === null || loading) {
      researchLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
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

      researchLayout = (
        <ScrollView
          showsVerticalScrollIndicator={false}
          width="100%"
          display="flex"
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "red" }}>
              * = Required Fields
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.state.type === "thesis" ? (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10
                  }}
                >
                  <Icon name="md-radio-button-on" size={30} color="black" />
                  <Text style={{ paddingLeft: 10 }}>Thesis</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10
                  }}
                  onPress={() => this.setState({ type: "thesis" })}
                >
                  <Icon name="md-radio-button-off" size={30} color="black" />
                  <Text style={{ paddingLeft: 10 }}>Thesis</Text>
                </TouchableOpacity>
              )}

              {this.state.type === "undergrad" ? (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Icon name="md-radio-button-on" size={30} color="black" />
                  <Text style={{ paddingLeft: 10 }}>Undergrad Research</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => this.setState({ type: "undergrad" })}
                >
                  <Icon name="md-radio-button-off" size={30} color="black" />
                  <Text style={{ paddingLeft: 10 }}>Undergrad Research</Text>
                </TouchableOpacity>
              )}
            </View>

            <InputText
              placeholder="* Research Title"
              onChangeText={val => this.setState({ title: val })}
              value={this.state.title}
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

            <View style={styles.textInputContainer}>
              <TextInput
                placeholder="* Abstract"
                underlineColorAndroid="transparent"
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                onChangeText={val => this.setState({ abstract: val })}
                value={this.state.abstract}
                style={{ justifyContent: "flex-start", fontSize: 16 }}
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
              onChangeText={val => this.setState({ schoolYear: val })}
              value={this.state.schoolYear}
            />

            <TouchableOpacity
              onPress={this.submitHandler}
              style={{ width: "50%" }}
            >
              <View style={styles.button}>
                <Text style={{ color: "white" }}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return <View style={styles.container}>{researchLayout}</View>;
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
  textInputContainer: {
    width: "80%",
    maxHeight: 200,
    borderColor: "#000",
    borderWidth: 1
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "#007bff"
  }
});

EditResearchScreen.propTypes = {
  getColleges: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  createResearch: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  research: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  research: state.research,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getColleges, getResearches, createResearch }
)(EditResearchScreen);
