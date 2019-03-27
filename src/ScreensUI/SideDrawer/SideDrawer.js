import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  NetInfo
} from "react-native";
import dpimage from "../../Pictures/default.jpg";
import Icon from "react-native-vector-icons/FontAwesome5";
import { logoutUser } from "../../store/actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import startDashboardScreen from "./dashboardPage";
import startCollegeListScreen from "./collegePage";
import startResearchScreen from "./researchPage";
import startJournalListScreen from "./journalPage";
import startOfflineResearchScreen from "./offlineResearchPage";

class SideDrawerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      selectedTab: false
    };
  }
  dashboardLand = () => {
    startDashboardScreen();
  };

  collegeLand = () => {
    startCollegeListScreen();
  };

  researchLand = () => {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type === "none") {
        startOfflineResearchScreen();
      } else {
        startResearchScreen();
      }
    });
  };

  journalLand = () => {
    startJournalListScreen();
  };

  logoutHandler = () => {
    this.props.logoutUser();
  };

  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.container,
            {
              width: Dimensions.get("window").width * 0.6,
              minHeight: "100%"
            }
          ]}
        >
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>
              BSU
            </Text>
            <View
              style={[
                styles.hairline,
                { width: Dimensions.get("window").width * 0.4 }
              ]}
            />
            <Image
              source={{ uri: "http://34.229.6.94/images/User.png" }}
              style={{ width: 80, height: 80, borderRadius: 100 }}
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "400",
                marginTop: 10
              }}
            >
              {this.props.auth.user.firstName}
            </Text>
            <View
              style={[
                styles.hairline,
                { width: Dimensions.get("window").width * 0.4 }
              ]}
            />
          </View>

          <TouchableOpacity onPress={this.dashboardLand}>
            <View
              style={[
                styles.button,
                { width: Dimensions.get("window").width * 0.3 }
              ]}
            >
              <Icon name="chart-line" size={15} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "400",
                  marginLeft: 10,
                  fontSize: 16
                }}
              >
                Dashboard
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.collegeLand}>
            <View
              style={[
                styles.button,
                { width: Dimensions.get("window").width * 0.3 }
              ]}
            >
              <Icon name="graduation-cap" size={15} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "400",
                  marginLeft: 10,
                  fontSize: 16
                }}
              >
                Colleges
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.researchLand}>
            <View
              style={[
                styles.button,
                { width: Dimensions.get("window").width * 0.3 }
              ]}
            >
              <Icon name="book" size={15} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "400",
                  marginLeft: 10,
                  fontSize: 16
                }}
              >
                Researches
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.journalLand}>
            <View
              style={[
                styles.button,
                { width: Dimensions.get("window").width * 0.3 }
              ]}
            >
              <Icon name="journal-whills" size={15} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "400",
                  fontSize: 16,
                  marginLeft: 10
                }}
              >
                Journals
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View
              style={[
                styles.button,
                { width: Dimensions.get("window").width * 0.3 }
              ]}
            >
              <Icon name="search" size={15} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "400",
                  fontSize: 16,
                  marginLeft: 10
                }}
              >
                Check Plagiarism
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.logoutHandler}>
            <View
              style={[
                styles.button,
                { width: Dimensions.get("window").width * 0.3 }
              ]}
            >
              <Text style={{ color: "#fff", fontWeight: "400", fontSize: 16 }}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#212529",
    flex: 1,
    alignItems: "center"
  },

  hairline: {
    backgroundColor: "#fff",
    height: 1.5,
    margin: 20
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
    borderColor: "#007bff",
    flexDirection: "row"
  }
});

SideDrawerScreen.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(SideDrawerScreen);
