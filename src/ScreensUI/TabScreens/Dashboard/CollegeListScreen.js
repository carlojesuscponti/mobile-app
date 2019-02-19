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
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { connect } from "react-redux";
import Flatlists from "../../../Components/CollegeFlatlist/Flatlist";
import PropTypes from "prop-types";
import { getColleges } from "../../../store/actions/collegeAction";

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
      refreshing: false
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

  textInputHandler = val => {
    this.setState({
      searchBarEmpty: val
    });
  };

  deleteTextHandler = () => {
    this.setState({
      searchBarEmpty: ""
    });
  };

  render() {
    const { colleges, loading } = this.props.college;

    let collegeLayout;

    let content = <View />;

    if (this.state.searchBarEmpty.trim() !== "") {
      content = (
        <TouchableOpacity onPress={this.deleteTextHandler}>
          <Icon name="ios-close" size={24} />
        </TouchableOpacity>
      );
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
        <View style={{ flex: 1 }}>
          <View style={styles.searchbarStyle}>
            <View style={{ width: "10%" }}>
              <Icon name="ios-search" size={22} style={{ paddingLeft: 10 }} />
            </View>
            <View style={{ width: "83%" }}>
              <TextInput
                placeholder="Search"
                style={{ paddingLeft: 10 }}
                onChangeText={this.textInputHandler}
                value={this.state.searchBarEmpty}
              />
            </View>
            <View style={{ width: "7%" }}>{content}</View>
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
            <View style={{ alignItems: "center" }}>
              <Flatlists
                collegeData={colleges}
                onItemSelected={this.itemSelectedHandler}
              />
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
    flex: 1
  },
  listItem: {
    width: "100%",
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#eee",
    flexDirection: "row",
    alignItems: "center"
  },

  collegeLogo: {
    marginRight: 8,
    height: 30,
    width: 30
  },

  listContainer: {
    width: "100%"
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
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getColleges }
)(CollegeListScreen);

/*

          <TextInput placeholder="Search" style={{ paddingLeft: 10 }} />
          <Icon name="ios-search" size={20} style={{ paddingLeft: 10 }} />


  college: state.college

  CollegeListScreen.propTypes = {
    getColleges: PropTypes.func.isRequired,
    college: PropTypes.object.isRequired
  };

       {this.props.CollegeData.map(({ id, collegeName, logo }) => (
          <View key={id}>
            <Text>{collegeName}</Text>
            <Image source={logo} style={{ width: 100, height: 100 }} />
          </View>
        ))}


            let listItem = (
      <TouchableOpacity>
        {this.state.collegeInfo.map(({ id, collegeName, logo }) => (
          <View key={id} style={styles.listItem}>
            <Image source={logo} style={styles.collegeLogo} />
            <Text>{collegeName}</Text>
          </View>
        ))}
      </TouchableOpacity>
    );

*/
