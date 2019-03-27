import React, { Component } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addAuthor } from "../../../../store/actions/researchActions";
import InputComponent from "../../../../Components/Input/InputComponent";
import ButtonComponent from "../../../../Components/Button/ButtonComponent";

class AddAuthorScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      submitCtr: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.errors.name === "Author Name is required" &&
      this.state.submitCtr === 1
    ) {
      this.setState({
        submitCtr: 0
      });
      Alert.alert("Warning", "Author Name is required!");
    }

    if (nextProps.errors.name === undefined && this.state.submitCtr === 1) {
      this.setState({
        submitCtr: 0
      });
      this.props.navigator.pop();
    }
  }

  changedNameHandler = name => {
    this.setState({ name });
  };

  submitHandler = () => {
    const { name } = this.state;
    if (name === "") {
      Alert.alert("Warning", "Fill up the fields!");
    } else {
      const uname =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      const authorData = {
        name: name,
        researchId: this.props.researchId,
        username: uname
      };

      Alert.alert(
        "Message",
        "Do you want to save?",
        [
          {
            text: "NO",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "YES",
            onPress: () => {
              this.props.addAuthor(authorData);
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
    return (
      <View style={styles.container}>
        <Text>Add Author to {this.props.researchData.title}</Text>
        <Text style={styles.textStyle}>* = Required Fields</Text>
        <InputComponent
          placeholder="* Name"
          icon="ios-cog"
          value={this.state.name}
          onChangeText={this.changedNameHandler}
        />

        <View style={styles.buttonComponentStyle}>
          <TouchableOpacity onPress={this.submitHandler}>
            <View style={styles.button}>
              <Text style={{ color: "white" }}>Submit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  textStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red"
  },
  buttonComponentStyle: {
    marginTop: 15,
    marginLeft: 15,
    width: "40%"
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "#007bff"
  }
});

AddAuthorScreen.propTypes = {
  errors: PropTypes.object.isRequired,
  addAuthor: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  research: state.research,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addAuthor }
)(AddAuthorScreen);
