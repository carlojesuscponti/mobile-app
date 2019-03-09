import React, { Component } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import PDFView from "react-native-view-pdf";

class PDFViewerScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  render() {
    let PDFUrl =
      "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchDocuments/" +
      this.props.documentName;
    return (
      <PDFView
        style={{ flex: 1, minHeight: "100%" }}
        onError={error => console.log("onError", error)}
        onLoad={() => this.setState({ loading: false })}
        resource={PDFUrl}
        resourceType="url"
      />
    );
  }
}
export default PDFViewerScreen;
