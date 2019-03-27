import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getJournals,
  createReportForJournal,
  deleteJournal,
  restoreJournal,
  deleteAuthor,
  addImages,
  addDocument,
  deleteDocument
} from "../../../../store/actions/journalAction";
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
import { Card, ButtonGroup, CheckBox } from "react-native-elements";
import { ViewResearch } from "../../../../Components/View/ViewResearch";
import moment from "moment";
import HTMLView from "react-native-htmlview";
import {
  check,
  request,
  ANDROID_PERMISSIONS,
  RESULTS
} from "react-native-permissions";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
import Spinner from "../../../../Components/Spinner/Spinner";

class JournalsDetailsScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.updateIndexTB = this.updateIndexTB.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
    this.state = {
      selectedTab: 0,
      refreshing: false,
      deleteCtr: 0,
      addImageCtr: 0,

      // Basic info
      college: true,
      course: true,
      issn: true,
      pages: true,
      yearPublished: true,
      lastUpdate: true,
      description: true,
      authors: true,
      volume: true
    };
  }

  componentWillMount() {
    if (!this.props.journal.loading) {
      this.props.getJournals();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      console.log(JSON.stringify(nextProps.errors));
    }

    if (this.state.deleteCtr === 1) {
      this.setState({
        deleteCtr: 0
      });
      this.props.navigator.pop();
    }

    if (this.state.restoreCtr === 1) {
      this.setState({
        restoreCtr: 0
      });
      this.props.navigator.pop();
    }

    if (this.state.imageCtr === 1) {
      this.setState({
        imageCtr: 0
      });
    }

    if (this.state.documentCtr === 1) {
      this.setState({
        documentCtr: 0
      });
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    if (!this.props.journal.loading) {
      this.props.getJournals();
      this.setState({ refreshing: false });
    }
  };

  updateIndexTB(selIndex) {
    const journalData = this.props.journal.journals.find(journal => {
      return journal._id === this.props.selectedJournalId;
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

    if (selIndex === 6 && journalData.deleted === 0) {
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      const data = {
        id: journalData._id,
        hidden: true,
        username: name
      };

      Alert.alert(
        "Message",
        journalData.hidden === 0
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
              if (journalData.hidden === 0) {
                this.props.deleteJournal(data);
                this.setState({
                  deleteCtr: 1
                });
              }
              if (journalData.hidden === 1) {
                this.props.restoreJournal(data);
                this.setState({
                  restoreCtr: 1
                });
              }
            }
          }
        ],
        { cancelable: false }
      );
    }

    if (selIndex === 7 && journalData.deleted === 0) {
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      const data = {
        id: journalData._id,
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
              this.props.deleteJournal(data);
              this.setState({
                deleteCtr: 1
              });
            }
          }
        ],
        { cancelable: false }
      );
    }

    if (selIndex === 6 && journalData.deleted === 1) {
      const name =
        this.props.auth.user.firstName +
        " " +
        this.props.auth.user.middleName +
        " " +
        this.props.auth.user.lastName;

      const data = {
        id: journalData._id,
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
              this.props.restoreJournal(data);
              this.setState({
                restoreCtr: 1
              });
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  updateIndex(selIndex) {
    if (selIndex === 0) {
      const jourData = this.props.journal.journals.find(journal => {
        return journal._id === this.props.selectedJournalId;
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
                          researchId: jourData._id,
                          oldFile: jourData.document,
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
                              researchId: jourData._id,
                              oldFile: jourData.document,
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
      const journalData = this.props.journal.journals.find(journal => {
        return journal._id === this.props.selectedJournalId;
      });

      const journalId = journalData._id;
      const filename = journalData.document;
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
              this.props.deleteDocument(journalId, filename, name);
            }
          }
        ],
        { cancelable: false }
      );
    }
  }

  openDcoumentHandler = document => {
    this.props.navigator.push({
      screen: "Client.PDFViewerScreen",
      title: "PDF",
      passProps: {
        documentName: document,
        journalPDF: 1
      }
    });
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
              this.state.issn === false &&
              this.state.pages === false &&
              this.state.yearPublished === false &&
              this.state.lastUpdate === false &&
              this.state.volume === false &&
              this.state.description === false &&
              this.state.authors === false
            ) {
              Alert.alert("Message", "Please check at least one");
            } else {
              const journalData = this.props.journal.journals.find(journal => {
                return journal._id === this.props.selectedJournalId;
              });

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
                issn: this.state.issn,
                pages: this.state.pages,
                yearPublished: this.state.yearPublished,
                lastUpdate: this.state.lastUpdate,
                description: this.state.description,
                authors: this.state.authors,
                volume: this.state.volume,
                android: true,
                journal: journalData,
                typeOfReport: "Journal Report",
                printedBy: name
              };

              this.props.createReportForJournal(reportData);
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
                  this.state.issn === false &&
                  this.state.pages === false &&
                  this.state.yearPublished === false &&
                  this.state.lastUpdate === false &&
                  this.state.volume === false &&
                  this.state.description === false &&
                  this.state.authors === false
                ) {
                  Alert.alert("Message", "Please check at least one");
                } else {
                  const journalData = this.props.journal.journals.find(
                    journal => {
                      return journal._id === this.props.selectedJournalId;
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
                    issn: this.state.issn,
                    pages: this.state.pages,
                    yearPublished: this.state.yearPublished,
                    lastUpdate: this.state.lastUpdate,
                    description: this.state.description,
                    authors: this.state.authors,
                    volume: this.state.volume,
                    android: true,
                    journal: journalData,
                    typeOfReport: "Journal Report",
                    printedBy: name
                  };

                  this.props.createReportForJournal(reportData);
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

  PDFPickerHandler = () => {
    try {
      const journalData = this.props.journal.journals.find(journal => {
        return journal._id === this.props.selectedJournalId;
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
                          researchId: journalData._id,
                          oldFile: journalData.document,
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
                              researchId: journalData._id,
                              oldFile: journalData.document,
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
    } catch (err) {
      alert(JSON.stringify(err));
    }
  };

  addAuthorHandler = journalData => {
    this.props.navigator.push({
      screen: "Client.AddAuthorJournalScreen",
      title: "Add Author",
      passProps: {
        journalData: journalData
      }
    });
  };

  editJournalHandler = journalData => {
    this.props.navigator.push({
      screen: "Client.AddJournalScreen",
      title: "Edit Journal",
      passProps: {
        journalData: journalData,
        editCtr: true
      }
    });
  };

  deleteAuthorHandler = (journalId, authorId) => {
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
            this.props.deleteAuthor(journalId, authorId, name);
          }
        }
      ],
      { cancelable: false }
    );
  };

  pickImageHandler = journalData => {
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
            id: journalData._id,
            username: name
          };

          this.props.addImages(data);
        }
      });
    } catch (err) {}
  };

  render() {
    const journalData = this.props.journal.journals.find(journal => {
      return journal._id === this.props.selectedJournalId;
    });

    let dateFormatUpdated = journalData.lastUpdate;
    dateFormatUpdated = moment(dateFormatUpdated).format(
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
        element: journalData.hidden === 0 ? HideTop : ShowTop
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

    const {
      college,
      course,
      issn,
      pages,
      yearPublished,
      lastUpdate,
      description,
      authors,
      volume
    } = this.state;
    const buttons = ["Update", "Remove"];

    let journalLayout;
    const { journals, loading, changeStatus } = this.props.journal;
    if (journals === null || loading || changeStatus) {
      journalLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner />
        </View>
      );
    } else {
      journalLayout = (
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
          <View style={{ alignItems: "center", margin: 10 }}>
            <ButtonGroup
              onPress={this.updateIndexTB}
              buttons={
                journalData.deleted === 0 ? topActiveButtons : topDeletedButtons
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
          {this.state.selectedTab === 0 ? (
            <View style={{ width: "100%", marginBottom: 20 }}>
              <View style={styles.buttonComponentStyle}>
                {journalData.deleted === 0 ? (
                  <TouchableOpacity
                    onPress={() => this.editJournalHandler(journalData)}
                  >
                    <View style={styles.button}>
                      <Text style={{ color: "white" }}>Edit Journal</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>
              <Card>
                <View style={{ margin: 5, flex: 1 }}>
                  <Text style={{ color: "black", fontSize: 25 }}>
                    {journalData.title}
                  </Text>
                </View>
                <ViewResearch label="College:" data={journalData.college} />
                <ViewResearch label="Course:" data={journalData.course} />
                <ViewResearch label="ISSN:" data={journalData.issn} />
                <ViewResearch label="Publisher:" data={journalData.publisher} />
                <ViewResearch label="Volume:" data={journalData.volume} />
                <ViewResearch label="Pages:" data={journalData.pages} />
                <ViewResearch
                  label="Year Published:"
                  data={journalData.yearPublished}
                />
                <ViewResearch label="Updated:" data={dateFormatUpdated} />
              </Card>
            </View>
          ) : (
            <View />
          )}
          {this.state.selectedTab === 1 ? (
            <View style={{ marginBottom: 20 }}>
              <Card
                title="Description"
                titleStyle={{ color: "#17a2b8", fontSize: 18 }}
              >
                {journalData.description == "" ||
                journalData.description == null ? (
                  <View>
                    <Text style={styles.textStyle}>No Description</Text>
                  </View>
                ) : (
                  <View style={{ width: "100%" }}>
                    <HTMLView
                      value={`<p>${journalData.description}</p>`}
                      stylesheet={styles}
                    />
                  </View>
                )}
              </Card>
            </View>
          ) : (
            <View />
          )}
          {this.state.selectedTab === 2 ? (
            <View style={{ marginBottom: 20 }}>
              <View style={styles.buttonComponentStyle}>
                {journalData.deleted === 0 ? (
                  <TouchableOpacity
                    onPress={() => this.addAuthorHandler(journalData)}
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
                {journalData.author.length === 0 ? (
                  <View>
                    <Text style={styles.textStyle}>
                      No author is added in this research
                    </Text>
                  </View>
                ) : (
                  <View style={{ width: "100%", flexDirection: "row" }}>
                    <View
                      style={{
                        width: "100%"
                      }}
                    >
                      {journalData.author.map(authorInfo => (
                        <View
                          key={authorInfo._id}
                          style={styles.authorContainer}
                        >
                          <View
                            style={{
                              width: "80%"
                            }}
                          >
                            <Text style={styles.textStyle}>
                              {authorInfo.name}
                            </Text>
                          </View>
                          {journalData.deleted === 0 ? (
                            <RemoveButton
                              onPress={() =>
                                this.deleteAuthorHandler(
                                  journalData._id,
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
                )}
              </Card>
            </View>
          ) : (
            <View />
          )}
          {this.state.selectedTab === 3 ? (
            <View style={{ marginBottom: 20 }}>
              <View style={styles.buttonComponentStyle}>
                {journalData.deleted === 0 ? (
                  <TouchableOpacity
                    onPress={() => this.pickImageHandler(journalData)}
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
                {journalData.images.length === 0 ? (
                  <View>
                    <Text style={styles.textStyle}>
                      No image is added in this journal.
                    </Text>
                  </View>
                ) : (
                  journalData.images.map(imageInfo => (
                    <TouchableOpacity
                      style={{ marginBottom: 5 }}
                      key={imageInfo._id}
                    >
                      <Image
                        source={{
                          uri:
                            "https://s3-ap-southeast-1.amazonaws.com/bulsu-capstone/journalImages/" +
                            imageInfo.name
                        }}
                        style={{ minHeight: 180 }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  ))
                )}
              </Card>
            </View>
          ) : (
            <View />
          )}
          {this.state.selectedTab === 4 ? (
            <View style={{ paddingBottom: 20 }}>
              {journalData.document == "" || journalData.document == null ? (
                <View>
                  <TouchableOpacity
                    onPress={this.PDFPickerHandler}
                    style={{ marginTop: 15, marginLeft: 15, width: "40%" }}
                  >
                    <View style={styles.button}>
                      <Text style={{ color: "white" }}>Add Document</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{ width: "80%", paddingTop: 20, alignSelf: "center" }}
                >
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
              )}

              <Card
                title="Document"
                titleStyle={{ color: "#17a2b8", fontSize: 18 }}
                containerStyle={{ marginTop: 15 }}
              >
                {journalData.document == "" || journalData.document == null ? (
                  <View>
                    <Text style={styles.textStyle}>
                      No document is added for this research
                    </Text>
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        this.openDcoumentHandler(journalData.document)
                      }
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
                )}
              </Card>
            </View>
          ) : (
            <View />
          )}

          {this.state.selectedTab === 5 ? (
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
                      title="Journal College"
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
                      title="Journal Course"
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
                      checked={issn}
                      title="ISSN"
                      containerStyle={{
                        backgroundColor: "#fff",
                        borderColor: "#fff"
                      }}
                      onPress={() => {
                        this.setState({
                          issn: !issn
                        });
                      }}
                    />

                    <CheckBox
                      checked={volume}
                      title="Volume"
                      containerStyle={{
                        backgroundColor: "#fff",
                        borderColor: "#fff"
                      }}
                      onPress={() => {
                        this.setState({
                          volume: !volume
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
                      checked={yearPublished}
                      title="Published Year"
                      containerStyle={{
                        backgroundColor: "#fff",
                        borderColor: "#fff"
                      }}
                      onPress={() => {
                        this.setState({
                          yearPublished: !yearPublished
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
                      checked={description}
                      title="Description"
                      containerStyle={{
                        backgroundColor: "#fff",
                        borderColor: "#fff"
                      }}
                      onPress={() => {
                        this.setState({
                          description: !description
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
                        <Text style={{ color: "white" }}>Generate Report</Text>
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
      );
    }

    return <View style={styles.container}>{journalLayout}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  buttonComponentStyle: {
    marginTop: 15,
    marginLeft: 15,
    width: "40%"
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
  },
  textStyle: {
    color: "black",
    fontSize: 15
  },

  authorContainer: {
    flexDirection: "row",
    margin: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 6,
    alignItems: "center"
  }
});

JournalsDetailsScreen.propTypes = {
  getJournals: PropTypes.func.isRequired,
  createReportForJournal: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  deleteJournal: PropTypes.func.isRequired,
  restoreJournal: PropTypes.func.isRequired,
  deleteAuthor: PropTypes.func.isRequired,
  addImages: PropTypes.func.isRequired,
  addDocument: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  journal: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  journal: state.journal,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    getJournals,
    createReportForJournal,
    deleteJournal,
    restoreJournal,
    deleteAuthor,
    addImages,
    addDocument,
    deleteDocument
  }
)(JournalsDetailsScreen);
