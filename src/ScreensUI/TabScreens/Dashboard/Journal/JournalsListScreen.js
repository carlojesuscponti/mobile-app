import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Picker,
  TouchableNativeFeedback,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ImageBackground,
  Image,
  NetInfo
} from "react-native";
import { CheckBox } from "react-native-elements";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getJournals,
  createReportForJournals
} from "../../../../store/actions/journalAction";
import Icon from "react-native-vector-icons/Ionicons";
import Flatlists from "../../../../Components/JournalFlatlist/Flatlist";
import Modal from "react-native-modal";
import {
  check,
  request,
  ANDROID_PERMISSIONS,
  RESULTS
} from "react-native-permissions";
import bgImage from "../../../../Pictures/journals.jpg";
import TextHeading from "../../../../Components/Text/TextHeading";
import Spinner from "../../../../Components/Spinner/Spinner";

class JournalsListScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    this.state = {
      originalJournalData: [],
      copyJournalData: [],
      refreshing: false,
      searchBar: "",
      connection: "",
      options: "",
      paging: 0,
      selectedTab: 0,
      visibleModal: null,

      //Generate Report
      status: true,
      issn: true,
      college: true,
      course: true,
      pages: true,
      yearPublished: true,
      lastUpdate: true,
      deletedJournals: false
    };

    this.copyActiveArrayHolder = [];
    this.copyDeletedArrayHolder = [];
  }

  componentWillMount() {
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

    if (!this.props.journal.loading) {
      this.props.getJournals();
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
          screen: "Client.AddJournalScreen",
          title: "Add Journal"
        });
      }
    }
  };

  onItemSelectedHandler = key => {
    this.props.navigator.push({
      screen: "Client.JournalDetailsScreen",
      title: "Journal",
      passProps: {
        selectedJournalId: key
      }
    });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    if (!this.props.journal.loading) {
      this.props.getJournals();
      this.setState({ refreshing: false });
    }
  };

  textInputHandler = val => {
    this.setState({
      searchBar: val,
      paging: 0
    });
  };

  onChangePicker = selected => {
    this.setState({
      options: selected
    });
  };

  paginationPrevHandler = () => {
    this.setState({
      paging: (this.state.paging -= 1)
    });
  };

  paginationNextHandler = () => {
    this.setState({
      paging: (this.state.paging += 1)
    });
  };

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button, { marginBottom: 8 }]}>
        <Text style={{ color: "white" }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { journals, loading } = this.props.journal;
    let journalLayout, activeJournalLayout, deletedJournalLayout;

    if (this.state.connection === "none") {
      journalLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Internet Connection</Text>
        </View>
      );
    } else {
      if (journals === null || loading) {
        journalLayout = (
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
          JSON.stringify(journals) === "[]" ||
          JSON.stringify(journals) === "{}" ||
          loading
        ) {
          journalLayout = (
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
          let activeJournal = journals.filter(journal => {
            return journal.deleted === 0;
          });

          let deletedJournal = journals.filter(journal => {
            return journal.deleted === 1;
          });

          //Active Data
          if (activeJournal.length <= 0) {
            activeJournalLayout = (
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

          if (activeJournal.length >= 1) {
            if (this.state.searchBar !== "") {
              const textData = this.state.searchBar.toUpperCase();
              let title = journals.filter(journal => {
                const itemData = journal.title
                  ? journal.title.toUpperCase()
                  : "".toUpperCase();
                return itemData.indexOf(textData) > -1;
              });

              let college = journals.filter(journal => {
                const itemData = journal.college
                  ? journal.college.toUpperCase()
                  : "".toUpperCase();
                return itemData.indexOf(textData) > -1;
              });

              let course = journals.filter(journal => {
                const itemData = journal.course
                  ? journal.course.toUpperCase()
                  : "".toUpperCase();
                return itemData.indexOf(textData) > -1;
              });

              const filteredData = [
                ...new Set([...title, ...college, ...course])
              ];

              activeJournal = filteredData;
            }

            try {
              activeJournal = activeJournal.sort((a, b) => {
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
              let i = 0, j = 0, length = activeJournal.length;
              i < length;
              i += 10, j++
            ) {
              this.copyActiveArrayHolder[j] = activeJournal.slice(i, i + 10);
            }

            activeJournalLayout = (
              <Flatlists
                journalsData={this.copyActiveArrayHolder[this.state.paging]}
                onItemSelected={this.onItemSelectedHandler}
              />
            );
          }
          //Active Data

          //Deleted Data
          if (deletedJournal.length <= 0) {
            deletedJournalLayout = (
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

          if (deletedJournal.length >= 1) {
            try {
              deletedJournal = deletedJournal.sort((a, b) => {
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
              let i = 0, j = 0, length = deletedJournal.length;
              i < length;
              i += 10, j++
            ) {
              this.copyDeletedArrayHolder[j] = deletedJournal.slice(i, i + 10);
            }

            deletedJournalLayout = (
              <Flatlists
                journalsData={this.copyDeletedArrayHolder[this.state.paging]}
                onItemSelected={this.onItemSelectedHandler}
              />
            );
          }
          //Deleted Data

          //All Layout
          journalLayout = (
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
                          Journals
                        </Text>
                        <Text style={[styles.textStyle, { fontSize: 19 }]}>
                          See all journal and it's informations
                        </Text>
                      </View>
                    ) : (
                      <View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 23, color: "#dc3545" }}>
                          Journal Bin
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
                        style={[
                          styles.pickerStyle,
                          { width: "70%", height: 50 }
                        ]}
                      >
                        <Picker
                          selectedValue={this.state.options}
                          onValueChange={this.onChangePicker}
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
                      {this.renderButton("Journals", () =>
                        this.setState({ selectedTab: 0, paging: 0 })
                      )}
                    </View>
                  ) : (
                    <View style={{ width: "40%" }}>
                      {this.renderButton("Bin", () =>
                        this.setState({ selectedTab: 1, paging: 0 })
                      )}
                    </View>
                  )}

                  <View style={{ width: "40%" }}>
                    {this.renderButton("Create Report", () =>
                      this.setState({ visibleModal: 1 })
                    )}
                  </View>
                </View>

                <View style={styles.itemsContainer}>
                  {this.state.selectedTab === 0
                    ? activeJournalLayout
                    : deletedJournalLayout}
                </View>

                {(this.state.selectedTab === 1 &&
                  deletedJournal.length === 0) ||
                (this.state.selectedTab === 0 && activeJournal.length === 0) ? (
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
                      onPress={this.paginationPrevHandler}
                      disabled={this.state.paging === 0 ? true : false}
                    >
                      <View
                        style={[
                          styles.PNbutton,
                          {
                            backgroundColor:
                              this.state.paging === 0 ? "#66b0ff" : "#007bff"
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
                        {this.state.paging.length === 0
                          ? 0
                          : this.state.paging + 1}{" "}
                        of{" "}
                        {this.state.selectedTab === 0
                          ? this.copyActiveArrayHolder.length
                          : this.copyDeletedArrayHolder.length}{" "}
                      </Text>
                    </View>

                    <TouchableNativeFeedback
                      onPress={this.paginationNextHandler}
                      disabled={
                        this.state.selectedTab === 0
                          ? this.state.paging ===
                            this.copyActiveArrayHolder.length - 1
                            ? true
                            : false
                          : this.state.paging ===
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
                                ? this.state.paging ===
                                  this.copyActiveArrayHolder.length - 1
                                  ? "#66b0ff"
                                  : "#007bff"
                                : this.state.paging ===
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
          //All Layout
        }
      }
    }

    return <View style={styles.container}>{journalLayout}</View>;
  }

  renderModalContent = () => {
    const {
      status,
      issn,
      college,
      course,
      pages,
      yearPublished,
      lastUpdate,
      deletedJournals
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
            checked={issn}
            title="ISSN"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                issn: !issn
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
            checked={yearPublished}
            title="Published Year"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                yearPublished: !yearPublished
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
            checked={deletedJournals}
            title="Include Deleted Journals"
            containerStyle={{ backgroundColor: "#fff", borderColor: "#fff" }}
            onPress={() => {
              this.setState({
                deletedJournals: !deletedJournals
              });
            }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={this.pdfHandler}
            disabled={this.props.journal.buttonDisable}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor: this.props.journal.buttonDisable
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
              this.state.issn === false &&
              this.state.college === false &&
              this.state.course === false &&
              this.state.pages === false &&
              this.state.yearPublished === false &&
              this.state.lastUpdate === false &&
              this.state.deletedJournals === false
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
                issn: this.state.issn,
                college: this.state.college,
                course: this.state.course,
                pages: this.state.pages,
                yearPublished: this.state.yearPublished,
                lastUpdate: this.state.lastUpdate,
                deletedJournals: this.state.deletedJournals,
                android: true,
                journals: this.props.journal.journals,
                typeOfReport: "Journals Report",
                printedBy: name
              };

              this.props.createReportForJournals(reportData);
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
                  this.state.issn === false &&
                  this.state.college === false &&
                  this.state.course === false &&
                  this.state.pages === false &&
                  this.state.yearPublished === false &&
                  this.state.lastUpdate === false &&
                  this.state.deletedJournals === false
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
                    issn: this.state.issn,
                    college: this.state.college,
                    course: this.state.course,
                    pages: this.state.pages,
                    yearPublished: this.state.yearPublished,
                    lastUpdate: this.state.lastUpdate,
                    deletedJournals: this.state.deletedJournals,
                    android: true,
                    journals: this.props.journal.journals,
                    typeOfReport: "Journals Report",
                    printedBy: name
                  };

                  this.props.createReportForJournals(reportData);
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

JournalsListScreen.propTypes = {
  journal: PropTypes.object.isRequired,
  getJournals: PropTypes.func.isRequired,
  createReportForJournals: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  journal: state.journal,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getJournals, createReportForJournals }
)(JournalsListScreen);
