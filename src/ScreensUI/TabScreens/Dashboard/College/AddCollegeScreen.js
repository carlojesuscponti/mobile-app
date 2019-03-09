import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Alert,
  AsyncStorage
} from "react-native";
import { ColorPicker, fromHsv } from "react-native-color-picker";

import InputComponent from "../../../../Components/Input/InputComponent";
import ButtonComponent from "../../../../Components/Button/ButtonComponent";
import ImagePicker from "react-native-image-picker";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createCollege } from "../../../../store/actions/collegeAction";

class AddCollegeScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      initials: "",
      logo: "",
      librarian: "",
      selectedFile: "",
      background: "#ff0000",
      imageData: null,
      errors: {},
      submitCtr: 0
    };
    this.pickColorHandler = this.pickColorHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errors.fullName === "College Name already exists" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "College Name already exists!");
      this.setState({
        submitCtr: 0
      });
    }

    if (
      nextProps.errors.fullName === "College Name is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "College Name is required!");
      this.setState({
        submitCtr: 0
      });
    }

    if (
      nextProps.errors.initials === "College Initials already exists" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "College Initials already exists!");
      this.setState({
        submitCtr: 0
      });
    }

    if (
      nextProps.errors.initials === "College Initials is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "College Initials is required!");
      this.setState({
        submitCtr: 0
      });
    }

    if (
      nextProps.errors.librarian === "College librarian is required" &&
      this.state.submitCtr === 1
    ) {
      Alert.alert("Warning", "College librarian is required!");
      this.setState({
        submitCtr: 0
      });
    }

    if (
      nextProps.errors.fullName === undefined &&
      nextProps.errors.initials === undefined &&
      nextProps.errors.librarian === undefined &&
      this.state.submitCtr === 1
    ) {
      this.setState({
        submitCtr: 0
      });
      this.props.navigator.pop();
    }
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

  submitHandler = () => {
    const { fullName, initials, logo, librarian } = this.state;
    if (fullName === "" || initials === "" || logo === "" || librarian === "") {
      Alert.alert("Warning", "Fill up the fields!");
    } else {
      const logo = this.state.logo;
      const logoname = logo.replace(/^.*\\/, "");

      const collegeData = {
        fullName: this.state.fullName,
        initials: this.state.initials,
        logo:
          logoname
            .split(".")
            .slice(0, -1)
            .join(".") + Date.now(),
        ext: logoname.split(".").pop(),
        librarian: this.state.librarian,
        file: this.state.selectedFile,
        color: this.state.background
      };

      Alert.alert(
        "Message",
        "Are you sure you want to save?",
        [
          {
            text: "NO",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "YES",

            onPress: () => {
              this.props.createCollege(collegeData);
              //this.props.navigator.pop();
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

  pickColorHandler = color => {
    let convertedColor = fromHsv({
      h: color.h,
      s: color.s,
      v: color.v
    });

    this.setState({ background: convertedColor });
  };

  pickImageHandler = () => {
    try {
      ImagePicker.launchImageLibrary({ title: "Choose Image" }, response => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          let copyUri = "data:" + response.type + ";base64," + response.data;
          this.setState({
            logo: response.fileName,
            imageData: { uri: copyUri },
            selectedFile: copyUri
          });
        }
      });
    } catch (err) {}
  };

  setStateHandler = () => {
    this.setState({
      submitCtr: 0
    });
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
            width: "80%",
            height: 150,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <View>
            <ColorPicker
              onColorChange={color => this.pickColorHandler(color)}
              color={this.state.background}
              style={{ flex: 1, height: 150, width: 150 }}
              hideSliders={true}
            />
          </View>

          <View>
            <Image source={this.state.imageData} style={styles.imageStyle} />
            <Button title="choose" onPress={this.pickImageHandler} />
          </View>
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

AddCollegeScreen.propTypes = {
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createCollege }
)(AddCollegeScreen);
