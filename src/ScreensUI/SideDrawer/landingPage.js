import { Navigation } from "react-native-navigation";
import Icon from "react-native-vector-icons/Ionicons";

export default (startLandingScreen = () => {
  Promise.all([Icon.getImageSource("ios-menu", 30)]).then(sources => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: "Client.LandingScreen",
        label: "Landing Page",
        title: "Landing Page"
        // navigatorButtons: {
        //   leftButtons: [
        //     {
        //       icon: sources[0],
        //       title: "Menu",
        //       id: "sideDrawerToggle"
        //     }
        //   ]
        // }
      }
      // drawer: {
      //   left: {
      //     screen: "Client.SideDrawerScreen"
      //   }
      // }
    });
  });
});
