import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import { connect } from "react-redux";
import PropTypes from "prop-types";
//import { getColleges } from "../../store/actions/collegeAction";

class HomeScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "sideDrawerToggle") {
        this.props.navigator.toggleDrawer({
          side: "left"
        });
      }
    }
  };

  pushCollegeListScreen = () => {
    this.props.navigator.push({
      screen: "Client.CollegeListScreen",
      title: "List of Colleges"
      // passProps: {
      //   collegeInfo: collegeData
      // }
    });
  };

  pushResearchesListScreen = () => {
    this.props.navigator.push({
      screen: "Client.ResearchesListScreen",
      title: "List of Researches"
    });
  };

  render() {
    // const { colleges, loading } = this.props.college;
    // let collegeItems;

    // if (colleges === null || loading) {
    //   collegeItems = (
    //     <View
    //       style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    //     >
    //       <ActivityIndicator />
    //     </View>
    //   );
    // } else {
    //   collegeItems = <View />;
    // }

    return (
      <View style={styles.container}>
        <ScrollView
          width="100%"
          contentContainerStyle={{ alignItems: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.buttonContainer}>
            <Card title="Colleges" titleStyle={{ color: "#000" }}>
              <View style={{ alignItems: "center" }}>
                <Icon name="ios-school" size={80} />
                <TouchableOpacity onPress={() => this.pushCollegeListScreen()}>
                  <View style={styles.buttonStyle}>
                    <Text style={{ color: "white" }}>View Colleges</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Card>
          </View>

          <View style={styles.buttonContainer}>
            <Card title="Researches" titleStyle={{ color: "#000" }}>
              <View style={{ alignItems: "center" }}>
                <FontAwesomeIcon name="book" size={80} />
                <TouchableOpacity
                  onPress={() => this.pushResearchesListScreen()}
                >
                  <View style={styles.buttonStyle}>
                    <Text style={{ color: "white" }}>View Researches</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Card>
          </View>

          <View style={[styles.buttonContainer, { paddingBottom: 10 }]}>
            <Card title="Journals" titleStyle={{ color: "#000" }}>
              <View style={{ alignItems: "center" }}>
                <FontAwesome5Icon name="newspaper" size={80} />
                <TouchableOpacity onPress={() => this.pushCollegeListScreen()}>
                  <View style={styles.buttonStyle}>
                    <Text style={{ color: "white" }}>View Journals</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%"
  },
  buttonContainer: {
    width: "90%"
  },
  buttonStyle: {
    height: 30,
    minWidth: 180,
    backgroundColor: "#17a2b8",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  }
});

HomeScreen.propTypes = {
  //getColleges: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    college: state.college
  };
};

export default connect(mapStateToProps)(HomeScreen);
