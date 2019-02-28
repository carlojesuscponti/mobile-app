import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl
} from "react-native";
import moment from "moment";

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
      ctr: 0,
      refreshing: false,
      changedImageCtr: 0
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
    if (this.state.changedImageCtr === 1) {
      //alert(JSON.stringify(this.props.college.loading));
      this.setState({
        changedImageCtr: 0
      });
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    if (!this.props.college.loading) {
      this.props.getColleges();
      this.setState({ refreshing: false });
    }
  };

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
          try {
            let copyUri = "data:" + response.type + ";base64," + response.data;
            const logoExt = data.logo;
            const logoname = logoExt.replace(/^.*\\/, "");

            const collegeData = {
              initials: data.name.initials,
              oldLogo: data.logo,
              ext: logoname.split(".").pop(),
              id: data._id,
              file: copyUri
            };

            this.props.changeCollegeLogo(collegeData);
            this.setState({
              changedImageCtr: 1
            });
            //this.props.navigator.pop();
          } catch (err) {
            console.log(err);
          }
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

    let dateFormat = data.lastUpdate.date;
    dateFormat = dateFormat.slice(0, 10);
    dateFormat = moment(dateFormat).format("MMM. DD, YYYY");

    let fontColor;

    const c = data.color.substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 65) {
      fontColor = "white";
    } else {
      fontColor = "black";
    }

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
                      <Icon name="md-trash" size={23} color="red" />
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

    if (colleges === null || loading || this.state.changedImageCtr === 1) {
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
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View
              style={[
                styles.imageBackgroudStyle,
                { backgroundColor: data.color }
              ]}
            >
              <Image
                source={{
                  uri:
                    "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/collegeLogos/" +
                    data.logo
                }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 100
                }}
              />
              <Text style={{ color: fontColor, fontSize: 20 }}>
                {data.name.initials}
              </Text>
              <Text style={{ color: fontColor, justifyContent: "center" }}>
                {data.name.fullName}
              </Text>
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
                    Last Update:
                    {" " + dateFormat}
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
  imageBackgroudStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10
  },
  textColor: {
    color: "black"
  }
});

CollegeDetailsScreen.propTypes = {
  college: PropTypes.object.isRequired,
  getColleges: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
  deleteCollege: PropTypes.func.isRequired,
  changeCollegeLogo: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { changeCollegeLogo, getColleges, deleteCourse, deleteCollege }
)(CollegeDetailsScreen);
