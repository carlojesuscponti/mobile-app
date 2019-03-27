import React, { Component } from "react";
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  WebView,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Card } from "react-native-elements";
import HTMLView from "react-native-htmlview";
import { ViewResearch } from "../../../../Components/View/ViewResearch";
import Spinner from "../../../../Components/Spinner/Spinner";

class OfflineResearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offlineResearch: []
    };
  }

  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  componentWillMount() {
    AsyncStorage.getItem("offlineResearches")
      .then(res => {
        let parseData = JSON.parse(res);
        const selResearch = parseData.find(research => {
          return research._id === this.props.selectedResearchId;
        });
        this.setState({
          offlineResearch: selResearch
        });
      })
      .catch(() => {
        alert("error");
      });
  }

  render() {
    let offlineResearch;
    if (this.state.offlineResearch.abstract === undefined) {
      offlineResearch = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner />
        </View>
      );
    } else {
      offlineResearch = (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ width: "100%" }}>
            <Card title="Research Details" titleStyle={{ fontSize: 18 }}>
              <ViewResearch
                label="College: "
                data={this.state.offlineResearch.college}
              />
              <ViewResearch
                label="Course: "
                data={this.state.offlineResearch.course}
              />
              <ViewResearch
                label="Research ID: "
                data={this.state.offlineResearch.researchID}
              />
              <ViewResearch
                label="Pages: "
                data={this.state.offlineResearch.pages}
              />
              <ViewResearch
                label="Academic Year: "
                data={this.state.offlineResearch.schoolYear}
              />
            </Card>
            <Card
              title="Abstract"
              titleStyle={{ fontSize: 18 }}
              containerStyle={{ marginBottom: 20 }}
            >
              <HTMLView
                value={`<p>${this.state.offlineResearch.abstract}</p>`}
                stylesheet={styles}
              />
            </Card>
          </View>
        </ScrollView>
      );
    }
    return <View style={styles.container}>{offlineResearch}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  p: {
    color: "#000",
    fontSize: 18
  }
});

export default OfflineResearchScreen;
