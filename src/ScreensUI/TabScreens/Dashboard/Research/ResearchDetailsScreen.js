import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  WebView
} from "react-native";
import moment from "moment";
import { Card, ButtonGroup } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import ButtonWithIcon from "../../../../Components/Button/ButtonWithIcon";
import HTML from "react-native-render-html";
import ImagePicker from "react-native-image-picker";
import {
  deleteResearch,
  getResearches,
  deleteAuthor,
  addImages,
  restoreResearch,
  deleteDocument,
  addDocument
} from "../../../../store/actions/researchActions";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import RNFetchBlob from "react-native-fetch-blob";

class ResearchDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.updateIndex = this.updateIndex.bind(this);
    this.state = {
      addImageCtr: 0,
      refreshing: false,
      researchId: this.props.selectedResearchId,
      restoreCtr: 0,
      imageCtr: 0,
      pdfBase64: ""
    };
  }

  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  componentWillMount() {
    this.props.getResearches();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      console.log(JSON.stringify(nextProps.errors));
    }

    if (this.state.restoreCtr === 1) {
      //alert(JSON.stringify(this.props.college.loading));
      this.setState({
        restoreCtr: 0
      });
      this.props.navigator.pop();
    }

    if (this.state.imageCtr === 1) {
      //alert(JSON.stringify(this.props.college.loading));
      this.setState({
        imageCtr: 0
      });
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    if (!this.props.research.loading) {
      this.props.getResearches();
      this.setState({ refreshing: false });
    }
  };

  addAuthorHandler = resId => {
    this.props.navigator.push({
      screen: "Client.AddAuthorScreen",
      title: "Add Author",
      passProps: {
        researchId: resId
      }
    });
  };

  pickImageHandler = selResearch => {
    try {
      ImagePicker.launchImageLibrary({ title: "Choose Image" }, response => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else {
          let copyUri = "data:" + response.type + ";base64," + response.data;

          const data = {
            images: [copyUri],
            id: selResearch._id
          };

          this.props.addImages(data);
          this.setState({
            imageCtr: 1
          });
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

  editResearchHandler = selResearch => {
    this.props.navigator.push({
      screen: "Client.EditResearchScreen",
      title: "Edit Research",
      passProps: {
        researchData: selResearch
      }
    });
  };

  openDcoumentHandler = document => {
    this.props.navigator.push({
      screen: "Client.PDFViewerScreen",
      title: "PDF",
      passProps: {
        documentName: document
      }
    });
  };

  updateIndex(selIndex) {
    if (selIndex === 0) {
      const resData = this.props.research.researches.find(research => {
        return this.state.researchId === research._id;
      });

      DocumentPicker.show(
        {
          filetype: [DocumentPickerUtil.pdf()]
        },
        (error, response) => {
          RNFetchBlob.fs
            .readFile(response.uri, "base64")
            .then(encoded => {
              let convertedData =
                "data:" + response.type + ";base64," + encoded;

              const docuData = {
                researchId: resData._id,
                oldFile: resData.document,
                file: convertedData
              };
              console.log(JSON.stringify(docuData));

              this.props.addDocument(docuData);
            })
            .catch(error => console.log(error));
        }
      );
    }

    if (selIndex === 1) {
    }

    if (selIndex === 2) {
      const resData = this.props.research.researches.find(research => {
        return this.state.researchId === research._id;
      });
      const researchId = resData._id;
      const filename = resData.document;

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
              this.props.deleteDocument(researchId, filename);
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  activeIndex = selIndex => {
    if (selIndex === 0) {
      this.props.navigator.push({
        screen: "Client.EditResearchScreen",
        title: "Add Author",
        passProps: {
          researchId: this.state.researchId
        }
      });
    }

    if (selIndex === 1) {
      //alert(selIndex);
    }

    if (selIndex === 2) {
      const data = {
        id: this.state.researchId
      };

      Alert.alert(
        "Message",
        "Are you sure?",
        [
          {
            text: "Cancel",
            onPress: () => {
              this.props.navigator.pop();
            },
            style: "cancel"
          },
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
    }
  };

  notActiveIndex = () => {
    const data = {
      id: this.state.researchId
    };

    Alert.alert(
      "Message",
      "Are you sure?",
      [
        {
          text: "Cancel",
          onPress: () => {
            this.props.navigator.pop();
          },
          style: "cancel"
        },
        {
          text: "NO",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "YES",
          onPress: () => {
            this.props.restoreResearch(data);
            this.setState({
              restoreCtr: 1
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  openPDFPicker = () => {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.images()]
      },
      (error, response) => {
        RNFetchBlob.fs
          .readFile(response.uri, "base64")
          .then(encoded => {
            let convertedData = "data:" + response.type + ";base64," + encoded;
            console(JSON.stringify(convertedData));
          })
          .catch(error => console.error(error));
      }
    );
  };

  render() {
    const { researches, loading } = this.props;
    let researchLayout;
    const buttons = ["Update Document", "Check Document", "Remove Document"];
    const activeButtons = ["Edit Research", "Hide Research", "Move to Bin"];
    const notActive = ["Restore"];

    if (researches === null || loading || this.state.imageCtr === 1) {
      researchLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      const selResearch = this.props.research.researches.find(research => {
        return research._id === this.props.selectedResearchId;
      });
      let dateFormat = selResearch.lastUpdate;
      dateFormat = dateFormat.slice(0, 10);
      dateFormat = moment(dateFormat).format("MMM. DD, YYYY");

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
                  {selResearch.deleted === 0 ? (
                    <TouchableOpacity
                      onPress={() =>
                        this.deleteAuthorHandler(
                          selResearch._id,
                          authorInfo._id
                        )
                      }
                    >
                      <View>
                        <Icon name="md-trash" size={20} color="red" />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </View>
              ))}
            </View>
          </View>
        );
      }

      let imagesContent = (
        <View>
          <Text style={styles.textStyle}>
            No image is added in this research
          </Text>
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

      let documentButtons = (
        <View style={styles.buttonComponentStyle}>
          <ButtonWithIcon onPress={this.openPDFPicker} iconName={"md-add"}>
            Add Document
          </ButtonWithIcon>
        </View>
      );

      let documentContainer = (
        <View>
          <Text style={styles.textStyle}>
            No document is added for this research
          </Text>
        </View>
      );

      if (selResearch.document !== undefined) {
        if (selResearch.document.includes(selResearch._id)) {
          documentButtons = (
            <View style={{ width: "100%", paddingTop: 20 }}>
              <ButtonGroup
                onPress={this.updateIndex}
                buttons={buttons}
                textStyle={{ color: "black" }}
                containerStyle={{ height: 40 }}
                selectedIndex={2}
                selectedButtonStyle={{ backgroundColor: "#dc3545" }}
                buttonStyle={{ backgroundColor: "#f8f9fa" }}
              />
            </View>
          );

          documentContainer = (
            <View>
              <TouchableOpacity
                onPress={() => this.openDcoumentHandler(selResearch.document)}
              >
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: "#0056b3",
                      textDecorationLine: "underline"
                    }
                  ]}
                >
                  View Document
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
      }
      researchLayout = (
        <View style={{ flex: 1, width: "100%" }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            width="100%"
            display="flex"
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View style={{ width: "100%" }}>
              <Card>
                <View style={styles.textContainer}>
                  <Text style={[styles.textStyle, { fontSize: 30 }]}>
                    {selResearch.title}
                  </Text>
                </View>

                <View style={[styles.textContainer, { flexDirection: "row" }]}>
                  <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                    College:{" "}
                  </Text>
                  <View style={{ width: "80%" }}>
                    <Text style={styles.textStyle}>{selResearch.college}</Text>
                  </View>
                </View>

                <View style={[styles.textContainer, { flexDirection: "row" }]}>
                  <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                    Course:{" "}
                  </Text>
                  <View style={{ width: "80%" }}>
                    <Text style={styles.textStyle}>{selResearch.course}</Text>
                  </View>
                </View>

                <View style={[styles.textContainer, { flexDirection: "row" }]}>
                  <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                    Pages:{" "}
                  </Text>
                  <View style={{ width: "80%" }}>
                    <Text style={styles.textStyle}>{selResearch.pages}</Text>
                  </View>
                </View>

                <View style={[styles.textContainer, { flexDirection: "row" }]}>
                  <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                    School Year:{" "}
                  </Text>
                  <View style={{ width: "80%" }}>
                    <Text style={styles.textStyle}>
                      {selResearch.schoolYear}
                    </Text>
                  </View>
                </View>

                <View style={[styles.textContainer, { flexDirection: "row" }]}>
                  <Text style={[styles.textStyle, { fontWeight: "bold" }]}>
                    Updated:{" "}
                  </Text>
                  <View style={{ width: "80%" }}>
                    <Text style={styles.textStyle}>{dateFormat}</Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={{ alignItems: "center", width: "100%" }}>
              {selResearch.deleted === 0 ? (
                <ButtonGroup
                  onPress={this.activeIndex}
                  buttons={activeButtons}
                  textStyle={{ color: "black" }}
                  containerStyle={{ height: 40 }}
                  selectedIndex={2}
                  selectedButtonStyle={{
                    backgroundColor: "#dc3545",
                    alignItems: "center"
                  }}
                  buttonStyle={{ backgroundColor: "#f8f9fa" }}
                />
              ) : (
                <ButtonGroup
                  onPress={this.notActiveIndex}
                  buttons={notActive}
                  textStyle={{ color: "black" }}
                  containerStyle={{ height: 40, width: "50%" }}
                  selectedIndex={0}
                  selectedButtonStyle={{ backgroundColor: "#218838" }}
                  buttonStyle={{ backgroundColor: "#dc3545" }}
                />
              )}
            </View>

            <View>
              <Card title="Abstract" titleStyle={{ color: "#17a2b8" }}>
                <View style={{ width: "100%" }}>
                  <HTML html={selResearch.abstract} />
                </View>
              </Card>
            </View>

            <View>
              <View style={styles.buttonComponentStyle}>
                {selResearch.deleted === 0 ? (
                  <ButtonWithIcon
                    onPress={() => this.addAuthorHandler(selResearch._id)}
                    iconName={"md-add"}
                  >
                    Add Author
                  </ButtonWithIcon>
                ) : (
                  <View />
                )}
              </View>
              <Card title="Authors" titleStyle={{ color: "#17a2b8" }}>
                {authorsContent}
              </Card>
            </View>

            <View style={{ marginBottom: 10 }}>
              <View style={styles.buttonComponentStyle}>
                {selResearch.deleted === 0 ? (
                  <ButtonWithIcon
                    iconName={"md-add"}
                    onPress={() => this.pickImageHandler(selResearch)}
                  >
                    Add Images
                  </ButtonWithIcon>
                ) : (
                  <View />
                )}
              </View>

              <Card title="Images" titleStyle={{ color: "#17a2b8" }}>
                {imagesContent}
              </Card>
            </View>

            <View style={{ paddingBottom: 20 }}>
              <View>
                {selResearch.deleted === 0 ? (
                  <View>{documentButtons}</View>
                ) : (
                  <View />
                )}
              </View>
              <Card title="Document" titleStyle={{ color: "#17a2b8" }}>
                {documentContainer}
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
    margin: 5,
    flex: 1
  },
  textStyle: {
    color: "black",
    fontSize: 15
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
    marginLeft: 15,
    width: "40%"
  },
  richText: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});

ResearchDetailsScreen.propTypes = {
  deleteResearch: PropTypes.func.isRequired,
  deleteAuthor: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  addImages: PropTypes.func.isRequired,
  restoreResearch: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  addDocument: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    getResearches,
    addImages,
    deleteAuthor,
    deleteResearch,
    restoreResearch,
    deleteDocument,
    addDocument
  }
)(ResearchDetailsScreen);
