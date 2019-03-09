import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Picker,
  RefreshControl,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Flatlists from "../../../../Components/ResearchFlatlist/Flatlist";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getResearches } from "../../../../store/actions/researchActions";
import { getColleges } from "../../../../store/actions/collegeAction";
import MaterialTabs from "react-native-material-tabs";
import TextHeading from "../../../../Components/Text/TextHeading";
import ButtonComponent from "../../../../Components/Button/ButtonWithIcon";

class ResearchesListScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

    this.state = {
      searchBar: "",
      refreshing: false,
      selectedTab: 0,
      options: ""
    };
  }
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  componentWillMount() {
    this.props.getResearches();
    this.props.getColleges();
  }

  onNavigatorEvent = event => {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "add") {
        this.props.navigator.push({
          screen: "Client.AddResearchScreen",
          title: "Add Research"
        });
      }
    }
  };

  componentDidMount() {
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

  textInputHandler = val => {
    this.setState({
      searchBar: val
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
    if (!this.props.college.loading) {
      this.props.getColleges();
      this.setState({ refreshing: false });
    }
  };

  setTab = selectedTab => {
    this.setState({ selectedTab });
  };

  onChangePicker = selected => {
    this.setState({
      options: selected
    });
  };

  render() {
    const { researches, loading } = this.props.research;
    let researchLayout;
    let activeResearchContainer = <View />;
    let deletedResearchContainer = <View />;

    if (researches === null || loading) {
      researchLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      let content;
      if (researches.length >= 0) {
        let activeResearch = researches.filter(research => {
          return research.deleted === 0;
        });
        let deletedResearch = researches.filter(research => {
          return research.deleted === 1;
        });

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
              <TextHeading>No Data Found</TextHeading>
            </View>
          );
        } else {
          if (this.state.options === "College") {
            try {
              activeResearch = activeResearch.sort((a, b) => {
                var titleA = a.college.toLowerCase(),
                  titleB = b.college.toLowerCase();
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
              });

              deletedResearch = deletedResearch.sort((a, b) => {
                var titleA = a.college.toLowerCase(),
                  titleB = b.college.toLowerCase();
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
              });
            } catch (err) {
              console.log(JSON.stringify(err));
            }
          }

          if (this.state.options === "Course") {
            try {
              activeResearch = activeResearch.sort((a, b) => {
                var titleA = a.course.toLowerCase(),
                  titleB = b.course.toLowerCase();
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
              });

              deletedResearch = deletedResearch.sort((a, b) => {
                var titleA = a.course.toLowerCase(),
                  titleB = b.course.toLowerCase();
                if (titleA < titleB) return -1;
                if (titleA > titleB) return 1;
                return 0;
              });
            } catch (err) {
              console.log(JSON.stringify(err));
            }
          }

          if (this.state.options === "Date") {
            try {
              activeResearch = activeResearch.sort((a, b) => {
                var dateA = new Date(a.lastUpdate.date),
                  dateB = new Date(b.lastUpdate.date);
                return dateA - dateB;
              });
            } catch (err) {
              console.log(JSON.stringify(err));
            }
          }
          activeResearchContainer = (
            <Flatlists
              researchesData={activeResearch}
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
              <TextHeading>No Data Found</TextHeading>
            </View>
          );
        } else {
          deletedResearchContainer = (
            <Flatlists
              researchesData={deletedResearch}
              onItemSelected={this.itemSelectedHandler}
            />
          );
        }
      }

      if (this.state.searchBar.trim() !== "") {
        content = (
          <TouchableOpacity onPress={this.deleteTextHandler}>
            <Icon name="ios-close" size={24} />
          </TouchableOpacity>
        );
      }

      researchLayout = (
        <View style={{ flex: 1 }}>
          <View style={styles.searchbarStyle}>
            <View
              style={{ paddingLeft: 10, width: "10%", alignItems: "center" }}
            >
              <Icon name="ios-search" size={22} />
            </View>
            <View style={{ width: "80%" }}>
              <TextInput
                placeholder="Search"
                style={{ paddingLeft: 5 }}
                onChangeText={this.textInputHandler}
                value={this.state.searchBar}
              />
            </View>

            <View style={{ width: "10%", alignItems: "center" }}>
              {content}
            </View>
          </View>

          <View style={styles.sorterContainer}>
            <View style={{ marginRight: 5 }}>
              <Text style={styles.sorterTextStyle}>Sort By:</Text>
            </View>

            <View style={styles.pickerStyle}>
              <Picker
                selectedValue={this.state.options}
                onValueChange={this.onChangePicker}
              >
                <Picker.Item label="Select" value="Title" />
                <Picker.Item label="Adviser" value="Adviser" />
                <Picker.Item label="Author" value="Author" />
                <Picker.Item label="College" value="College" />
                <Picker.Item label="Course" value="Course" />
                <Picker.Item label="Date" value="Date" />
                <Picker.Item label="Type" value="Type" />
                <Picker.Item label="Status" value="Status" />
              </Picker>
            </View>

            <View style={{ marginLeft: 10 }}>
              {this.state.selectedTab === 0 ? (
                <View style={{ width: "75%" }}>
                  <ButtonComponent
                    onPress={() => {
                      this.setState({ selectedTab: 1 });
                    }}
                  >
                    Research List
                  </ButtonComponent>
                </View>
              ) : (
                <View style={{ width: "75%" }}>
                  <ButtonComponent
                    onPress={() => {
                      this.setState({ selectedTab: 0 });
                    }}
                  >
                    Research Bin
                  </ButtonComponent>
                </View>
              )}
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            {this.state.selectedTab === 0 ? (
              <View style={styles.itemsContainer}>
                {activeResearchContainer}
              </View>
            ) : (
              <View style={styles.itemsContainer}>
                {deletedResearchContainer}
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    return <View style={styles.container}>{researchLayout}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemsContainer: {
    width: "100%",
    padding: 10,
    alignItems: "center"
  },

  searchbarStyle: {
    width: "100%",
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#aaa",
    borderWidth: 5,
    borderRadius: 10
  },

  pickerStyle: {
    width: "40%",
    height: 40,
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 0.5,
    justifyContent: "center"
  },

  sorterContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },

  sorterTextStyle: {
    fontSize: 16,
    color: "black"
  }
});

ResearchesListScreen.propTypes = {
  getResearches: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired,
  college: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  college: state.college
});

export default connect(
  mapStateToProps,
  { getResearches, getColleges }
)(ResearchesListScreen);
