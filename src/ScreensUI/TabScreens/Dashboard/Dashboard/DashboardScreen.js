import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  FlatList,
  NetInfo
} from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getColleges } from "../../../../store/actions/collegeAction";
import { getResearches } from "../../../../store/actions/researchActions";
import { getActivities } from "../../../../store/actions/activityActions";
import moment from "moment";
import { PieChart } from "react-native-svg-charts";
import { Card, Icon } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { SummaryDashboard } from "../../../../Components/View/SummaryDashboard";
import Spinner from "../../../../Components/Spinner/Spinner";
class DashboardScreen extends Component {
  static navigatorStyle = {
    navBarTitleTextCentered: true
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    this.state = {
      array: [],
      connection: ""
    };
  }

  componentWillMount() {
    if (!this.props.activity.loading) {
      this.props.getActivities();
      NetInfo.getConnectionInfo().then(connectionInfo => {
        this.setState({
          connection: connectionInfo.type
        });
      });
    }

    if (!this.props.college.loading) {
      this.props.getColleges();
      NetInfo.getConnectionInfo().then(connectionInfo => {
        this.setState({
          connection: connectionInfo.type
        });
      });
    }
  }

  changeIdHandler = id => {
    const activeCollege = this.props.college.colleges.filter(college => {
      return college._id === id;
    });

    this.setState({ array: activeCollege });
  };

  onNavigatorEvent = event => {
    if (
      !this.props.college.loading &&
      !this.props.activity.loading &&
      this.props.activity.activities !== null &&
      this.props.college.colleges !== null
    ) {
      if (event.type === "NavBarButtonPress") {
        if (event.id === "sideDrawerToggle") {
          this.props.navigator.toggleDrawer({
            side: "left"
          });
        }
      }
    }
  };

  render() {
    const { colleges, loading } = this.props.college;
    const { activities } = this.props.activity;
    const actLoading = this.props.activity.loading;
    let activityLayout;

    if (this.state.connection === "none") {
      activityLayout = (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Internet Connection</Text>
        </View>
      );
    } else {
      if (actLoading || activities === null || colleges === null || loading) {
        activityLayout = (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Spinner />
          </View>
        );
      } else {
        let recentActivities = [];
        let pieChartResearch = [];
        let pieChartJournal = [];

        let collegeTot = 0,
          courseTot = 0,
          researchTot = 0,
          journalTot = 0;

        try {
          activities.map(activity => {
            recentActivities.push(
              <View
                style={{ flexDirection: "row", width: "90%", margin: 7 }}
                key={activity._id}
              >
                <Text
                  style={{
                    color: "black",
                    marginLeft: 8,
                    marginRight: 8,
                    fontSize: 16
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {activity.title} {`by ${activity.by}`}{" "}
                  </Text>
                  <Text>{moment(activity.date).fromNow()}</Text>
                </Text>
              </View>
            );
          });
        } catch (err) {}

        try {
          const activeCollege = colleges.filter(college => {
            return college.deleted === 0 && college.researchTotal >= 0;
          });

          activeCollege.map(college => {
            pieChartResearch.push({
              id: college._id,
              label: college.name.initials,
              value: parseInt(college.researchTotal),
              color: college.color
            });
          });

          activeCollege.map(college => {
            pieChartJournal.push({
              id: college._id,
              label: college.name.initials,
              value: parseInt(college.journalTotal),
              color: college.color
            });
          });

          // Get Total for top text
          collegeTot = parseInt(activeCollege.length);
          for (let index = 0; index < colleges.length; index++) {
            if (colleges[index].deleted === 0) {
              for (
                let index2 = 0;
                index2 < colleges[index].course.length;
                index2++
              ) {
                if (colleges[index].course[index2].status === 0) {
                  if (colleges[index].course[index2].deleted === 0) {
                    ++courseTot;
                  }
                }
              }
            }
          }

          colleges.map(college => {
            researchTot += parseInt(college.researchTotal, 10);
            journalTot += parseInt(college.journalTotal, 10);
          });
          // Get Total for top text
        } catch (err) {}

        let pieResearch = pieChartResearch
          .filter(college => college.value >= 1)
          .map(college => ({
            value: college.value,
            svg: {
              fill: college.color,
              onPress: () => this.changeIdHandler(college.id)
            },
            key: `pie-${college.id}`
          }));

        let pieJournal = pieChartJournal
          .filter(college => college.value >= 1)
          .map(college => ({
            value: college.value,
            svg: {
              fill: college.color,
              onPress: () => this.changeIdHandler(college.id)
            },
            key: `pie-${college.id}`
          }));

        activityLayout = (
          <View
            style={{
              flex: 1,
              width: "100%"
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false} width="100%">
              <View style={styles.summaryContainer}>
                <SummaryDashboard
                  label="COLLEGES"
                  icon="university"
                  color="#2e86c1"
                  total={collegeTot}
                />
                <SummaryDashboard
                  label="COURSES"
                  icon="graduation-cap"
                  color="#1e8449"
                  total={courseTot}
                />
                <SummaryDashboard
                  label="RESEARCHES"
                  icon="book"
                  color="#ba4a00"
                  total={researchTot}
                />
                <SummaryDashboard
                  label="JOURNALS"
                  icon="book-open"
                  color="#d4ac0d"
                  total={journalTot}
                />
                <Text style={styles.textStyle}>Researches</Text>
                <View
                  style={{ width: "90%", maxHeight: 400, marginBottom: 10 }}
                >
                  <PieChart style={{ height: "100%" }} data={pieResearch} />
                </View>

                <Text style={styles.textStyle}>Journals</Text>
                <View
                  style={{ width: "90%", maxHeight: 400, marginBottom: 10 }}
                >
                  <PieChart style={{ height: "100%" }} data={pieJournal} />
                </View>
                {/* 
                <View style={{ width: "15%", alignItems: "center" }}>
                  {this.state.array.map(item => (
                    <View key={item._id} style={{ alignItems: "center" }}>
                      <Text style={{ color: "black", fontSize: 18 }}>
                        {item.researchTotal}
                      </Text>
                      <Text style={{ color: "black", fontSize: 18 }}>
                        {item.name.initials}
                      </Text>
                    </View>
                  ))}
                </View> */}
              </View>

              <View style={styles.legendContainer}>
                <FlatList
                  data={pieChartResearch}
                  numColumns={3}
                  renderItem={({ item }) => (
                    <View style={styles.flatListContainer}>
                      <View
                        style={{
                          width: 50,
                          height: 15,
                          backgroundColor: item.color
                        }}
                      />
                      <Text style={{ marginLeft: 3 }}>{item.label}</Text>
                    </View>
                  )}
                  keyExtractor={item => item.id.toString()}
                />
              </View>

              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  marginBottom: 20,
                  marginTop: 20
                }}
              >
                <View
                  style={{
                    borderColor: "#000",
                    borderWidth: 1,
                    width: "90%",
                    height: 350
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      height: 50
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "600",
                        color: "black"
                      }}
                    >
                      Recent Activities
                    </Text>
                  </View>
                  <ScrollView nestedScrollEnabled={true}>
                    {recentActivities}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          </View>
        );
      }
    }

    return <View style={styles.container}>{activityLayout}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    width: "100%"
  },

  summaryContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  legendContainer: {
    minWidth: 300,
    minHeight: 80,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  flatListContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 4
  },
  textStyle: {
    color: "black",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 15
  }
});

DashboardScreen.propTypes = {
  college: PropTypes.object.isRequired,
  research: PropTypes.object.isRequired,
  activity: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  college: state.college,
  activity: state.activity,
  research: state.research
});

export default connect(
  mapStateToProps,
  { getColleges, getResearches, getActivities }
)(DashboardScreen);
