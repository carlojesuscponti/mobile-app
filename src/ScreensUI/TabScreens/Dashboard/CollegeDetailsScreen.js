import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import Moment from "moment";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  changeCollegeLogo,
  getColleges,
  deleteCourse,
  deleteCollege
} from "../../../store/actions/collegeAction";

import ImagePicker from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import collegeLogo from "../../../Pictures/CollegeLogo/coed1549062829422.jpg";

import { Card, ButtonGroup } from "react-native-elements";

class CollegeDetailsScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    this.updateIndex = this.updateIndex.bind(this);
    this.state = {
      selectedCollege: {},
      errors: {},
      ctr: 0
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
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  updateIndex(selectedIndex) {
    const data = this.props.college.colleges.find(college => {
      return college._id === this.props.selectedCollege._id;
    });

    if (selectedIndex === 0) {
      this.props.navigator.push({
        screen: "Client.AddCourseScreen",
        title: "Add Course",
        passProps: {
          collegeData: data
        }
      });
    }

    if (selectedIndex === 1) {
      this.props.navigator.push({
        screen: "Client.EditCollegeScreen",
        title: "Edit College",
        passProps: {
          collegeData: data
        }
      });
    }

    if (selectedIndex === 2) {
      ImagePicker.launchImageLibrary({ title: "Choose Image" }, response => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          let copyUri = "data:" + response.type + ";base64," + response.data;
          alert(JSON.stringify(response));
        }
      });
    }

    if (selectedIndex === 3) {
      const collegeData = {
        id: data._id,
        logo: data.logo
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
              this.props.deleteCollege(collegeData);
              this.props.navigator.pop();
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  deleteCourseHandler = (collegeId, courseId) => {
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
            this.props.deleteCourse(collegeId, courseId);
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const { colleges, loading } = this.props.college;
    let collegeLayout;

    const buttons = [
      "Add Course",
      "Edit College",
      "Change Logo",
      "Delete College"
    ];

    const data = this.props.college.colleges.find(college => {
      return this.props.selectedCollege._id === college._id;
    });

    let content = (
      <View>
        <Text style={styles.textColor}>
          No courses is added in this college
        </Text>
      </View>
    );

    try {
      if (data.course.length !== 0 && data !== undefined) {
        content = (
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View
              style={{
                width: "100%"
              }}
            >
              {data.course.map(courseInfo => (
                <View
                  key={courseInfo._id}
                  style={{ flexDirection: "row", margin: 6 }}
                >
                  <View
                    style={{
                      width: "95%"
                    }}
                  >
                    <Text style={styles.textColor}>{courseInfo.name}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      this.deleteCourseHandler(data._id, courseInfo._id)
                    }
                  >
                    <View>
                      <Icon name="md-trash" size={20} color="red" />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );
      }
    } catch (err) {
      alert(JSON.stringify(data));
    }

    if (colleges === null || loading) {
      collegeLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      collegeLayout = (
        <View style={{ width: "100%", flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            width="100%"
            display="flex"
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                source={collegeLogo}
                //   {
                //   uri:
                //     "http://capstong.herokuapp.com/images/collegeLogos/" +
                //     this.props.selectedCollege.logo
                // }

                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 100
                }}
              />
              <Text style={styles.textColor}>{data.name.fullName}</Text>
              <Text style={styles.textColor}>{data.name.initials}</Text>
            </View>

            <ButtonGroup
              onPress={this.updateIndex}
              buttons={buttons}
              textStyle={{ color: "black" }}
              containerStyle={{ height: 40 }}
              selectedIndex={3}
              selectedButtonStyle={{ backgroundColor: "#dc3545" }}
              buttonStyle={{ backgroundColor: "#f8f9fa" }}
            />
            <View style={{ width: "100%" }}>
              <Card title="Information" titleStyle={{ color: "#17a2b8" }}>
                <View style={styles.infoContainer}>
                  <MaterialIcon
                    name="library"
                    size={20}
                    color="black"
                    style={{ paddingRight: 5 }}
                  />
                  <Text style={styles.textColor}>
                    Librarian: {data.librarian}
                  </Text>
                </View>

                <View style={styles.infoContainer}>
                  <FontAwesome5Icon
                    name="university"
                    size={20}
                    color="black"
                    style={{ paddingRight: 5 }}
                  />
                  <Text style={styles.textColor}>
                    Total Course: {data.course.length}
                  </Text>
                </View>

                <View style={styles.infoContainer}>
                  <FontAwesomeIcon
                    name="book"
                    size={20}
                    color="black"
                    style={{ paddingRight: 5 }}
                  />
                  <Text style={styles.textColor}>
                    Total Researches: {data.researchTotal}
                  </Text>
                </View>

                <View style={styles.infoContainer}>
                  <FontAwesome5Icon
                    name="newspaper"
                    size={20}
                    color="black"
                    style={{ paddingRight: 5 }}
                  />
                  <Text style={styles.textColor}>
                    Total Journals: {data.journalTotal}
                  </Text>
                </View>

                <View style={styles.infoContainer}>
                  <Icon
                    name="ios-checkmark-circle"
                    size={20}
                    color="black"
                    style={{ paddingRight: 5 }}
                  />
                  <Text style={styles.textColor}>
                    Status: {data.status === 0 ? "Active" : "Not Active"}
                  </Text>
                </View>

                <View style={styles.infoContainer}>
                  <Icon
                    name="md-refresh"
                    size={20}
                    color="black"
                    style={{ paddingRight: 5 }}
                  />
                  <Text style={styles.textColor}>
                    Last Update:{" "}
                    {Moment(data.lastUpdate.date).format("MMM. DD, YYYY")}
                  </Text>
                </View>
              </Card>
            </View>

            <View style={{ width: "100%", paddingBottom: 20 }}>
              <Card title="Courses" titleStyle={{ color: "#17a2b8" }}>
                {content}
              </Card>
            </View>
          </ScrollView>
        </View>
      );
    }

    return <View style={styles.container}>{collegeLayout}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%"
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5
  },
  textColor: { color: "black" }
});

CollegeDetailsScreen.propTypes = {
  college: PropTypes.object.isRequired,
  getColleges: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
  deleteCollege: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getColleges, deleteCourse, deleteCollege }
)(CollegeDetailsScreen);
