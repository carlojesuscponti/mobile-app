import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage,
  TextInput,
  ScrollView
} from "react-native";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../store/actions/authActions";
import bulsu_logo from "../../Pictures/bulsu_red_logo.png";
import privateTabScreen from "../startPrivateScreen";
import InputComponent from "../../Components/Input/InputComponent";
import ButtonComponent from "../../Components/Button/ButtonComponent";
import TextComponent from "../../Components/Text/TextButton";
import TextHeadingComponent from "../../Components/Text/TextHeading";

class AuthScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      disableButton: true,
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      privateTabScreen();
    }
  }
  componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      privateTabScreen();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      privateTabScreen();
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  changedUsernameHandler = text => {
    this.setState(() => {
      return {
        username: text
      };
    });
  };

  changedPasswordHandler = text => {
    this.setState(() => {
      return {
        password: text
      };
    });
  };

  // pushScreenHandler = () => {
  //   this.props.navigator.push({
  //     screen: "Client.RegisterScreenOne",
  //     title: "Register"
  //   });
  // };

  loginHandler = () => {
    if (this.state.username === "" && this.state.password === "") {
      alert("Fill all the fields!");
    } else {
      const userData = {
        username: this.state.username,
        password: this.state.password
      };

      this.props.loginUser(userData);
    }
  };

  render() {
    const { username, password } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <TextHeadingComponent>BulSU Plagiarism Checker</TextHeadingComponent>
          <Image source={bulsu_logo} style={styles.bulsuLogoStyle} />
        </View>

        <InputComponent
          placeholder="Username"
          onChangeText={this.changedUsernameHandler}
          value={this.state.username}
          icon="ios-person"
        />

        <InputComponent
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={this.changedPasswordHandler}
          value={this.state.password}
          icon="ios-lock"
        />

        <ButtonComponent onPress={this.loginHandler}>Sign In</ButtonComponent>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff"
  },

  bulsuLogoStyle: {
    width: 150,
    height: 150
  },
  textInputStyle: {
    width: "80%",
    height: "8%",
    backgroundColor: "#eee",
    borderRadius: 50,
    margin: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  labelContainer: {
    marginTop: "10%",
    alignItems: "center"
  }
});

AuthScreen.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(AuthScreen);

/*
        <TextComponent onPress={this.pushScreenHandler}>
          Create Account?
        </TextComponent>
*/
