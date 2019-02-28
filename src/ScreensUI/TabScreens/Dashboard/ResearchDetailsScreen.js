import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import ButtonWithIcon from "../../../Components/Button/ButtonWithIcon";
import KeyboardSpacer from "react-native-keyboard-spacer";
import HTML from "react-native-render-html";
import ImagePicker from "react-native-image-picker";

import { deleteResearch } from "../../../store/actions/researchActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getResearches,
  deleteAuthor
} from "../../../store/actions/researchActions";

class ResearchDetailsScreen extends Component {
  constructor(props) {
    super(props);
    //this.getHTML = this.getHTML.bind(this);
    //this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }

  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  componentWillMount() {
    this.props.getResearches();
  }

  addAuthorHandler = resId => {
    this.props.navigator.push({
      screen: "Client.AddAuthorScreen",
      title: "Add Author",
      passProps: {
        researchId: resId
      }
    });
  };

  onDeleteResearchHandler = _id => {
    const data = {
      id: _id
    };

    Alert.alert(
      "Message",
      "Are you sure?",
      [
        {
          text: "NO",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "YES",
          onPress: () => {
            this.props.deleteResearch(data);
            this.props.navigator.pop();
          }
        }
      ],
      { cancelable: false }
    );
  };

  // onEditorInitialized() {
  //   this.setFocusHandlers();
  //   this.getHTML();
  // }

  // async getHTML() {
  //   const titleHtml = await this.richtext.getTitleHtml();
  //   const contentHtml = await this.richtext.getContentHtml();
  //   //alert(titleHtml + ' ' + contentHtml)
  // }

  // setFocusHandlers() {
  //   this.richtext.setTitleFocusHandler(() => {
  //     //alert('title focus');
  //   });
  //   this.richtext.setContentFocusHandler(() => {
  //     //alert('content focus');
  //   });
  // }

  pickImageHandler = () => {
    try {
      ImagePicker.launchImageLibrary({ title: "Choose Image" }, response => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          alert(JSON.stringify(response.fileName));
          // let copyUri = "data:" + response.type + ";base64," + response.data;
          // this.setState({
          //   logo: response.fileName,
          //   imageData: { uri: copyUri },
          //   selectedFile: copyUri
          // });
        }
      });
    } catch (err) {}
  };

  deleteAuthorHandler = (researchId, authorId) => {
    Alert.alert(
      "Message",
      "Are you sure?",
      [
        {
          text: "NO",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "YES",
          onPress: () => {
            this.props.deleteAuthor(researchId, authorId);
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const selResearch = this.props.research.researches.find(research => {
      return research._id === this.props.selectedResearchId;
    });

    const { researches, loading } = this.props;
    let researchLayout;

    let authorsContent = (
      <View>
        <Text style={styles.textStyle}>
          No author is added in this research
        </Text>
      </View>
    );

    if (selResearch.author.length !== 0) {
      authorsContent = (
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View
            style={{
              width: "100%"
            }}
          >
            {selResearch.author.map(authorInfo => (
              <View
                key={authorInfo._id}
                style={{ flexDirection: "row", margin: 6 }}
              >
                <View
                  style={{
                    width: "95%"
                  }}
                >
                  <Text style={styles.textStyle}>{authorInfo.name}</Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    this.deleteAuthorHandler(selResearch._id, authorInfo._id)
                  }
                >
                  <View>
                    <Icon name="md-trash" size={20} color="red" />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      );
    }

    let imagesContent = (
      <View>
        <Text style={styles.textStyle}>No image is added in this research</Text>
      </View>
    );

    if (selResearch.images.length !== 0) {
      imagesContent = (
        <View style={{ width: "100%" }}>
          {selResearch.images.map(imageInfo => (
            <View style={{ marginBottom: 5 }} key={imageInfo._id}>
              <Image
                source={{
                  uri:
                    "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchImages/" +
                    imageInfo.name
                }}
                style={{ minWidth: "100%", minHeight: 150 }}
                resizeMode="contain"
              />
            </View>
          ))}
        </View>
      );
    }

    if (researches === null || loading) {
      researchLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      researchLayout = (
        <View style={{ flex: 1, width: "100%" }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            width="100%"
            display="flex"
          >
            <View style={{ width: "100%" }}>
              <Card>
                <View style={styles.textContainer}>
                  <Text style={[styles.textStyle, { fontSize: 22 }]}>
                    {selResearch.title}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.textStyle}>
                    College: {selResearch.college}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.textStyle}>
                    Course: {selResearch.course}
                  </Text>
                </View>
              </Card>
            </View>

            <View>
              <View
                style={[styles.buttonComponentStyle, { flexDirection: "row" }]}
              >
                <ButtonWithIcon iconName={"md-create"}>
                  Edit Research
                </ButtonWithIcon>

                <ButtonWithIcon
                  iconName={"md-trash"}
                  onPress={() => this.onDeleteResearchHandler(selResearch._id)}
                >
                  Delete Research
                </ButtonWithIcon>
              </View>

              <Card title="Abstract" titleStyle={{ color: "#17a2b8" }}>
                <View style={{ width: "100%" }}>
                  <HTML html={selResearch.abstract} />
                </View>
              </Card>
            </View>

            <View>
              <View style={styles.buttonComponentStyle}>
                <ButtonWithIcon
                  onPress={() => this.addAuthorHandler(selResearch._id)}
                  iconName={"md-add"}
                >
                  Add Author
                </ButtonWithIcon>
              </View>
              <Card title="Authors" titleStyle={{ color: "#17a2b8" }}>
                {authorsContent}
              </Card>
            </View>

            <View style={{ marginBottom: 10 }}>
              <View style={styles.buttonComponentStyle}>
                <ButtonWithIcon
                  iconName={"md-add"}
                  onPress={this.pickImageHandler}
                >
                  Add Images
                </ButtonWithIcon>
              </View>

              <Card title="Images" titleStyle={{ color: "#17a2b8" }}>
                {imagesContent}
              </Card>
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
    alignItems: "center",
    flex: 1,
    width: "100%"
  },
  textContainer: {
    margin: 5
  },
  textStyle: {
    color: "black"
  },
  cardStyle: {
    color: "#17a2b8"
  },
  buttonContainer: {
    width: "40%",
    alignItems: "center"
  },
  buttonComponentStyle: {
    marginTop: 15,
    marginLeft: 15
  },
  richText: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});

ResearchDetailsScreen.propTypes = {
  deleteResearch: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research
});

export default connect(
  mapStateToProps,
  { getResearches, deleteAuthor, deleteResearch }
)(ResearchDetailsScreen);
