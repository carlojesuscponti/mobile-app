import { Navigation } from "react-native-navigation";
import { AsyncStorage } from "react-native";
import { Provider } from "react-redux";
import setAuthToken from "./store/utils/setAuthToken";
import { setCurrentUser } from "./store/actions/authActions";
import jwt_decode from "jwt-decode";

import AuthScreen from "./ScreensUI/Authentication/AuthScreen";

//Landing Screen
import LandingScreen from "./ScreensUI/TabScreens/Dashboard/Landing/LandingScreen";
//Landing Screen

//Dashboard Screen
import DashboardScreen from "./ScreensUI/TabScreens/Dashboard/Dashboard/DashboardScreen";
//Dashboard Screen

// College Screens
import CollegeListScreen from "./ScreensUI/TabScreens/Dashboard/College/CollegeListScreen";
import CollegeDetailsScreen from "./ScreensUI/TabScreens/Dashboard/College/CollegeDetailsScreen";
import AddCollegeScreen from "./ScreensUI/TabScreens/Dashboard/College/AddCollegeScreen";
import EditCollegeScreen from "./ScreensUI/TabScreens/Dashboard/College/EditCollegeScreen";
import AddCourseScreen from "./ScreensUI/TabScreens/Dashboard/College/AddCourseScreen";
import EditCourseScreen from "./ScreensUI/TabScreens/Dashboard/College/EditCourseScreen";
// College Screens

// Research Screens
import ResearchesListScreen from "./ScreensUI/TabScreens/Dashboard/Research/ResearchesListScreen";
import ResearchDetailsScreen from "./ScreensUI/TabScreens/Dashboard/Research/ResearchDetailsScreen";
import OfflineResearchScreen from "./ScreensUI/TabScreens/Dashboard/Research/OfflineResearchScreen";
import OfflineResearchListScreen from "./ScreensUI/TabScreens/Dashboard/Research/OfflineResearchListScreen";
import AddResearchScreen from "./ScreensUI/TabScreens/Dashboard/Research/AddResearchScreen";
import EditResearchScreen from "./ScreensUI/TabScreens/Dashboard/Research/EditResearchScreen";
import PDFViewerScreen from "./ScreensUI/TabScreens/Dashboard/Research/PDFViewerScreen";
import AddAuthorScreen from "./ScreensUI/TabScreens/Dashboard/Research/AddAuthorScreen";
// Research Screens

//Journal Screens
import JournalsListScreen from "./ScreensUI/TabScreens/Dashboard/Journal/JournalsListScreen.js";
import JournalDetailsScreen from "./ScreensUI/TabScreens/Dashboard/Journal/JournalDetailsScreen";
import AddAuthorJournalScreen from "./ScreensUI/TabScreens/Dashboard/Journal/AddAuthorScreen";
import AddJournalScreen from "./ScreensUI/TabScreens/Dashboard/Journal/AddJournalScreen";
//Journal Screens

import SideDrawerScreen from "./ScreensUI/SideDrawer/SideDrawer";
import startPrivateScreen from "./ScreensUI/startPrivateScreen";
import startDashboardScreen from "./ScreensUI/SideDrawer/dashboardPage";

import configureStore from "./store/configureStore";
const store = configureStore();

Navigation.registerComponent(
  "Client.SideDrawerScreen",
  () => SideDrawerScreen,
  store,
  Provider
);

//Landing Screen
Navigation.registerComponent("Client.LandingScreen", () => LandingScreen);
//Landing Screen

//Dashboard Screen
Navigation.registerComponent(
  "Client.DashboardScreen",
  () => DashboardScreen,
  store,
  Provider
);
//Dashboard Screen

Navigation.registerComponent(
  "Client.AuthScreen",
  () => AuthScreen,
  store,
  Provider
);

//College Screens
Navigation.registerComponent(
  "Client.CollegeListScreen",
  () => CollegeListScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.CollegeDetailsScreen",
  () => CollegeDetailsScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.AddCollegeScreen",
  () => AddCollegeScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.EditCollegeScreen",
  () => EditCollegeScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.AddCourseScreen",
  () => AddCourseScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.EditCourseScreen",
  () => EditCourseScreen,
  store,
  Provider
);

//College Screens

//Research Screens
Navigation.registerComponent(
  "Client.ResearchesListScreen",
  () => ResearchesListScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.ResearchDetailsScreen",
  () => ResearchDetailsScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.OfflineResearchScreen",
  () => OfflineResearchScreen
);

Navigation.registerComponent(
  "Client.OfflineResearchListScreen",
  () => OfflineResearchListScreen
);

Navigation.registerComponent(
  "Client.AddAuthorScreen",
  () => AddAuthorScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.AddResearchScreen",
  () => AddResearchScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.EditResearchScreen",
  () => EditResearchScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.PDFViewerScreen",
  () => PDFViewerScreen,
  store,
  Provider
);
//Research Screens

//Journal Screens
Navigation.registerComponent(
  "Client.JournalsListScreen",
  () => JournalsListScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.JournalDetailsScreen",
  () => JournalDetailsScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.AddAuthorJournalScreen",
  () => AddAuthorJournalScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.AddJournalScreen",
  () => AddJournalScreen,
  store,
  Provider
);

//Journal Screens

AsyncStorage.getItem("x-auth").then(token => {
  if (token) {
    // Set auth token header auth
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
    //startPrivateScreen();
    startDashboardScreen();
  } else {
    Navigation.startSingleScreenApp({
      screen: {
        screen: "Client.AuthScreen"
      }
    });
  }
});
