import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Button,
  ScrollView,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { connect } from "react-redux";
import Flatlists from "../../../../Components/CollegeFlatlist/Flatlist";
import Gridlists from "../../../../Components/CollegeFlatlist/GridList";
import ButtonComponent from "../../../../Components/Button/ButtonWithIcon";
import PropTypes from "prop-types";
import { getColleges } from "../../../../store/actions/collegeAction";
import TextHeading from "../../../../Components/Text/TextHeading";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
      selectedList: 0
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
      this.props.getColleges();
    }
  }

  onNavigatorEvent = event => {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "add") {
        this.props.navigator.push({
          screen: "Client.AddCollegeScreen",
          title: "Add College"
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
      width: width
    });
  }

  render() {
    const { colleges, loading } = this.props.college;
    let collegeLayout;
    let activeContainer = <View />;
    let notActiveContainer = <View />;

    if (colleges === null || loading) {
      collegeLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
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
                  />
                ))
              : (activeContainer = (
                  <Gridlists
                    collegeData={active}
                    onItemSelected={this.itemSelectedHandler}
                    width={this.state.width}
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
                  />
                ))
              : (notActiveContainer = (
                  <Gridlists
                    collegeData={notActive}
                    onItemSelected={this.itemSelectedHandler}
                    width={this.state.width}
                  />
                ));
          }
        }
      }

      collegeLayout = (
        <View style={{ flex: 1 }}>
          <View onLayout={this.onLayout.bind(this)} />

          {this.state.selectedTab === 0 ? (
            <View>
              <Text>Colleges</Text>
            </View>
          ) : (
            <View>
              <Text color="red">College Bin</Text>
            </View>
          )}
          <View style={styles.buttonsContainer}>
            {this.state.selectedTab === 1 ? (
              <View style={{ width: "50%" }}>
                <ButtonComponent
                  onPress={() => {
                    this.setState({ selectedTab: 0 });
                  }}
                >
                  College List
                </ButtonComponent>
              </View>
            ) : (
              <View style={{ width: "50%" }}>
                <ButtonComponent
                  onPress={() => {
                    this.setState({ selectedTab: 1 });
                  }}
                >
                  College Bin
                </ButtonComponent>
              </View>
            )}

            <View
              style={{
                width: "50%",
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
                  color={this.state.selectedList === 0 ? "black" : "#999999"}
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
                  color={this.state.selectedList === 1 ? "black" : "#999999"}
                />
              </TouchableOpacity>
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
              <View style={styles.itemsContainer}>{activeContainer}</View>
            ) : (
              <View style={styles.itemsContainer}>{notActiveContainer}</View>
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
    flex: 1
  },

  itemsContainer: {
    width: "100%",
    padding: 10
  },
  buttonsContainer: {
    marginLeft: 10,
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
  }
});

CollegeListScreen.propTypes = {
  getColleges: PropTypes.func.isRequired,
  college: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  errors: state.errors,
  bin: state.bin
});

export default connect(
  mapStateToProps,
  { getColleges }
)(CollegeListScreen);
