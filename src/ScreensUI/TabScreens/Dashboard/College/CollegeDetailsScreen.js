import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from "react-native";
import {
  changeCollegeLogo,
  getColleges,
  deleteCourse,
  deleteCollege,
  restoreCollege,
  createReportForCollege
} from "../../../../store/actions/collegeAction";
import { getResearches } from "../../../../store/actions/researchActions";
import {
  check,
  request,
  ANDROID_PERMISSIONS,
  RESULTS
} from "react-native-permissions";

import {
  addCourse,
  courseBin,
  editCollege,
  changeLogo,
  courseList,
  BadgeActive,
  BadgeInactive,
  BadgeDeleted,
  DetailsTop,
  ReportTop,
  CoursesTop,
  MoveToBinTop,
  RestoreTop
} from "../../../../Components/Button/buttons";

import { Card, ButtonGroup, CheckBox } from "react-native-elements";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import ImagePicker from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Spinner from "../../../../Components/Spinner/Spinner";

class CollegeDetailsScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    this.updateIndexCollege = this.updateIndexCollege.bind(this);
    this.updateIndexCourse = this.updateIndexCourse.bind(this);
    this.updateIndexTB = this.updateIndexTB.bind(this);
    this.state = {
      refreshing: false,
      changedImageCtr: 0,
      selectedList: 0,
      nodatafound: 0,
      selectedIndex: 0,

      // Basic info
      researchTotal: true,
      journalTotal: true,
      courseTotal: true,
      lastUpdate: true,
      status: true,

      // courses
      courses: true,
      courseStatus: true,
      courseResearch: true,
      courseJournal: true,
      deletedCourses: false,

      // researches
      listOfResearches: true,
      researchStatus: true,
      researchResId: true,
      researchCollege: true,
      researchCourse: true,
      researchType: true,
      researchPages: true,
      researchAcademicYear: true,
      researchLastUpdate: true,
      deletedResearches: false
    };
  }

  componentWillMount() {
    if (!this.props.research.loading) {
      this.props.getResearches();
    }

    if (!this.props.college.loading) {
      this.props.getColleges();
    }
  }

  componentDidMount() {
    if (!this.props.research.loading) {
      this.props.getResearches();
    }

    if (!this.props.college.loading) {
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

  // Top Buttons
  updateIndexTB(selIndex) {
    if (selIndex === 0) {
      this.setState({
        selectedIndex: 0
      });
    }

    if (selIndex === 1) {
      this.setState({
        selectedIndex: 1
      });
    }

    if (selIndex === 2) {
      this.setState({
        selectedIndex: 2
      });
    }

    const data = this.props.college.colleges.find(college => {
      return college._id === this.props.selectedCollege._id;
    });

    if (selIndex === 3) {
      if (
        data.course.length === 0 &&
        data.researchTotal === "0" &&
        data.journalTotal === "0"
      ) {
        const name =
          this.props.auth.user.firstName +
          " " +
          this.props.auth.user.middleName +
          " " +
          this.props.auth.user.lastName;

        const collegeData = {
          id: data._id,
          logo: data.logo,
          username: name
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
                if (data.deleted === 0) {
                  this.props.deleteCollege(collegeData);
                  this.props.navigator.pop();
                }

                if (data.deleted === 1) {
                  this.props.restoreCollege(collegeData);
                }
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
  // Top Buttons

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
            const name =
              this.props.auth.user.firstName +
              " " +
              this.props.auth.user.middleName +
              " " +
              this.props.auth.user.lastName;

            const collegeData = {
              initials: data.name.initials,
              oldLogo: data.logo,
              ext: logoname.split(".").pop(),
              id: data._id,
              file: copyUri,
              username: name
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
  }
  //Active College

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

  addResearchHandler = data => {
    this.props.navigator.push({
      screen: "Client.AddResearchScreen",
      title: "Add Research",
      passProps: {
        addResearchData: data
      }
    });
  };

  pdfHandler = () => {
    check(ANDROID_PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log("the feature is not available on this device");
            break;
          case RESULTS.GRANTED: {
            if (
              // Basic info
              this.state.researchTotal === false &&
              this.state.journalTotal === false &&
              this.state.courseTotal === false &&
              this.state.status === false &&
              this.state.lastUpdate === false &&
              // Courses
              this.state.courses === false &&
              this.state.courseStatus === false &&
              this.state.courseResearch === false &&
              this.state.courseJournal === false &&
              this.state.deletedCourses === false &&
              // researches
              this.state.listOfResearches === false &&
              this.state.researchStatus === false &&
              this.state.researchResId === false &&
              this.state.researchCollege === false &&
              this.state.researchCourse === false &&
              this.state.researchType === false &&
              this.state.researchPages === false &&
              this.state.researchAcademicYear === false &&
              this.state.researchLastUpdate === false &&
              this.state.deletedResearches === false
            ) {
              Alert.alert("Message", "Please check at least one");
            } else {
              const spefCollege = this.props.college.colleges.find(college => {
                return college._id === this.props.selectedCollege._id;
              });

              const name =
                this.props.auth.user.firstName +
                " " +
                this.props.auth.user.middleName +
                " " +
                this.props.auth.user.lastName;

              const reportData = {
                // basic info
                researchTotal: this.state.researchTotal,
                journalTotal: this.state.journalTotal,
                courseTotal: this.state.courseTotal,
                status: this.state.status,
                lastUpdate: this.state.lastUpdate,

                // courses
                courses: this.state.courses,
                courseStatus: this.state.courseStatus,
                courseResearch: this.state.courseResearch,
                courseJournal: this.state.courseJournal,
                deletedCourses: this.state.deletedCourses,

                // researches
                listOfResearches: this.state.listOfResearches,
                researchStatus: this.state.researchStatus,
                researchResId: this.state.researchResId,
                researchCollege: this.state.researchCollege,
                researchCourse: this.state.researchCourse,
                researchType: this.state.researchType,
                researchPages: this.state.researchPages,
                researchAcademicYear: this.state.researchAcademicYear,
                researchLastUpdate: this.state.researchLastUpdate,
                deletedResearches: this.state.deletedResearches,

                // other
                android: true,
                college: spefCollege,
                researches: this.props.research.researches,
                typeOfReport: "College Report",
                printedBy: name
              };
              this.props.createReportForCollege(reportData);
              Alert.alert(
                "Message",
                "Please wait while your report is being generated"
              );
            }
            break;
          }

          case RESULTS.DENIED: {
            request(ANDROID_PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(res => {
              if (res === "granted") {
                if (
                  // Basic info
                  this.state.researchTotal === false &&
                  this.state.journalTotal === false &&
                  this.state.courseTotal === false &&
                  this.state.status === false &&
                  this.state.lastUpdate === false &&
                  // Courses
                  this.state.courses === false &&
                  this.state.courseStatus === false &&
                  this.state.courseResearch === false &&
                  this.state.courseJournal === false &&
                  this.state.deletedCourses === false &&
                  // researches
                  this.state.listOfResearches === false &&
                  this.state.researchStatus === false &&
                  this.state.researchResId === false &&
                  this.state.researchCollege === false &&
                  this.state.researchCourse === false &&
                  this.state.researchType === false &&
                  this.state.researchPages === false &&
                  this.state.researchAcademicYear === false &&
                  this.state.researchLastUpdate === false &&
                  this.state.deletedResearches === false
                ) {
                  Alert.alert("Message", "Please check at least one");
                } else {
                  const spefCollege = this.props.college.colleges.find(
                    college => {
                      return college._id === this.props.selectedCollege._id;
                    }
                  );

                  const name =
                    this.props.auth.user.firstName +
                    " " +
                    this.props.auth.user.middleName +
                    " " +
                    this.props.auth.user.lastName;

                  const reportData = {
                    // basic info
                    researchTotal: this.state.researchTotal,
                    journalTotal: this.state.journalTotal,
                    courseTotal: this.state.courseTotal,
                    status: this.state.status,
                    lastUpdate: this.state.lastUpdate,

                    // courses
                    courses: this.state.courses,
                    courseStatus: this.state.courseStatus,
                    courseResearch: this.state.courseResearch,
                    courseJournal: this.state.courseJournal,
                    deletedCourses: this.state.deletedCourses,

                    // researches
                    listOfResearches: this.state.listOfResearches,
                    researchStatus: this.state.researchStatus,
                    researchResId: this.state.researchResId,
                    researchCollege: this.state.researchCollege,
                    researchCourse: this.state.researchCourse,
                    researchType: this.state.researchType,
                    researchPages: this.state.researchPages,
                    researchAcademicYear: this.state.researchAcademicYear,
                    researchLastUpdate: this.state.researchLastUpdate,
                    deletedResearches: this.state.deletedResearches,

                    // other
                    android: true,
                    college: spefCollege,
                    researches: this.props.research.researches,
                    typeOfReport: "College Report",
                    printedBy: name
                  };

                  this.props.createReportForCollege(reportData);
                  Alert.alert(
                    "Message",
                    "Please wait while your report is being generated"
                  );
                }
              }
            });
            break;
          }

          case RESULTS.NEVER_ASK_AGAIN:
            console.log("permission is denied and not requestable");
            break;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { colleges, loading, changeStatus } = this.props.college;
    let collegeLayout;
    let activeCtr = 0;
    let inactiveCtr = 0;

    const collegeDetButtons = [
      { element: editCollege },
      { element: changeLogo }
    ];

    const courseButtons = [
      { element: addCourse },
      { element: this.state.selectedList === 0 ? courseBin : courseList }
    ];

    const topActiveButtons = [
      { element: DetailsTop },
      { element: CoursesTop },
      { element: ReportTop },
      { element: MoveToBinTop }
    ];

    // const topDeletedButtons = [
    //   { element: DetailsTop },
    //   { element: CoursesTop },
    //   { element: ReportTop },
    //   { element: RestoreTop }
    // ];

    if (colleges === null || loading || changeStatus) {
      collegeLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner />
        </View>
      );
    } else {
      const collegeData = this.props.college.colleges.find(college => {
        return this.props.selectedCollege._id === college._id;
      });

      const topActiveButtons = [
        { element: DetailsTop },
        { element: CoursesTop },
        { element: ReportTop },
        { element: collegeData.deleted === 0 ? MoveToBinTop : RestoreTop }
      ];

      const {
        // Basic Info
        researchTotal,
        journalTotal,
        courseTotal,
        status,
        lastUpdate,

        // Courses
        courses,
        courseStatus,
        courseResearch,
        courseJournal,
        deletedCourses,

        // Researches
        listOfResearches,
        researchStatus,
        researchResId,
        researchCollege,
        researchCourse,
        researchType,
        researchPages,
        researchAcademicYear,
        researchLastUpdate,
        deletedResearches
      } = this.state;

      let dateFormatUpdated = collegeData.lastUpdate.date;
      dateFormatUpdated = moment(dateFormatUpdated).format("MMM. DD, YYYY");

      let timeFormatUpdated = collegeData.lastUpdate.date;
      timeFormatUpdated = moment(timeFormatUpdated).format("h:mm A");

      let dateFormatCreated = collegeData.dateCreated;
      dateFormatCreated = moment(dateFormatCreated).format("MMM. DD, YYYY");

      let timeFormatCreated = collegeData.dateCreated;
      timeFormatCreated = moment(timeFormatCreated).format("h:mm A");

      let datetimeFormatCreated =
        dateFormatCreated + " at " + timeFormatCreated;
      let datetimeFormatUpdated =
        dateFormatUpdated + " at " + timeFormatUpdated;

      let fontColor;
      let coursesContent;

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

      try {
        if (collegeData.course.length === 0) {
          coursesContent = (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <Text style={{ color: "black", fontSize: 18 }}>
                No course is added in this college
              </Text>
            </View>
          );
        }
        if (collegeData !== undefined && collegeData.course.length !== 0) {
          const activeCourses = collegeData.course.filter(course => {
            return course.deleted === 0;
          });

          const inActiveCourses = collegeData.course.filter(course => {
            return course.deleted === 1;
          });

          activeCtr = activeCourses.length;
          inactiveCtr = inActiveCourses.length;

          const name =
            this.props.auth.user.firstName +
            " " +
            this.props.auth.user.middleName +
            " " +
            this.props.auth.user.lastName;

          if (activeCtr === 0 && this.state.selectedList === 0) {
            coursesContent = (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                <Text style={{ color: "black", fontSize: 18 }}>
                  No data found
                </Text>
              </View>
            );
          } else if (inactiveCtr === 0 && this.state.selectedList === 1) {
            coursesContent = (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                <Text style={{ color: "black", fontSize: 18 }}>
                  No data found
                </Text>
              </View>
            );
          } else {
            const name =
              this.props.auth.user.firstName +
              " " +
              this.props.auth.user.middleName +
              " " +
              this.props.auth.user.lastName;
            coursesContent = (
              <View style={{ width: "100%", flexDirection: "row" }}>
                <View
                  style={{
                    width: "100%",
                    borderColor: "#d9d9d9",
                    borderWidth: 1
                  }}
                >
                  {(this.state.selectedList === 0
                    ? activeCourses
                    : inActiveCourses
                  ).map((courseInfo, index) => (
                    <View
                      key={courseInfo._id}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 6,
                        alignItems: "center",
                        backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2"
                      }}
                    >
                      <View style={{ width: "60%" }}>
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
                              collegeInit: collegeData.name.initials,
                              username: name
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

                        {courseInfo.researchTotal === 0 &&
                        courseInfo.journalTotal === 0 ? (
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
                                      collegeInit: collegeData.name.initials,
                                      username: name
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
                                      collegeInit: collegeData.name.initials,
                                      username: name
                                    })
                                  )
                            }
                          >
                            <View
                              style={[
                                styles.iconStyle,
                                courseInfo.deleted === 0
                                  ? {
                                      backgroundColor:
                                        this.state.selectedList === 0
                                          ? "#dc3545"
                                          : "#28a745"
                                    }
                                  : {
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
                        ) : (
                          <View />
                        )}

                        {courseInfo.deleted === 0 ? (
                          <TouchableOpacity
                            onPress={this.addResearchHandler.bind(
                              this,
                              (addresearch = {
                                courseName: courseInfo.name,
                                collegeName: collegeData.name.fullName,
                                addresearchID: 1
                              })
                            )}
                          >
                            <View
                              style={[
                                styles.iconStyle,
                                {
                                  backgroundColor: "#007bff",
                                  borderBottomRightRadius: 5,
                                  borderTopRightRadius: 5
                                }
                              ]}
                            >
                              <FontAwesome5Icon
                                name="plus"
                                size={16}
                                color="white"
                              />
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <View />
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          }
        }
      } catch (err) {}
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
            <View style={{ alignItems: "center", margin: 10 }}>
              <ButtonGroup
                onPress={this.updateIndexTB}
                buttons={topActiveButtons}
                textStyle={{ color: "black" }}
                containerStyle={{ width: "95%" }}
                selectedIndex={this.state.selectedIndex}
                selectedTextStyle={{ color: "white" }}
                selectedButtonStyle={{
                  backgroundColor: "#007bff"
                }}
                buttonStyle={{ backgroundColor: "#fff" }}
              />
            </View>
            {this.state.selectedIndex === 0 ? (
              <View style={{ alignItems: "center" }}>
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

                  <Text
                    style={[styles.textFullNameStyle, { color: fontColor }]}
                  >
                    {collegeData.name.fullName}
                  </Text>
                </View>

                {collegeData.deleted === 0 ? (
                  <View style={{ alignItems: "center" }}>
                    <ButtonGroup
                      onPress={this.updateIndexCollege}
                      buttons={collegeDetButtons}
                      textStyle={{ color: "black" }}
                      containerStyle={{
                        height: 40,
                        marginTop: 20,
                        width: "60%"
                      }}
                      selectedIndex={2}
                      buttonStyle={{ backgroundColor: "#e6e6e6" }}
                      selectedButtonStyle={{
                        backgroundColor: "#dc3545",
                        alignItems: "center"
                      }}
                    />
                  </View>
                ) : (
                  <View />
                )}

                <View style={{ width: "100%", paddingBottom: 20 }}>
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
                      <FontAwesome5Icon
                        name="clock"
                        size={20}
                        color="black"
                        style={{ paddingRight: 5 }}
                      />
                      <Text style={styles.textColor}>
                        Created:
                        {" " + datetimeFormatCreated}
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
                        Updated:
                        {" " + datetimeFormatUpdated}
                      </Text>
                    </View>
                  </Card>
                </View>
              </View>
            ) : (
              <View />
            )}

            {this.state.selectedIndex === 1 ? (
              <View style={{ alignItems: "center" }}>
                {collegeData.deleted === 0 ? (
                  <ButtonGroup
                    onPress={this.updateIndexCourse}
                    buttons={courseButtons}
                    textStyle={{ color: "black" }}
                    containerStyle={{ height: 40, marginTop: 20, width: "60%" }}
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
              </View>
            ) : (
              <View />
            )}

            {this.state.selectedIndex === 2 ? (
              <View style={{ alignItems: "center" }}>
                <Card
                  title="Basic Information"
                  titleStyle={{ color: "#17a2b8" }}
                  containerStyle={{ width: "90%" }}
                >
                  <View style={{ alignItems: "center" }}>
                    <View style={{ width: "100%" }}>
                      <CheckBox
                        checked={status}
                        title="College Status"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            status: !status
                          });
                        }}
                      />

                      <CheckBox
                        checked={researchTotal}
                        title="Total Number of Research"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            researchTotal: !researchTotal
                          });
                        }}
                      />

                      <CheckBox
                        checked={journalTotal}
                        title="Total Number of Journal"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            journalTotal: !journalTotal
                          });
                        }}
                      />

                      <CheckBox
                        checked={courseTotal}
                        title="Total Number of Course"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            courseTotal: !courseTotal
                          });
                        }}
                      />

                      <CheckBox
                        checked={lastUpdate}
                        title="Last Update"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff",
                          height: 40
                        }}
                        onPress={() => {
                          this.setState({
                            lastUpdate: !lastUpdate
                          });
                        }}
                      />
                    </View>
                  </View>
                </Card>

                <Card
                  title="Courses"
                  titleStyle={{ color: "#17a2b8" }}
                  containerStyle={{ width: "90%" }}
                >
                  <View style={{ alignItems: "center" }}>
                    <View style={{ width: "100%" }}>
                      <CheckBox
                        checked={courses}
                        title="College Courses"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            courses: !courses
                          });
                        }}
                      />

                      <CheckBox
                        checked={courseStatus}
                        title="Course Status"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            courseStatus: !courseStatus
                          });
                        }}
                      />

                      <CheckBox
                        checked={courseResearch}
                        title="Course Researches"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            courseResearch: !courseResearch
                          });
                        }}
                      />

                      <CheckBox
                        checked={courseJournal}
                        title="Course Journals"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            courseJournal: !courseJournal
                          });
                        }}
                      />

                      <CheckBox
                        checked={deletedCourses}
                        title="Include Deleted Courses"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            deletedCourses: !deletedCourses
                          });
                        }}
                      />
                    </View>
                  </View>
                </Card>

                <Card
                  title="Researches"
                  titleStyle={{ color: "#17a2b8" }}
                  containerStyle={{ width: "90%" }}
                >
                  <View style={{ alignItems: "center" }}>
                    <View style={{ width: "100%" }}>
                      <CheckBox
                        checked={listOfResearches}
                        title="College Researches"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            listOfResearches: !listOfResearches
                          });
                        }}
                      />

                      <CheckBox
                        checked={researchStatus}
                        title="Status"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            researchStatus: !researchStatus
                          });
                        }}
                      />

                      <CheckBox
                        checked={researchResId}
                        title=" Research ID"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            researchResId: !researchResId
                          });
                        }}
                      />

                      <CheckBox
                        checked={researchCollege}
                        title="College"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            researchCollege: !researchCollege
                          });
                        }}
                      />

                      <CheckBox
                        checked={researchCourse}
                        title="Course"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            researchCourse: !researchCourse
                          });
                        }}
                      />

                      <CheckBox
                        checked={researchType}
                        title="Type"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            researchType: !researchType
                          });
                        }}
                      />

                      <CheckBox
                        checked={researchPages}
                        title="Pages"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            researchPages: !researchPages
                          });
                        }}
                      />

                      <CheckBox
                        checked={researchAcademicYear}
                        title="Academic Year"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            researchAcademicYear: !researchAcademicYear
                          });
                        }}
                      />

                      <CheckBox
                        checked={researchLastUpdate}
                        title="Last Update"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            researchLastUpdate: !researchLastUpdate
                          });
                        }}
                      />

                      <CheckBox
                        checked={deletedResearches}
                        title="Include Deleted College Researches"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            deletedResearches: !deletedResearches
                          });
                        }}
                      />
                    </View>
                  </View>
                </Card>

                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={this.pdfHandler}
                    disabled={this.props.college.buttonDisable}
                  >
                    <View
                      style={[
                        styles.button,
                        {
                          backgroundColor: this.props.college.buttonDisable
                            ? "#3396ff"
                            : "#007bff"
                        }
                      ]}
                    >
                      <Text style={{ color: "white" }}>Generate Report</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View />
            )}
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
    width: "100%",
    backgroundColor: "white"
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5
  },
  imageBackgroudStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
    padding: 10,
    borderRadius: 5
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
    borderColor: "#007bff"
  }
});

CollegeDetailsScreen.propTypes = {
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getColleges: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
  deleteCollege: PropTypes.func.isRequired,
  changeCollegeLogo: PropTypes.func.isRequired,
  restoreCollege: PropTypes.func.isRequired,
  createReportForCollege: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  research: state.research,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    changeCollegeLogo,
    getColleges,
    getResearches,
    deleteCourse,
    deleteCollege,
    restoreCollege,
    createReportForCollege
  }
)(CollegeDetailsScreen);
