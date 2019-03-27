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

import {
  check,
  request,
  ANDROID_PERMISSIONS,
  RESULTS
} from "react-native-permissions";

import {
  deleteResearch,
  getResearches,
  deleteAuthor,
  addImages,
  restoreResearch,
  deleteDocument,
  addDocument,
  createReportForResearch
} from "../../../../store/actions/researchActions";

import {
  DetailsTop,
  AbstractTop,
  AuthorsTop,
  DocumentTop,
  HideTop,
  MoveToBinTop,
  PicturesTop,
  RestoreTop,
  ShowTop,
  BadgeHidden,
  BadgeDeleted,
  RemoveButton,
  ReportTop
} from "../../../../Components/Button/buttons";

import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";

import moment from "moment";
import HTMLView from "react-native-htmlview";
import { Card, ButtonGroup, CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-picker";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import RNFetchBlob from "react-native-fetch-blob";
import { ViewResearch } from "../../../../Components/View/ViewResearch";
import Modal from "react-native-modal";
import Spinner from "../../../../Components/Spinner/Spinner";

class ResearchDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.updateIndex = this.updateIndex.bind(this);
    this.updateIndexTB = this.updateIndexTB.bind(this);
    this.state = {
      refreshing: false,
      spefResearchId: this.props.selectedResearchId,
      visibleModal: null,
      imageName: "",
      selectedTab: 0,

      // Basic info
      college: true,
      course: true,
      researchId: true,
      pages: true,
      academicYear: true,
      lastUpdate: true,
      type: true,
      abstract: true,
      authors: true
    };
  }

  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  componentWillMount() {
    if (!this.props.research.loading) {
      this.props.getResearches();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      console.log(JSON.stringify(nextProps.errors));
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    if (!this.props.research.loading) {
      this.props.getResearches();
      this.setState({ refreshing: false });
    }
  };

  addAuthorHandler = res => {
    this.props.navigator.push({
      screen: "Client.AddAuthorScreen",
      title: "Add Author",
      passProps: {
        researchId: res._id,
        researchData: res
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
          const name =
            this.props.auth.user.firstName +
            " " +
            this.props.auth.user.middleName +
            " " +
            this.props.auth.user.lastName;

          const data = {
            images: [copyUri],
            id: selResearch._id,
            username: name
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
    const name =
      this.props.auth.user.firstName +
      " " +
      this.props.auth.user.middleName +
      " " +
      this.props.auth.user.lastName;

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
            this.props.deleteAuthor(researchId, authorId, name);
          }
        }
      ],
      { cancelable: false }
    );
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
        return this.state.spefResearchId === research._id;
      });

      check(ANDROID_PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log("the feature is not available on this device");
              break;
            case RESULTS.GRANTED: {
              DocumentPicker.show(
                {
                  filetype: [DocumentPickerUtil.pdf()]
                },
                (error, response) => {
                  if (response !== null) {
                    RNFetchBlob.fs
                      .readFile(response.uri, "base64")
                      .then(encoded => {
                        let convertedData =
                          "data:" + response.type + ";base64," + encoded;

                        const name =
                          this.props.auth.user.firstName +
                          " " +
                          this.props.auth.user.middleName +
                          " " +
                          this.props.auth.user.lastName;

                        const docuData = {
                          researchId: resData._id,
                          oldFile: resData.document,
                          file: convertedData,
                          username: name
                        };

                        this.props.addDocument(docuData);
                      })
                      .catch(error => console.log(error));
                  }
                }
              );
              break;
            }

            case RESULTS.DENIED: {
              request(ANDROID_PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(res => {
                if (res === "granted") {
                  DocumentPicker.show(
                    {
                      filetype: [DocumentPickerUtil.pdf()]
                    },
                    (error, response) => {
                      if (response !== null) {
                        RNFetchBlob.fs
                          .readFile(response.uri, "base64")
                          .then(encoded => {
                            let convertedData =
                              "data:" + response.type + ";base64," + encoded;

                            const name =
                              this.props.auth.user.firstName +
                              " " +
                              this.props.auth.user.middleName +
                              " " +
                              this.props.auth.user.lastName;

                            const docuData = {
                              researchId: resData._id,
                              oldFile: resData.document,
                              file: convertedData,
                              username: name
                            };

                            this.props.addDocument(docuData);
                          })
                          .catch(error => console.log(error));
                      }
                    }
                  );
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
    }

    if (selIndex === 1) {
      const resData = this.props.research.researches.find(research => {
        return this.state.spefResearchId === research._id;
      });

      const researchId = resData._id;
      const filename = resData.document;
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

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
              this.props.deleteDocument(researchId, filename, name);
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  editResearchHandler = researchId => {
    this.props.navigator.push({
      screen: "Client.EditResearchScreen",
      title: "Edit Research",
      passProps: {
        researchId: researchId
      }
    });
  };

  updateIndexTB(selIndex) {
    const resData = this.props.research.researches.find(research => {
      return this.state.spefResearchId === research._id;
    });

    if (
      selIndex === 0 ||
      selIndex === 1 ||
      selIndex === 2 ||
      selIndex === 3 ||
      selIndex === 4 ||
      selIndex === 5
    ) {
      this.setState({
        selectedTab: selIndex
      });
    }

    if (selIndex === 6 && resData.deleted === 0) {
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      const data = {
        id: resData._id,
        username: name,
        hidden: true
      };

      Alert.alert(
        "Message",
        resData.hidden === 0
          ? "Do you want to hide this research?"
          : "Do you want to show this research?",
        [
          {
            text: "NO",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "YES",
            onPress: () => {
              if (resData.hidden === 0) {
                this.props.deleteResearch(data);
                this.props.navigator.pop();
              }

              if (resData.hidden === 1) {
                this.props.restoreResearch(data);
                this.props.navigator.pop();
              }
            }
          }
        ],
        { cancelable: false }
      );
    }

    if (selIndex === 7 && resData.deleted === 0) {
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      const data = {
        id: resData._id,
        username: name
      };

      Alert.alert(
        "Message",
        "Do you want to delete this research?",
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
    }

    if (selIndex === 6 && resData.deleted === 1) {
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      const data = {
        id: resData._id,
        username: name
      };

      Alert.alert(
        "Message",
        "Do you want to restore this research?",
        [
          {
            text: "NO",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "YES",
            onPress: () => {
              this.props.restoreResearch(data);
              this.props.navigator.pop();
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  openPDFPicker = () => {
    const resData = this.props.research.researches.find(research => {
      return this.state.spefResearchId === research._id;
    });

    check(ANDROID_PERMISSIONS.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log("the feature is not available on this device");
            break;
          case RESULTS.GRANTED: {
            DocumentPicker.show(
              {
                filetype: [DocumentPickerUtil.pdf()]
              },
              (error, response) => {
                if (response !== null) {
                  RNFetchBlob.fs
                    .readFile(response.uri, "base64")
                    .then(encoded => {
                      let convertedData =
                        "data:" + response.type + ";base64," + encoded;
                      const name =
                        this.props.auth.user.firstName +
                        " " +
                        this.props.auth.user.middleName +
                        " " +
                        this.props.auth.user.lastName;

                      const docuData = {
                        researchId: resData._id,
                        oldFile: resData.document,
                        file: convertedData,
                        username: name
                      };

                      this.props.addDocument(docuData);
                    })
                    .catch(error => console.log(error));
                }
              }
            );
            break;
          }

          case RESULTS.DENIED: {
            request(ANDROID_PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(res => {
              if (res === "granted") {
                DocumentPicker.show(
                  {
                    filetype: [DocumentPickerUtil.pdf()]
                  },
                  (error, response) => {
                    if (response !== null) {
                      RNFetchBlob.fs
                        .readFile(response.uri, "base64")
                        .then(encoded => {
                          let convertedData =
                            "data:" + response.type + ";base64," + encoded;
                          const name =
                            this.props.auth.user.firstName +
                            " " +
                            this.props.auth.user.middleName +
                            " " +
                            this.props.auth.user.lastName;

                          const docuData = {
                            researchId: resData._id,
                            oldFile: resData.document,
                            file: convertedData,
                            username: name
                          };

                          this.props.addDocument(docuData);
                        })
                        .catch(error => console.log(error));
                    }
                  }
                );
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

  pictureHandler = name => {
    this.setState({ visibleModal: 1, imageName: name });
  };

  renderModalContent = () => {
    return (
      <View style={styles.modalContent}>
        <Image
          resizeMode="contain"
          source={{
            uri:
              "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchImages/" +
              this.state.imageName
          }}
          style={{ width: "100%", minHeight: 300 }}
        />
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
              this.state.college === false &&
              this.state.course === false &&
              this.state.researchId === false &&
              this.state.pages === false &&
              this.state.academicYear === false &&
              this.state.lastUpdate === false &&
              this.state.type === false &&
              this.state.abstract === false &&
              this.state.authors === false
            ) {
              Alert.alert("Message", "Please check at least one");
            } else {
              const spefResearch = this.props.research.researches.find(
                research => {
                  return this.props.selectedResearchId === research._id;
                }
              );

              const name =
                this.props.auth.user.firstName +
                " " +
                this.props.auth.user.middleName +
                " " +
                this.props.auth.user.lastName;

              const reportData = {
                // basic info
                college: this.state.college,
                course: this.state.course,
                researchId: this.state.researchId,
                pages: this.state.pages,
                academicYear: this.state.academicYear,
                lastUpdate: this.state.lastUpdate,
                type: this.state.type,
                abstract: this.state.abstract,
                authors: this.state.authors,
                android: true,
                research: spefResearch,
                typeOfReport: "Research Report",
                printedBy: name
              };

              this.props.createReportForResearch(reportData);
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
                  this.state.college === false &&
                  this.state.course === false &&
                  this.state.researchId === false &&
                  this.state.pages === false &&
                  this.state.academicYear === false &&
                  this.state.lastUpdate === false &&
                  this.state.type === false &&
                  this.state.abstract === false &&
                  this.state.authors === false
                ) {
                  Alert.alert("Message", "Please check at least one");
                } else {
                  const spefResearch = this.props.research.researches.find(
                    research => {
                      return this.props.selectedResearchId === research._id;
                    }
                  );

                  const name =
                    this.props.auth.user.firstName +
                    " " +
                    this.props.auth.user.middleName +
                    " " +
                    this.props.auth.user.lastName;

                  const reportData = {
                    // basic info
                    college: this.state.college,
                    course: this.state.course,
                    researchId: this.state.researchId,
                    pages: this.state.pages,
                    academicYear: this.state.academicYear,
                    lastUpdate: this.state.lastUpdate,
                    type: this.state.type,
                    abstract: this.state.abstract,
                    authors: this.state.authors,
                    android: true,
                    research: spefResearch,
                    typeOfReport: "Research Report",
                    printedBy: name
                  };

                  this.props.createReportForResearch(reportData);
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
  render() {
    let researchLayout;
    const buttons = ["Update", "Remove"];

    const { researches, loading, changeStatus } = this.props.research;
    if (researches === null || loading || changeStatus) {
      researchLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner />
        </View>
      );
    } else {
      const selResearch = this.props.research.researches.find(research => {
        return research._id === this.props.selectedResearchId;
      });

      let dateFormatUpdated = selResearch.lastUpdate;
      dateFormatUpdated = moment(dateFormatUpdated).format(
        "MMM. DD, YYYY @ h:mm a"
      );

      let dateFormatCreated = selResearch.dateCreated;
      dateFormatCreated = moment(dateFormatCreated).format(
        "MMM. DD, YYYY @ h:mm a"
      );

      const topActiveButtons = [
        { element: DetailsTop },
        { element: AbstractTop },
        { element: AuthorsTop },
        { element: PicturesTop },
        { element: DocumentTop },
        { element: ReportTop },
        {
          element: selResearch.hidden === 0 ? HideTop : ShowTop
        },
        { element: MoveToBinTop }
      ];

      const topDeletedButtons = [
        { element: DetailsTop },
        { element: AbstractTop },
        { element: AuthorsTop },
        { element: PicturesTop },
        { element: DocumentTop },
        { element: ReportTop },
        { element: RestoreTop }
      ];

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
                <View key={authorInfo._id} style={styles.authorContainer}>
                  <View
                    style={{
                      width: "80%"
                    }}
                  >
                    <Text style={styles.textStyle}>
                      {authorInfo.name} ({authorInfo.role})
                    </Text>
                  </View>
                  {selResearch.deleted === 0 ? (
                    <RemoveButton
                      onPress={() =>
                        this.deleteAuthorHandler(
                          selResearch._id,
                          authorInfo._id
                        )
                      }
                    />
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
        imagesContent = selResearch.images.map(imageInfo => (
          <TouchableOpacity
            onPress={() => this.pictureHandler(imageInfo.name)}
            style={{ marginBottom: 5 }}
            key={imageInfo._id}
          >
            <Image
              source={{
                uri:
                  "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/researchImages/" +
                  imageInfo.name
              }}
              style={{ minHeight: 180 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ));
      }

      let documentButtons = (
        <TouchableOpacity
          onPress={this.openPDFPicker}
          style={{ marginTop: 15, marginLeft: 15, width: "40%" }}
        >
          <View style={styles.button}>
            <Text style={{ color: "white" }}>Add Document</Text>
          </View>
        </TouchableOpacity>
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
            <View style={{ width: "80%", paddingTop: 20, alignSelf: "center" }}>
              <ButtonGroup
                onPress={this.updateIndex}
                buttons={buttons}
                textStyle={{ color: "black" }}
                containerStyle={{ height: 40 }}
                selectedIndex={1}
                selectedButtonStyle={{ backgroundColor: "#dc3545" }}
                buttonStyle={{ backgroundColor: "#f0f2f4" }}
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

      const {
        college,
        course,
        researchId,
        pages,
        academicYear,
        lastUpdate,
        type,
        abstract,
        authors,
        selectedTab
      } = this.state;

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
            <Modal
              isVisible={this.state.visibleModal === 1}
              onBackdropPress={() => this.setState({ visibleModal: null })}
            >
              {this.renderModalContent()}
            </Modal>

            <View style={{ alignItems: "center", margin: 10 }}>
              <ButtonGroup
                onPress={this.updateIndexTB}
                buttons={
                  selResearch.deleted === 0
                    ? topActiveButtons
                    : topDeletedButtons
                }
                textStyle={{ color: "black" }}
                containerStyle={{ width: "100%" }}
                selectedIndex={this.state.selectedTab}
                selectedTextStyle={{ color: "white" }}
                selectedButtonStyle={{
                  backgroundColor: "#007bff"
                }}
                buttonStyle={{ backgroundColor: "#fff" }}
              />
            </View>
            {selectedTab === 0 ? (
              <View style={{ width: "100%", marginBottom: 20 }}>
                <View style={styles.buttonComponentStyle}>
                  {selResearch.deleted === 0 ? (
                    <TouchableOpacity
                      onPress={() => this.editResearchHandler(selResearch._id)}
                    >
                      <View style={styles.button}>
                        <Text style={{ color: "white" }}>Edit Research</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </View>
                <Card>
                  <View style={styles.textContainer}>
                    <Text style={[styles.textStyle, { fontSize: 25 }]}>
                      {selResearch.title}
                    </Text>
                  </View>
                  <ViewResearch label="College:" data={selResearch.college} />
                  <ViewResearch label="Course:" data={selResearch.course} />
                  <ViewResearch
                    label="Research ID:"
                    data={selResearch.researchID}
                  />
                  <ViewResearch label="Pages:" data={selResearch.pages} />
                  <ViewResearch
                    label=" Academic Year:"
                    data={selResearch.schoolYear}
                  />
                  <ViewResearch label="Created:" data={dateFormatCreated} />
                  <ViewResearch label="Updated:" data={dateFormatUpdated} />
                  <ViewResearch
                    label="Type:"
                    data={
                      selResearch.type === "thesis"
                        ? "Thesis"
                        : "Undergrad Research"
                    }
                  />
                  <View style={{ flexDirection: "row" }}>
                    {selResearch.hidden === 0 ? <View /> : <BadgeHidden />}
                    {selResearch.deleted === 0 ? <View /> : <BadgeDeleted />}
                  </View>
                </Card>
              </View>
            ) : (
              <View />
            )}

            {selectedTab === 1 ? (
              <View style={{ marginBottom: 20 }}>
                <View>
                  <Card title="Abstract" titleStyle={{ color: "#17a2b8" }}>
                    <View style={{ width: "100%" }}>
                      <HTMLView
                        value={`<p>${selResearch.abstract}</p>`}
                        stylesheet={styles}
                      />
                    </View>
                  </Card>
                </View>
              </View>
            ) : (
              <View />
            )}

            {selectedTab === 2 ? (
              <View>
                <View style={styles.buttonComponentStyle}>
                  {selResearch.deleted === 0 ? (
                    <TouchableOpacity
                      onPress={() => this.addAuthorHandler(selResearch)}
                    >
                      <View style={styles.button}>
                        <Text style={{ color: "white" }}>Add Author</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </View>
                <Card
                  title="Authors"
                  titleStyle={{ color: "#17a2b8", fontSize: 18 }}
                >
                  {authorsContent}
                </Card>
              </View>
            ) : (
              <View />
            )}

            {selectedTab === 3 ? (
              <View style={{ marginBottom: 20 }}>
                <View style={styles.buttonComponentStyle}>
                  {selResearch.deleted === 0 ? (
                    <TouchableOpacity
                      onPress={() => this.pickImageHandler(selResearch)}
                    >
                      <View style={styles.button}>
                        <Text style={{ color: "white" }}>Add Images</Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </View>

                <Card
                  title="Images"
                  titleStyle={{ color: "#17a2b8", fontSize: 18 }}
                >
                  {imagesContent}
                </Card>
              </View>
            ) : (
              <View />
            )}

            {selectedTab === 4 ? (
              <View style={{ paddingBottom: 20 }}>
                <View>
                  {selResearch.deleted === 0 ? (
                    <View>{documentButtons}</View>
                  ) : (
                    <View />
                  )}
                </View>
                <Card
                  title="Document"
                  titleStyle={{ color: "#17a2b8", fontSize: 18 }}
                >
                  {documentContainer}
                </Card>
              </View>
            ) : (
              <View />
            )}
            {selectedTab === 5 ? (
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Card
                  title="Create Report"
                  titleStyle={{ color: "#17a2b8", fontSize: 18 }}
                  containerStyle={{ width: "90%" }}
                >
                  <View style={{ alignItems: "center" }}>
                    <View style={{ width: "100%" }}>
                      <CheckBox
                        checked={college}
                        title="Research College"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            college: !college
                          });
                        }}
                      />

                      <CheckBox
                        checked={course}
                        title="Research Course"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            course: !course
                          });
                        }}
                      />

                      <CheckBox
                        checked={researchId}
                        title="Research ID"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            researchId: !researchId
                          });
                        }}
                      />

                      <CheckBox
                        checked={pages}
                        title="Pages"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            pages: !pages
                          });
                        }}
                      />

                      <CheckBox
                        checked={academicYear}
                        title="Academic Year"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            academicYear: !academicYear
                          });
                        }}
                      />

                      <CheckBox
                        checked={lastUpdate}
                        title="Last Update"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            lastUpdate: !lastUpdate
                          });
                        }}
                      />

                      <CheckBox
                        checked={type}
                        title=" Research Type"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            type: !type
                          });
                        }}
                      />

                      <CheckBox
                        checked={abstract}
                        title="Abstract"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            abstract: !abstract
                          });
                        }}
                      />

                      <CheckBox
                        checked={authors}
                        title="Authors"
                        containerStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#fff"
                        }}
                        onPress={() => {
                          this.setState({
                            authors: !authors
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
                          <Text style={{ color: "white" }}>
                            Generate Report
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              </View>
            ) : (
              <View />
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

  buttonComponentStyle: {
    marginTop: 15,
    marginLeft: 15,
    width: "40%"
  },

  modalContent: {
    padding: 22,
    justifyContent: "center",
    alignItems: "center"
  },
  authorContainer: {
    flexDirection: "row",
    margin: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 6,
    alignItems: "center"
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "#007bff"
  },

  p: {
    color: "#000",
    fontSize: 18
  }
});

ResearchDetailsScreen.propTypes = {
  deleteResearch: PropTypes.func.isRequired,
  createReportForResearch: PropTypes.func.isRequired,
  deleteAuthor: PropTypes.func.isRequired,
  getResearches: PropTypes.func.isRequired,
  addImages: PropTypes.func.isRequired,
  restoreResearch: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  addDocument: PropTypes.func.isRequired,
  research: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  research: state.research,
  errors: state.errors,
  auth: state.auth
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
    addDocument,
    createReportForResearch
  }
)(ResearchDetailsScreen);
