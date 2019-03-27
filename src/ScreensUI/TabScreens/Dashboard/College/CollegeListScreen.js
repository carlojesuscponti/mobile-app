import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
  Alert,
  NetInfo,
  ImageBackground
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { CheckBox } from "react-native-elements";
import {
  check,
  request,
  ANDROID_PERMISSIONS,
  RESULTS
} from "react-native-permissions";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import Flatlists from "../../../../Components/CollegeFlatlist/Flatlist";
import Gridlists from "../../../../Components/CollegeFlatlist/GridList";
import ButtonComponent from "../../../../Components/Button/ButtonWithIcon";
import PropTypes from "prop-types";
import {
  getColleges,
  createReportForColleges
} from "../../../../store/actions/collegeAction";
import TextHeading from "../../../../Components/Text/TextHeading";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import bgImage from "../../../../Pictures/bulsu1.png";
import Spinner from "../../../../Components/Spinner/Spinner";

class CollegeListScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    this.state = {
      searchBarEmpty: "",
      errors: {},
      refreshing: false,
      selectedButton: 0,
      selectedTab: 0,
      width: 0,
      height: 0,
      selectedList: 0,
      visibleModal: null,
      connection: "",

      status: true,
      coursesTotal: true,
      researchTotal: true,
      journalTotal: true,
      lastUpdate: true,
      deletedColleges: false
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    if (!this.props.college.loading) {
      this.props.getColleges();
      this.setState({ refreshing: false });
    }
  };

  componentWillMount() {
    if (!this.props.college.loading) {
      NetInfo.getConnectionInfo().then(connectionInfo => {
        if (connectionInfo.type === "none") {
        } else {
          Icon.getImageSource("ios-add", 40).then(icon => {
            this.props.navigator.setButtons({
              rightButtons: [
                {
                  title: "add",
                  id: "add",
                  icon
                }
              ]
            });
          });
        }

        this.setState({
          connection: connectionInfo.type
        });
      });

      this.props.getColleges();
    }
  }

  onNavigatorEvent = event => {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "sideDrawerToggle") {
        this.props.navigator.toggleDrawer({
          side: "left"
        });
      }

      if (event.id === "add") {
        this.props.navigator.push({
          screen: "Client.AddCollegeScreen",
          title: "Add College"
        });
      }
    }
  };

  // componentDidMount() {
  //   if (this.state.connection === "none") {
  //   } else {
  //     Icon.getImageSource("ios-add", 40).then(icon => {
  //       this.props.navigator.setButtons({
  //         rightButtons: [
  //           {
  //             title: "add",
  //             id: "add",
  //             icon
  //           }
  //         ]
  //       });
  //     });
  //   }
  // }

  itemSelectedHandler = key => {
    const selCollege = this.props.college.colleges.find(college => {
      return college._id === key;
    });

    this.props.navigator.push({
      screen: "Client.CollegeDetailsScreen",
      title: "College",
      passProps: {
        selectedCollege: selCollege
      }
    });
  };

  onLayout(e) {
    const { width, height } = Dimensions.get("window");
    this.setState({
      width: width,
      height: height
    });
  }

  pdfHandler = () => {
    check(ANDROID_PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log("the feature is not available on this device");
            break;
          case RESULTS.GRANTED: {
            if (
              this.state.status === false &&
              this.state.coursesTotal === false &&
              this.state.researchTotal === false &&
              this.state.journalTotal === false &&
              this.state.lastUpdate === false &&
              this.state.deletedColleges === false
            ) {
              Alert.alert("Message", "Please check at least one");
            } else {
              const name =
                this.props.auth.user.firstName +
                " " +
                this.props.auth.user.middleName +
                " " +
                this.props.auth.user.lastName;

              const reportData = {
                status: this.state.status,
                coursesTotal: this.state.coursesTotal,
                researchTotal: this.state.researchTotal,
                journalTotal: this.state.journalTotal,
                lastUpdate: this.state.lastUpdate,
                deletedColleges: this.state.deletedColleges,
                android: true,
                colleges: this.props.college.colleges,
                typeOfReport: "List of Colleges",
                printedBy: name
              };

              this.props.createReportForColleges(reportData);
              Alert.alert(
                "Message",
                "Please wait while your report is being generated"
              );
              this.setState({ visibleModal: null });
            }
            break;
          }

          case RESULTS.DENIED: {
            request(ANDROID_PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(res => {
              if (res === "granted") {
                if (
                  this.state.status === false &&
                  this.state.coursesTotal === false &&
                  this.state.researchTotal === false &&
                  this.state.journalTotal === false &&
                  this.state.lastUpdate === false &&
                  this.state.deletedColleges === false
                ) {
                  Alert.alert("Message", "Please check at least one");
                } else {
                  const name =
                    this.props.auth.user.firstName +
                    " " +
                    this.props.auth.user.middleName +
                    " " +
                    this.props.auth.user.lastName;

                  const reportData = {
                    status: this.state.status,
                    coursesTotal: this.state.coursesTotal,
                    researchTotal: this.state.researchTotal,
                    journalTotal: this.state.journalTotal,
                    lastUpdate: this.state.lastUpdate,
                    deletedColleges: this.state.deletedColleges,
                    android: true,
                    colleges: this.props.college.colleges,
                    typeOfReport: "List of Colleges",
                    printedBy: name
                  };

                  this.props.createReportForColleges(reportData);
                  this.setState({ visibleModal: null });
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

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={{ color: "white" }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  renderModalContent = () => {
    const {
      status,
      coursesTotal,
      researchTotal,
      journalTotal,
      lastUpdate,
      deletedColleges
    } = this.state;

    return (
      <View style={styles.modalContent}>
        <View style={{ width: "100%" }}>
          <Text>Create Report</Text>
          <Text>Filter</Text>

          <CheckBox
            checked={status}
            title="Status"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                status: !status
              });
            }}
          />

          <CheckBox
            checked={coursesTotal}
            title="Number of Course"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                coursesTotal: !coursesTotal
              });
            }}
          />

          <CheckBox
            checked={researchTotal}
            title="Number of Researches"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                researchTotal: !researchTotal
              });
            }}
          />

          <CheckBox
            checked={journalTotal}
            title="Number of Journals"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                journalTotal: !journalTotal
              });
            }}
          />

          <CheckBox
            checked={lastUpdate}
            title="Last Update"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                lastUpdate: !lastUpdate
              });
            }}
          />

          <CheckBox
            checked={deletedColleges}
            title="Include Deleted Colleges"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                deletedColleges: !deletedColleges
              });
            }}
          />
        </View>

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
          {this.renderButton("Cancel", () =>
            this.setState({ visibleModal: null })
          )}
        </View>
      </View>
    );
  };

  render() {
    const { colleges, loading } = this.props.college;
    let collegeLayout;
    let activeContainer = <View />;
    let notActiveContainer = <View />;

    if (this.state.connection === "none") {
      collegeLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Internet Connection</Text>
        </View>
      );
    } else {
      if (colleges === null || loading) {
        collegeLayout = (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Spinner />
          </View>
        );
      } else {
        if (colleges.length >= 0) {
          const active = colleges.filter(college => {
            return college.deleted === 0;
          });

          if (active.length <= 0) {
            activeContainer = (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                <TextHeading>No Data Found</TextHeading>
              </View>
            );
          } else {
            {
              this.state.selectedList === 0
                ? (activeContainer = (
                    <Flatlists
                      collegeData={active}
                      onItemSelected={this.itemSelectedHandler}
                      width={this.state.width}
                      height={this.state.height}
                    />
                  ))
                : (activeContainer = (
                    <Gridlists
                      collegeData={active}
                      onItemSelected={this.itemSelectedHandler}
                      width={this.state.width}
                      height={this.state.height}
                    />
                  ));
            }
          }

          const notActive = colleges.filter(college => {
            return college.deleted === 1;
          });

          if (notActive.length <= 0) {
            notActiveContainer = (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center"
                }}
              >
                <TextHeading>No Data Found</TextHeading>
              </View>
            );
          } else {
            {
              this.state.selectedList === 0
                ? (notActiveContainer = (
                    <Flatlists
                      collegeData={notActive}
                      onItemSelected={this.itemSelectedHandler}
                      width={this.state.width}
                      height={this.state.height}
                    />
                  ))
                : (notActiveContainer = (
                    <Gridlists
                      collegeData={notActive}
                      onItemSelected={this.itemSelectedHandler}
                      width={this.state.width}
                      height={this.state.height}
                    />
                  ));
            }
          }
        }

        collegeLayout = (
          <View style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
              <ImageBackground
                source={bgImage}
                style={[styles.scontainer, { height: 120 }]}
              >
                <View style={styles.overlay}>
                  {this.state.selectedTab === 0 ? (
                    <View style={{ alignItems: "center" }}>
                      <Text style={[styles.textStyle, { fontSize: 23 }]}>
                        Colleges
                      </Text>
                      <Text style={[styles.textStyle, { fontSize: 19 }]}>
                        See all colleges and their informations
                      </Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ fontSize: 23, color: "#dc3545" }}>
                        College Bin
                      </Text>
                      <Text style={[styles.textStyle, { fontSize: 19 }]}>
                        List of Deactivated Colleges
                      </Text>
                    </View>
                  )}
                </View>
              </ImageBackground>

              <View style={{ alignItems: "center" }}>
                <View onLayout={this.onLayout.bind(this)} />
                <Modal
                  isVisible={this.state.visibleModal === 1}
                  onBackdropPress={() => this.setState({ visibleModal: null })}
                >
                  {this.renderModalContent()}
                </Modal>

                <View style={styles.buttonsContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10
                    }}
                  >
                    <Text style={{ fontSize: 18, color: "black" }}>View: </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ selectedList: 0 });
                      }}
                    >
                      <MaterialCommunityIcons
                        name="view-list"
                        size={37}
                        color={
                          this.state.selectedList === 0 ? "#007bff" : "#66b0ff"
                        }
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ selectedList: 1 });
                      }}
                    >
                      <MaterialCommunityIcons
                        name="view-grid"
                        size={30}
                        color={
                          this.state.selectedList === 1 ? "#007bff" : "#66b0ff"
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  {this.state.selectedTab === 1 ? (
                    <View style={{ width: "30%" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ selectedTab: 0 });
                        }}
                      >
                        <View style={styles.button}>
                          <Text style={{ color: "white" }}>Colleges</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={{ width: "30%" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ selectedTab: 1 });
                        }}
                      >
                        <View style={styles.button}>
                          <Text style={{ color: "white" }}>Bin</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={{ width: "35%" }}>
                    {this.renderButton("Create Report", () =>
                      this.setState({ visibleModal: 1 })
                    )}
                  </View>
                </View>
              </View>

              {this.state.selectedTab === 0 ? (
                <View style={styles.itemsContainer}>{activeContainer}</View>
              ) : (
                <View style={styles.itemsContainer}>{notActiveContainer}</View>
              )}
            </ScrollView>
          </View>
        );
      }
    }

    return <View style={styles.container}>{collegeLayout}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },

  itemsContainer: {
    width: "100%",
    padding: 10
  },
  buttonsContainer: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center"
  },

  searchbarStyle: {
    width: "98%",
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#aaa",
    borderWidth: 5,
    borderRadius: 10,
    margin: 5
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
  },

  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },

  flexDirec: {
    flexDirection: "row",
    margin: 7,
    alignItems: "center"
  },

  scontainer: {},
  overlay: {
    backgroundColor: "rgba(66, 66, 66, 0.678)",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  textStyle: {
    color: "#f5f5f5"
  }
});

CollegeListScreen.propTypes = {
  getColleges: PropTypes.func.isRequired,
  createReportForColleges: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getColleges, createReportForColleges }
)(CollegeListScreen);
