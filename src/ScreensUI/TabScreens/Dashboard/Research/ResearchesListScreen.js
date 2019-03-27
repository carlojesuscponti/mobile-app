import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  Picker,
  RefreshControl,
  ScrollView,
  Alert,
  ImageBackground
} from "react-native";
import { CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import Flatlists from "../../../../Components/ResearchFlatlist/Flatlist";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getResearches,
  createReportForResearches
} from "../../../../store/actions/researchActions";
import TextHeading from "../../../../Components/Text/TextHeading";
import {
  check,
  request,
  ANDROID_PERMISSIONS,
  RESULTS
} from "react-native-permissions";
import bgImage from "../../../../Pictures/library.jpg";
import Spinner from "../../../../Components/Spinner/Spinner";

class ResearchesListScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

    this.state = {
      originalResearchData: [],
      copyResearchData: [],
      searchBar: "",
      refreshing: false,
      selectedTab: 0,
      options: "",
      visibleModal: null,
      onlinePaging: 0,

      status: true,
      researchId: true,
      college: true,
      course: true,
      type: true,
      pages: true,
      academicYear: true,
      lastUpdate: true,
      deletedResearches: false
    };
    this.copyActiveArrayHolder = [];
    this.copyDeletedArrayHolder = [];
  }

  componentWillMount() {
    if (!this.props.research.loading) {
      this.props.getResearches();
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
          screen: "Client.AddResearchScreen",
          title: "Add Research"
        });
      }
    }
  };

  textInputHandler = val => {
    this.setState({
      searchBar: val,
      onlinePaging: 0
    });
  };

  deleteTextHandler = () => {
    this.setState({
      searchBar: ""
    });
  };

  itemSelectedHandler = key => {
    this.props.navigator.push({
      screen: "Client.ResearchDetailsScreen",
      title: "Research",
      passProps: {
        selectedResearchId: key
      }
    });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    if (!this.props.research.loading) {
      this.props.getResearches();
      this.setState({ refreshing: false });
    }
  };

  onlineChangePicker = selected => {
    this.setState({
      options: selected,
      onlinePaging: 0
    });
  };

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button, { marginBottom: 8 }]}>
        <Text style={{ color: "white" }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  onlinePaginationPrevHandler = () => {
    this.setState({
      onlinePaging: (this.state.onlinePaging -= 1)
    });
  };

  onlinePaginationNextHandler = () => {
    this.setState({
      onlinePaging: (this.state.onlinePaging += 1)
    });
  };

  render() {
    const { researches, loading, changeStatus } = this.props.research;
    let researchLayout;
    let activeResearchContainer = <View />;
    let deletedResearchContainer = <View />;
    if (researches === null || loading || changeStatus) {
      researchLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner />
        </View>
      );
    } else {
      this.copyActiveArrayHolder = [];
      this.copyDeletedArrayHolder = [];

      if (
        JSON.stringify(researches) === "[]" ||
        JSON.stringify(researches) === "{}" ||
        loading
      ) {
        researchLayout = (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Spinner />
          </View>
        );
      } else {
        let activeResearch = researches.filter(research => {
          return research.deleted === 0;
        });

        let deletedResearch = researches.filter(research => {
          return research.deleted === 1;
        });

        if (activeResearch.length >= 1) {
          if (this.state.searchBar !== "") {
            const textData = this.state.searchBar.toUpperCase();
            let title = activeResearch.filter(research => {
              const itemData = research.title
                ? research.title.toUpperCase()
                : "".toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            let college = activeResearch.filter(research => {
              const itemData = research.college
                ? research.college.toUpperCase()
                : "".toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            let course = activeResearch.filter(research => {
              const itemData = research.course
                ? research.course.toUpperCase()
                : "".toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            const filteredData = [
              ...new Set([...title, ...college, ...course])
            ];
            activeResearch = filteredData;
          }

          try {
            activeResearch = activeResearch.sort((a, b) => {
              var titleA = a.title.toLowerCase(),
                titleB = b.title.toLowerCase(),
                collegeA = a.college.toLowerCase(),
                collegeB = b.college.toLowerCase(),
                courseA = a.course.toLowerCase(),
                courseB = b.course.toLowerCase(),
                dateA = new Date(a.lastUpdate.date),
                dateB = new Date(b.lastUpdate.date);

              if (this.state.options === "Title Ascending") {
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
              }
              if (this.state.options === "Title Descending") {
                if (titleB < titleA) return -1;
                if (titleB > titleA) return 1;
                return 0;
              }
              if (this.state.options === "College Ascending") {
                if (collegeA < collegeB) return -1;
                if (collegeA > collegeB) return 1;
                return 0;
              }
              if (this.state.options === "College Descending") {
                if (collegeB < collegeA) return -1;
                if (collegeB > collegeA) return 1;
                return 0;
              }
              if (this.state.options === "Course Ascending") {
                if (courseA < courseB) return -1;
                if (courseA > courseB) return 1;
                return 0;
              }
              if (this.state.options === "Course Descending") {
                if (courseB < courseA) return -1;
                if (courseB > courseA) return 1;
                return 0;
              }
              if (this.state.options === "Date Ascending") {
                return dateA - dateB;
              }
              if (this.state.options === "Date Descending") {
                return dateB - dateA;
              }
            });
          } catch (err) {
            console.log(JSON.stringify(err));
          }

          for (
            let i = 0, j = 0, length = activeResearch.length;
            i < length;
            i += 10, j++
          ) {
            this.copyActiveArrayHolder[j] = activeResearch.slice(i, i + 10);
          }
          activeResearchContainer = (
            <Flatlists
              researchesData={
                this.copyActiveArrayHolder[this.state.onlinePaging]
              }
              onItemSelected={this.itemSelectedHandler}
            />
          );
        }

        if (activeResearch.length <= 0) {
          activeResearchContainer = (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <TextHeading>No records to display</TextHeading>
            </View>
          );
        }

        if (deletedResearch.length >= 0) {
          if (this.state.searchBar !== "") {
            const textData = this.state.searchBar.toUpperCase();
            let title = deletedResearch.filter(research => {
              const itemData = research.title
                ? research.title.toUpperCase()
                : "".toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            let college = deletedResearch.filter(research => {
              const itemData = research.college
                ? research.college.toUpperCase()
                : "".toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            let course = deletedResearch.filter(research => {
              const itemData = research.course
                ? research.course.toUpperCase()
                : "".toUpperCase();
              return itemData.indexOf(textData) > -1;
            });
            const filteredData = [
              ...new Set([...title, ...college, ...course])
            ];
            deletedResearch = filteredData;
          }

          try {
            deletedResearch = deletedResearch.sort((a, b) => {
              var titleA = a.title.toLowerCase(),
                titleB = b.title.toLowerCase(),
                collegeA = a.college.toLowerCase(),
                collegeB = b.college.toLowerCase(),
                courseA = a.course.toLowerCase(),
                courseB = b.course.toLowerCase(),
                dateA = new Date(a.lastUpdate.date),
                dateB = new Date(b.lastUpdate.date);
              if (this.state.options === "Title Ascending") {
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
              }
              if (this.state.options === "Title Descending") {
                if (titleB < titleA) return -1;
                if (titleB > titleA) return 1;
                return 0;
              }
              if (this.state.options === "College Ascending") {
                if (collegeA < collegeB) return -1;
                if (collegeA > collegeB) return 1;
                return 0;
              }
              if (this.state.options === "College Descending") {
                if (collegeB < collegeA) return -1;
                if (collegeB > collegeA) return 1;
                return 0;
              }
              if (this.state.options === "Course Ascending") {
                if (courseA < courseB) return -1;
                if (courseA > courseB) return 1;
                return 0;
              }
              if (this.state.options === "Course Descending") {
                if (courseB < courseA) return -1;
                if (courseB > courseA) return 1;
                return 0;
              }
              if (this.state.options === "Date Ascending") {
                return dateA - dateB;
              }
              if (this.state.options === "Date Descending") {
                return dateB - dateA;
              }
            });
          } catch (err) {
            console.log(JSON.stringify(err));
          }
          for (
            let i = 0, j = 0, length = deletedResearch.length;
            i < length;
            i += 10, j++
          ) {
            this.copyDeletedArrayHolder[j] = deletedResearch.slice(i, i + 10);
          }
          deletedResearchContainer = (
            <Flatlists
              researchesData={
                this.copyDeletedArrayHolder[this.state.onlinePaging]
              }
              onItemSelected={this.itemSelectedHandler}
            />
          );
        }

        if (deletedResearch.length <= 0) {
          deletedResearchContainer = (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center"
              }}
            >
              <TextHeading>No records to display</TextHeading>
            </View>
          );
        }

        researchLayout = (
          <View style={{ flex: 1 }}>
            <Modal
              isVisible={this.state.visibleModal === 1}
              onBackdropPress={() => this.setState({ visibleModal: null })}
            >
              {this.renderModalContent()}
            </Modal>
            <ScrollView
              ref={ref => (this.listView = ref)}
              onContentSizeChange={() => {
                this.listView.scrollTo({ y: 10 });
              }}
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
                        Researches
                      </Text>
                      <Text style={[styles.textStyle, { fontSize: 19 }]}>
                        See all research and it's informations
                      </Text>
                    </View>
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ fontSize: 23, color: "#dc3545" }}>
                        Research Bin
                      </Text>
                      <Text style={[styles.textStyle, { fontSize: 19 }]}>
                        List of Removed Researches
                      </Text>
                    </View>
                  )}
                </View>
              </ImageBackground>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "95%",
                    alignSelf: "center",
                    marginTop: 15,
                    marginBottom: 15
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      width: "40%"
                    }}
                  >
                    <View style={{ marginRight: 5 }}>
                      <Text style={{ color: "black", fontSize: 18 }}>
                        Sort By:
                      </Text>
                    </View>
                    <View
                      style={[styles.pickerStyle, { width: "70%", height: 50 }]}
                    >
                      <Picker
                        selectedValue={this.state.options}
                        onValueChange={this.onlineChangePicker}
                      >
                        <Picker.Item label="Select" value="" />
                        <Picker.Item
                          label="Title Ascending"
                          value="Title Ascending"
                        />
                        <Picker.Item
                          label="Title Descending"
                          value="Title Descending"
                        />
                        <Picker.Item
                          label="College Ascending"
                          value="College Ascending"
                        />
                        <Picker.Item
                          label="College Descending"
                          value="College Descending"
                        />
                        <Picker.Item
                          label="Course Ascending"
                          value="Course Ascending"
                        />
                        <Picker.Item
                          label="Course Descending"
                          value="Course Descending"
                        />
                        {/* <Picker.Item
                          label="Date Ascending"
                          value="Date Ascending"
                        />
                        <Picker.Item
                          label="Date Descending"
                          value="Date Descending"
                        /> */}
                        <Picker.Item label="Status" value="Status" />
                      </Picker>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.searchbarStyle,
                      { alignSelf: "center", width: "60%" }
                    ]}
                  >
                    <View
                      style={{
                        width: "10%",
                        alignItems: "center"
                      }}
                    >
                      <Icon name="ios-search" size={22} />
                    </View>
                    <View style={{ width: "75%" }}>
                      <TextInput
                        placeholder="Search"
                        style={{ paddingLeft: 15 }}
                        onChangeText={this.textInputHandler}
                        value={this.state.searchBar}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  marginBottom: 5,
                  width: "80%",
                  justifyContent: "space-between"
                }}
              >
                {this.state.selectedTab === 1 ? (
                  <View style={{ width: "40%" }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ selectedTab: 0, onlinePaging: 0 });
                      }}
                    >
                      <View style={[styles.button, { marginBottom: 8 }]}>
                        <Text style={{ color: "white" }}>Researches</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ width: "35%" }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ selectedTab: 1, onlinePaging: 0 });
                      }}
                    >
                      <View style={[styles.button, { marginBottom: 8 }]}>
                        <Text style={{ color: "white" }}>Bin</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                <View style={{ width: "40%" }}>
                  {this.renderButton("Create Report", () =>
                    this.setState({ visibleModal: 1 })
                  )}
                </View>
              </View>
              {this.state.selectedTab === 0 ? (
                <View style={styles.itemsContainer}>
                  {activeResearchContainer}
                </View>
              ) : (
                <View style={styles.itemsContainer}>
                  {deletedResearchContainer}
                </View>
              )}

              {(this.state.selectedTab === 1 && deletedResearch.length === 0) ||
              (this.state.selectedTab === 0 && activeResearch.length === 0) ? (
                <View />
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    marginTop: 10
                  }}
                >
                  <TouchableNativeFeedback
                    onPress={this.onlinePaginationPrevHandler}
                    disabled={this.state.onlinePaging === 0 ? true : false}
                  >
                    <View
                      style={[
                        styles.PNbutton,
                        {
                          backgroundColor:
                            this.state.onlinePaging === 0
                              ? "#66b0ff"
                              : "#007bff"
                        }
                      ]}
                    >
                      <Text style={{ color: "white" }}>Previous</Text>
                    </View>
                  </TouchableNativeFeedback>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text style={{ color: "black", fontSize: 18 }}>
                      Page{" "}
                      {this.state.onlinePaging.length === 0
                        ? 0
                        : this.state.onlinePaging + 1}{" "}
                      of{" "}
                      {this.state.selectedTab === 0
                        ? this.copyActiveArrayHolder.length
                        : this.copyDeletedArrayHolder.length}{" "}
                    </Text>
                  </View>
                  <TouchableNativeFeedback
                    onPress={this.onlinePaginationNextHandler}
                    disabled={
                      this.state.selectedTab === 0
                        ? this.state.onlinePaging ===
                          this.copyActiveArrayHolder.length - 1
                          ? true
                          : false
                        : this.state.onlinePaging ===
                          this.copyDeletedArrayHolder.length - 1
                        ? true
                        : false
                    }
                  >
                    <View
                      style={[
                        styles.PNbutton,
                        {
                          backgroundColor:
                            this.state.selectedTab === 0
                              ? this.state.onlinePaging ===
                                this.copyActiveArrayHolder.length - 1
                                ? "#66b0ff"
                                : "#007bff"
                              : this.state.onlinePaging ===
                                this.copyDeletedArrayHolder.length - 1
                              ? "#66b0ff"
                              : "#007bff"
                        }
                      ]}
                    >
                      <Text style={{ color: "white" }}>Next</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )}
            </ScrollView>
          </View>
        );
      }
    }

    return <View style={styles.container}>{researchLayout}</View>;
  }

  renderModalContent = () => {
    const {
      status,
      researchId,
      college,
      course,
      type,
      pages,
      academicYear,
      lastUpdate,
      deletedResearches
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
            checked={researchId}
            title="Research ID"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                researchId: !researchId
              });
            }}
          />

          <CheckBox
            checked={college}
            title="College"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                college: !college
              });
            }}
          />
          <CheckBox
            checked={course}
            title="Course"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                course: !course
              });
            }}
          />

          <CheckBox
            checked={type}
            title="Research Type"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                type: !type
              });
            }}
          />

          <CheckBox
            checked={pages}
            title="Pages"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                pages: !pages
              });
            }}
          />

          <CheckBox
            checked={academicYear}
            title="Academic Year"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                academicYear: !academicYear
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
            checked={deletedResearches}
            title="Include Deleted Colleges"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                deletedResearches: !deletedResearches
              });
            }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={this.pdfHandler}
            disabled={this.props.research.buttonDisable}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor: this.props.research.buttonDisable
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
              this.state.researchId === false &&
              this.state.college === false &&
              this.state.course === false &&
              this.state.type === false &&
              this.state.pages === false &&
              this.state.academicYear === false &&
              this.state.lastUpdate === false &&
              this.state.deletedResearches === false
            ) {
              Alert.alert("Message", "Please check at least one");
            } else {
              const name =
                this.props.auth.user.firstName +
                " " +
                this.props.auth.user.middleName +
                " " +
                this.props.auth.user.lastName;

              const researchesReportData = {
                status: this.state.status,
                researchId: this.state.researchId,
                college: this.state.college,
                course: this.state.course,
                type: this.state.type,
                pages: this.state.pages,
                academicYear: this.state.academicYear,
                lastUpdate: this.state.lastUpdate,
                deletedResearches: this.state.deletedResearches,
                android: true,
                researches: this.props.research.researches,
                typeOfReport: "Researches Report",
                printedBy: name
              };

              this.props.createReportForResearches(researchesReportData);
              this.setState({ visibleModal: null });
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
                  this.state.status === false &&
                  this.state.researchId === false &&
                  this.state.college === false &&
                  this.state.course === false &&
                  this.state.type === false &&
                  this.state.pages === false &&
                  this.state.academicYear === false &&
                  this.state.lastUpdate === false &&
                  this.state.deletedResearches === false
                ) {
                  Alert.alert("Message", "Please check at least one");
                } else {
                  const name =
                    this.props.auth.user.firstName +
                    " " +
                    this.props.auth.user.middleName +
                    " " +
                    this.props.auth.user.lastName;

                  const researchesReportData = {
                    status: this.state.status,
                    researchId: this.state.researchId,
                    college: this.state.college,
                    course: this.state.course,
                    type: this.state.type,
                    pages: this.state.pages,
                    academicYear: this.state.academicYear,
                    lastUpdate: this.state.lastUpdate,
                    deletedResearches: this.state.deletedResearches,
                    android: true,
                    researches: this.props.research.researches,
                    typeOfReport: "Researches Report",
                    printedBy: name
                  };

                  this.props.createReportForResearches(researchesReportData);
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  itemsContainer: {
    width: "100%",
    padding: 10,
    alignItems: "center"
  },

  searchbarStyle: {
    width: "98%",
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#aaa",
    borderWidth: 5,
    borderRadius: 10
  },

  button: {
    backgroundColor: "#007bff",
    padding: 12,
    marginLeft: 8,
    marginTop: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "#007bff"
  },

  PNbutton: {
    backgroundColor: "#007bff",
    width: "25%",
    padding: 12,
    marginLeft: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "#007bff"
  },

  pickerStyle: {
    width: "25%",
    height: 40,
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 0.5,
    justifyContent: "center"
  },

  sorterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },

  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
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

ResearchesListScreen.propTypes = {
  createReportForResearches: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getResearches, createReportForResearches }
)(ResearchesListScreen);
