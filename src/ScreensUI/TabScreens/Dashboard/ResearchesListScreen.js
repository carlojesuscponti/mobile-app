import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Picker
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Flatlists from "../../../Components/ResearchFlatlist/Flatlist";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getResearches } from "../../../store/actions/researchActions";
import { getColleges } from "../../../store/actions/collegeAction";

class ResearchesListScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

    this.state = {
      searchBar: ""
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

  render() {
    const { researches, loading } = this.props.research;
    let researchLayout;
    let content = (
      <TouchableOpacity onPress={this.deleteTextHandler}>
        <Icon name="ios-options" size={20} />
      </TouchableOpacity>
    );

    if (this.state.searchBar.trim() !== "") {
      content = (
        <TouchableOpacity onPress={this.deleteTextHandler}>
          <Icon name="ios-close" size={24} />
        </TouchableOpacity>
      );
    }

    if (loading) {
      researchLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
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

          <View style={{ alignItems: "center" }}>
            <Flatlists
              researchesData={researches}
              onItemSelected={this.itemSelectedHandler}
            />
          </View>
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
