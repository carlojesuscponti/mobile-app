import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  StyleSheet,
  Picker,
  RefreshControl,
  ScrollView,
  NetInfo,
  AsyncStorage,
  ImageBackground
} from "react-native";
import { CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import Flatlists from "../../../../Components/ResearchFlatlist/Flatlist";
import bgImage from "../../../../Pictures/library.jpg";
import Spinner from "../../../../Components/Spinner/Spinner";

class OfflineResearchListScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.state = {
      searchBar: "",
      refreshing: false,
      options: "",
      connection: "",
      copyOfflineData: [],
      offlineResearch: [],
      paging: 0
    };

    this.arrayholder = [];
    this.copyArrayholder = [];
  }

  componentWillMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type === "none") {
        AsyncStorage.getItem("offlineResearches")
          .then(res => {
            let parseData = JSON.parse(res);
            let activeResearch = parseData.filter(research => {
              return research.deleted === 0 && research.hidden === 0;
            });

            this.setState({
              offlineResearch: activeResearch,
              copyOfflineData: activeResearch
            });

            this.arrayholder = activeResearch;
          })
          .catch(() => {
            alert("error");
          });
      }

      this.setState({
        connection: connectionInfo.type
      });
    });
  }

  textInputHandler = val => {
    if (this.state.connection === "none") {
      const textData = val.toUpperCase();
      let title = this.arrayholder.filter(research => {
        const itemData = research.title
          ? research.title.toUpperCase()
          : "".toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      let college = this.arrayholder.filter(research => {
        const itemData = research.college
          ? research.college.toUpperCase()
          : "".toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      let course = this.arrayholder.filter(research => {
        const itemData = research.course
          ? research.course.toUpperCase()
          : "".toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      const filteredData = [...new Set([...title, ...college, ...course])];

      this.setState({
        copyOfflineData: filteredData,
        searchBar: val,
        paging: 0
      });
    } else {
      this.setState({
        searchBar: val,
        onlinePaging: 0
      });
    }
  };

  offlineItemSelectedHandler = key => {
    this.props.navigator.push({
      screen: "Client.OfflineResearchScreen",
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

  offlineChangePicker = selected => {
    this.setState({
      options: selected,
      paging: 0
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

  render() {
    let researchLayout;
    if (
      this.state.copyOfflineData === null ||
      JSON.stringify(this.state.copyOfflineData) === "{}"
    ) {
      researchLayout(
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner />
        </View>
      );
    } else {
      this.copyArrayholder = [];
      if (
        this.state.options === "Title Ascending" ||
        this.state.options === "Title Descending" ||
        this.state.options === "College Ascending" ||
        this.state.options === "College Descending" ||
        this.state.options === "Course Ascending" ||
        this.state.options === "Course Descending"
      ) {
        try {
          this.state.copyOfflineData = this.state.copyOfflineData.sort(
            (a, b) => {
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
            }
          );
        } catch (err) {
          console.log(JSON.stringify(err));
        }
      }

      for (
        let i = 0, j = 0, length = this.state.copyOfflineData.length;
        i < length;
        i += 10, j++
      ) {
        this.copyArrayholder[j] = this.state.copyOfflineData.slice(i, i + 10);
      }

      researchLayout = (
        <View
          style={{
            flex: 1
          }}
        >
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
                      onValueChange={this.offlineChangePicker}
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

            <View style={styles.itemsContainer}>
              <Flatlists
                researchesData={this.copyArrayholder[this.state.paging]}
                onItemSelected={this.offlineItemSelectedHandler}
              />
            </View>

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
                  {this.state.copyOfflineData.length === 0
                    ? 0
                    : this.state.paging + 1}{" "}
                  of {this.copyArrayholder.length}{" "}
                </Text>
              </View>

              <TouchableNativeFeedback
                onPress={this.paginationNextHandler}
                disabled={
                  this.state.paging === this.copyArrayholder.length - 1
                    ? true
                    : false
                }
              >
                <View
                  style={[
                    styles.PNbutton,
                    {
                      backgroundColor:
                        this.state.paging === this.copyArrayholder.length - 1
                          ? "#66b0ff"
                          : "#007bff"
                    }
                  ]}
                >
                  <Text style={{ color: "white" }}>Next</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </ScrollView>
        </View>
      );
    }

    return <View style={styles.container}>{researchLayout}</View>;
  }
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

export default OfflineResearchListScreen;
