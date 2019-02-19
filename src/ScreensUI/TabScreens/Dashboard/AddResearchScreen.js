import React, { Component } from "react";
import { View, Text, StyleSheet, Picker, TextInput } from "react-native";

import InputComponent from "../../../Components/Input/InputComponent";
import ButtonComponent from "../../../Components/Button/ButtonComponent";
import RadioGroup from "react-native-radio-buttons-group";

import { getColleges } from "../../../store/actions/collegeAction";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class AddResearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: "Thesis",
      college: "",
      course: "",
      abstract: "",
      pages: ""
    };
  }

  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  componentWillMount() {
    if (!this.props.college.loading) {
      this.props.getColleges();
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
    const researchData = {
      title: this.state.title,
      type: this.state.type,
      college: this.state.college,
      course: this.state.course,
      abstract: this.state.abstract,
      pages: this.state.pages
    };

    alert(JSON.stringify(researchData));
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
            onValueChange={itemValue => this.setState({ college: itemValue })}
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
            onValueChange={itemValue => this.setState({ course: itemValue })}
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
            style={{ height: 100, textAlignVertical: "top" }}
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
        <ButtonComponent onPress={this.submitHandler}>Submit</ButtonComponent>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
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
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getColleges }
)(AddResearchScreen);
