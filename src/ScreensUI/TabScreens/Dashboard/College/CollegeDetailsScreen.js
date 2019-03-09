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
  deleteCollege,
  restoreCollege
} from "../../../../store/actions/collegeAction";

import ImagePicker from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

import { Card, ButtonGroup, Badge } from "react-native-elements";

import {
  addCourse,
  courseBin,
  editCollege,
  changeLogo,
  moveToBin,
  courseList,
  BadgeActive,
  BadgeInactive,
  BadgeDeleted
} from "../../../../Components/Button/buttons";

class CollegeDetailsScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    this.updateIndexCollege = this.updateIndexCollege.bind(this);
    this.updateIndexCourse = this.updateIndexCourse.bind(this);
    this.state = {
      selectedCollege: {},
      errors: {},
      ctr: 0,
      refreshing: false,
      changedImageCtr: 0,
      selectedList: 0,
      nodatafound: 0
    };
  }

  componentWillMount() {
    if (this.props.college.loading) {
      this.props.getColleges();
    }
  }

  componentDidMount() {
    if (this.props.college.loading) {
      this.props.getColleges();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.changedImageCtr === 1) {
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

  //Active College
  updateIndexCollege(selectedIndex) {
    const data = this.props.college.colleges.find(college => {
      return college._id === this.props.selectedCollege._id;
    });

    if (selectedIndex === 0) {
      this.props.navigator.push({
        screen: "Client.EditCollegeScreen",
        title: "Edit College",
        passProps: {
          collegeData: data
        }
      });
    }

    if (selectedIndex === 1) {
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
          } catch (err) {
            console.log(err);
          }
        }
      });
    }

    if (selectedIndex === 2) {
      if (
        data.course.length === 0 &&
        data.researchTotal === "0" &&
        data.journalTotal === "0"
      ) {
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
      } else {
        Alert.alert("Warning", "Cant delete data!");
      }
    }
  }
  //Active College

  //Inactive College
  updateIndexNA = () => {
    const getData = this.props.college.colleges.find(college => {
      return college._id === this.props.selectedCollege._id;
    });

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
            const data = {
              id: getData._id,
              logo: getData.logo
            };
            this.props.restoreCollege(data);
          }
        }
      ],
      { cancelable: false }
    );
  };
  //Inactive College

  //Active Course
  updateIndexCourse(selIndex) {
    const data = this.props.college.colleges.find(college => {
      return college._id === this.props.selectedCollege._id;
    });

    if (selIndex === 0) {
      this.props.navigator.push({
        screen: "Client.AddCourseScreen",
        title: "Add Course",
        passProps: {
          collegeData: data
        }
      });
    }

    if (selIndex === 1 && this.state.selectedList === 0) {
      this.setState({ selectedList: 1 });
    }

    if (selIndex === 1 && this.state.selectedList === 1) {
      this.setState({ selectedList: 0 });
    }
  }
  //Active Course

  deleteCourseHandler = course => {
    if (course.courseTotalRes === 0 && course.courseTotalJour === 0) {
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
              this.props.deleteCourse(course);
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("Warning", "Cant delete course!");
    }
  };

  restoreCourseHandler = course => {
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
            this.props.deleteCourse(course);
          }
        }
      ],
      { cancelable: false }
    );
  };
  editCourseHandler = data => {
    this.props.navigator.push({
      screen: "Client.EditCourseScreen",
      title: "Edit Course",
      passProps: {
        courseData: data
      }
    });
  };
  render() {
    const { colleges, loading } = this.props.college;
    let collegeLayout;
    let activeCtr = 0;
    let inactiveCtr = 0;
    const collegeDetButtons = [
      { element: editCollege },
      { element: changeLogo },
      { element: moveToBin }
    ];
    const courseButtons = [
      { element: addCourse },
      { element: this.state.selectedList === 0 ? courseBin : courseList }
    ];

    const notActive = ["Restore"];

    if (colleges === null || loading || this.state.changedImageCtr === 1) {
      collegeLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      const collegeData = this.props.college.colleges.find(college => {
        return this.props.selectedCollege._id === college._id;
      });

      let dateFormat = collegeData.lastUpdate.date;
      dateFormat = dateFormat.slice(0, 10);
      dateFormat = moment(dateFormat).format("MMM. DD, YYYY");

      let fontColor;

      const c = collegeData.color.substring(1); // strip #
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

      let coursesContent;
      let noFoundDataBin;
      let noFoundDataList;
      try {
        if (collegeData.course.length !== 0 && collegeData !== undefined) {
          const activeCourses = collegeData.course.filter(course => {
            return course.deleted === 0;
          });

          const inActiveCourses = collegeData.course.filter(course => {
            return course.deleted === 1;
          });

          activeCtr = activeCourses.length;
          inactiveCtr = inActiveCourses.length;

          if (activeCtr <= 0) {
            noFoundDataBin = (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                <Text>No Data Found</Text>
              </View>
            );
          } else {
            coursesContent = (
              <View style={{ width: "100%", flexDirection: "row" }}>
                <View
                  style={{
                    width: "100%"
                  }}
                >
                  {(this.state.selectedList === 0
                    ? activeCourses
                    : inActiveCourses
                  ).map(courseInfo => (
                    <View
                      key={courseInfo._id}
                      style={{
                        flexDirection: "row",
                        margin: 6,
                        alignItems: "center"
                      }}
                    >
                      <View
                        style={{
                          width: "75%"
                        }}
                      >
                        <Text style={[styles.textColor, { fontSize: 15 }]}>
                          {courseInfo.name}
                        </Text>
                        {courseInfo.deleted === 0 ? (
                          courseInfo.status === 0 ? (
                            <BadgeActive />
                          ) : (
                            <BadgeInactive />
                          )
                        ) : (
                          <BadgeDeleted />
                        )}
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          width: "20%",
                          marginLeft: 8
                        }}
                      >
                        <TouchableOpacity
                          onPress={this.editCourseHandler.bind(
                            this,
                            (course = {
                              courseName: courseInfo.name,
                              courseInitials: courseInfo.initials,
                              courseTotalRes: courseInfo.researchTotal,
                              courseTotalJour: courseInfo.journalTotal,
                              courseDeleted: courseInfo.deleted,
                              courseStatus: courseInfo.status,
                              collegeId: collegeData._id,
                              courseId: courseInfo._id,
                              collegeInit: collegeData.name.initials
                            })
                          )}
                        >
                          <View
                            style={[
                              styles.iconStyle,
                              {
                                backgroundColor: "#17a2b8",
                                borderBottomLeftRadius: 5,
                                borderTopLeftRadius: 5
                              }
                            ]}
                          >
                            <Icon name="md-create" size={20} color="white" />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={
                            this.state.selectedList === 0
                              ? this.deleteCourseHandler.bind(
                                  this,
                                  (course = {
                                    courseName: courseInfo.name,
                                    courseInitials: courseInfo.initials,
                                    courseTotalRes: courseInfo.researchTotal,
                                    courseTotalJour: courseInfo.journalTotal,
                                    courseId: courseInfo._id,
                                    collegeId: collegeData._id,
                                    courseStatus: courseInfo.status,
                                    courseDeleted: courseInfo.deleted,
                                    collegeInit: collegeData.name.initials
                                  })
                                )
                              : this.restoreCourseHandler.bind(
                                  this,
                                  (course = {
                                    courseName: courseInfo.name,
                                    courseInitials: courseInfo.initials,
                                    courseTotalRes: courseInfo.researchTotal,
                                    courseTotalJour: courseInfo.journalTotal,
                                    courseId: courseInfo._id,
                                    collegeId: collegeData._id,
                                    courseStatus: courseInfo.status,
                                    courseDeleted: courseInfo.deleted,
                                    collegeInit: collegeData.name.initials
                                  })
                                )
                          }
                        >
                          <View
                            style={[
                              styles.iconStyle,
                              {
                                backgroundColor:
                                  this.state.selectedList === 0
                                    ? "#dc3545"
                                    : "#28a745",
                                borderBottomRightRadius: 5,
                                borderTopRightRadius: 5
                              }
                            ]}
                          >
                            {this.state.selectedList === 0 ? (
                              <Icon name="md-trash" size={20} color="white" />
                            ) : (
                              <MaterialIcon
                                name="recycle"
                                size={20}
                                color="white"
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          }
        }
      } catch (err) {
        alert(JSON.stringify(err));
      }

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
                { backgroundColor: collegeData.color }
              ]}
            >
              <Image
                source={{
                  uri:
                    "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/collegeLogos/" +
                    collegeData.logo
                }}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 100
                }}
              />
              <Text style={{ color: fontColor, fontSize: 25 }}>
                {collegeData.name.initials}
              </Text>

              <Text style={[styles.textFullNameStyle, { color: fontColor }]}>
                {collegeData.name.fullName}
              </Text>
            </View>

            {collegeData.deleted === 0 ? (
              <ButtonGroup
                onPress={this.updateIndexCollege}
                buttons={collegeDetButtons}
                textStyle={{ color: "black" }}
                containerStyle={{ height: 40, marginTop: 20 }}
                selectedIndex={2}
                buttonStyle={{ backgroundColor: "#e6e6e6" }}
                selectedButtonStyle={{
                  backgroundColor: "#dc3545",
                  alignItems: "center"
                }}
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <ButtonGroup
                  onPress={this.updateIndexNA}
                  buttons={notActive}
                  textStyle={{ color: "black" }}
                  containerStyle={{ height: 40, width: "50%" }}
                  selectedIndex={0}
                  selectedButtonStyle={{ backgroundColor: "#218838" }}
                  buttonStyle={{ backgroundColor: "#dc3545" }}
                />
              </View>
            )}

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
                    Librarian: {collegeData.librarian}
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
                    Total Course: {activeCtr}
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
                    Total Researches: {collegeData.researchTotal}
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
                    Total Journals: {collegeData.journalTotal}
                  </Text>
                </View>

                <View style={styles.infoContainer}>
                  <Icon
                    name="ios-checkmark-circle"
                    size={20}
                    color="black"
                    style={{ paddingRight: 5 }}
                  />
                  <Text style={styles.textColor}>Status: </Text>
                  {collegeData.deleted === 0 ? (
                    collegeData.status === 0 ? (
                      <BadgeActive />
                    ) : (
                      <BadgeInactive />
                    )
                  ) : (
                    <BadgeDeleted />
                  )}
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

            {collegeData.deleted === 0 ? (
              <ButtonGroup
                onPress={this.updateIndexCourse}
                buttons={courseButtons}
                textStyle={{ color: "black" }}
                containerStyle={{ height: 40, marginTop: 20 }}
                selectedIndex={2}
                selectedButtonStyle={{
                  backgroundColor: "#dc3545",
                  alignItems: "center"
                }}
                buttonStyle={{ backgroundColor: "#e6e6e6" }}
              />
            ) : (
              <View />
            )}

            <View style={{ width: "100%", paddingBottom: 20 }}>
              <Card title="Courses" titleStyle={{ color: "#17a2b8" }}>
                {coursesContent}
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
  },
  textFullNameStyle: {
    justifyContent: "center",
    textAlign: "center",
    fontSize: 20
  },
  iconStyle: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center"
  }
});

CollegeDetailsScreen.propTypes = {
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getColleges: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
  deleteCollege: PropTypes.func.isRequired,
  changeCollegeLogo: PropTypes.func.isRequired,
  restoreCollege: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    changeCollegeLogo,
    getColleges,
    deleteCourse,
    deleteCollege,
    restoreCollege
  }
)(CollegeDetailsScreen);
