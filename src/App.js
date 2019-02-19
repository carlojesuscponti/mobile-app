import { Navigation } from "react-native-navigation";
import { AsyncStorage } from "react-native";
import { Provider } from "react-redux";
import setAuthToken from "./store/utils/setAuthToken";
import { setCurrentUser } from "./store/actions/authActions";
import jwt_decode from "jwt-decode";

import AuthScreen from "./ScreensUI/Authentication/AuthScreen";
import HomeScreen from "./ScreensUI/TabScreens/HomeScreen";
import ScannerScreen from "./ScreensUI/TabScreens/ScannerScreen";
import PersonScreen from "./ScreensUI/TabScreens/PersonScreen";

import CollegeListScreen from "./ScreensUI/TabScreens/Dashboard/CollegeListScreen";
import AddCollegeScreen from "./ScreensUI/TabScreens/Dashboard/AddCollegeScreen";
import AddCourseScreen from "./ScreensUI/TabScreens/Dashboard/AddCourseScreen";
import EditCollegeScreen from "./ScreensUI/TabScreens/Dashboard/EditCollegeScreen";
import CollegeDetailsScreen from "./ScreensUI/TabScreens/Dashboard/CollegeDetailsScreen";

import ResearchesListScreen from "./ScreensUI/TabScreens/Dashboard/ResearchesListScreen";
import ResearchDetailsScreen from "./ScreensUI/TabScreens/Dashboard/ResearchDetailsScreen";
import AddResearchScreen from "./ScreensUI/TabScreens/Dashboard/AddResearchScreen";
import AddAuthorScreen from "./ScreensUI/TabScreens/Dashboard/AddAuthorScreen";

import SideDrawerScreen from "./ScreensUI/SideDrawer/SideDrawer";
import startPrivateScreen from "./ScreensUI/startPrivateScreen";

import configureStore from "./store/configureStore";
const store = configureStore();

Navigation.registerComponent("Client.SideDrawerScreen", () => SideDrawerScreen);

Navigation.registerComponent(
  "Client.AuthScreen",
  () => AuthScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "Client.HomeScreen",
  () => HomeScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.PersonScreen",
  () => PersonScreen,
  store,
  Provider
);

Navigation.registerComponent(
  "Client.ScannerScreen",
  () => ScannerScreen,
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
//Research Screens

AsyncStorage.getItem("x-auth").then(token => {
  if (token) {
    // Set auth token header auth
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
    startPrivateScreen();
  } else {
    Navigation.startSingleScreenApp({
      screen: {
        screen: "Client.AuthScreen"
      }
    });
  }
});
