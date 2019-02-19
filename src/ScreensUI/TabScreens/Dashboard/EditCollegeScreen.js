import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Button, Alert } from "react-native";
import { ColorPicker, fromHsv } from "react-native-color-picker";

import InputComponent from "../../../Components/Input/InputComponent";
import ButtonComponent from "../../../Components/Button/ButtonComponent";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  createCollege,
  getColleges
} from "../../../store/actions/collegeAction";

class EditCollegeScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      fullName: this.props.collegeData.name.fullName,
      initials: this.props.collegeData.name.initials,
      logo: this.props.collegeData.logo,
      librarian: this.props.collegeData.librarian,
      selectedFile: "",
      background: this.props.collegeData.color,
      researchTotal: this.props.collegeData.researchTotal,
      journalTotal: this.props.collegeData.journalTotal,
      errors: {}
    };

    this.pickColorHandler = this.pickColorHandler.bind(this);
  }
  changedFullNameHandler = fullName => {
    this.setState({ fullName });
  };

  changedInitialsHandler = initials => {
    this.setState({ initials });
  };

  changedLibrarianHandler = librarian => {
    this.setState({ librarian });
  };

  pickColorHandler = color => {
    let convertedColor = fromHsv({
      h: color.h,
      s: color.s,
      v: color.v
    });

    this.setState({ background: convertedColor });
  };

  submitHandler = () => {
    const { fullName, initials, librarian } = this.state;
    if (fullName === "" || initials === "" || librarian === "") {
      Alert.alert("Warning", "Fill up the fields!");
    } else {
      const collegeData = {
        oldName: this.props.collegeData.name.fullName,
        oldInitials: this.props.collegeData.name.initials,
        fullName: this.state.fullName,
        initials: this.state.initials,
        logo: this.state.logo,
        ext: "",
        librarian: this.state.librarian,
        file: this.state.selectedFile,
        color: this.state.background,
        researchTotal: this.state.researchTotal,
        journalTotal: this.state.journalTotal,
        id: this.props.collegeData._id
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
              this.props.createCollege(collegeData);
              this.props.navigator.pop();
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "red" }}>
          * = Required Fields
        </Text>

        <InputComponent
          placeholder="* College Name"
          onChangeText={this.changedFullNameHandler}
          value={this.state.fullName}
          icon="ios-cog"
        />

        <InputComponent
          placeholder="* College Initials"
          onChangeText={this.changedInitialsHandler}
          value={this.state.initials}
          icon="ios-cog"
        />

        <InputComponent
          placeholder="* Librarian"
          onChangeText={this.changedLibrarianHandler}
          value={this.state.librarian}
          icon="ios-person"
        />

        <View
          style={{
            width: "100%",
            height: 150,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <ColorPicker
            onColorChange={color => this.pickColorHandler(color)}
            color={this.state.background}
            style={{ flex: 1, height: 150, width: 150 }}
          />
        </View>
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
  imageStyle: {
    width: 120,
    height: 120,
    borderRadius: 100
  }
});

EditCollegeScreen.propTypes = {
  getColleges: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college
});

export default connect(
  mapStateToProps,
  { createCollege, getColleges }
)(EditCollegeScreen);
