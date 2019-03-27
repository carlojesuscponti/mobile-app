import { Navigation } from "react-native-navigation";
import Icon from "react-native-vector-icons/Ionicons";

export default (startCollegeListScreen = () => {
  Promise.all([Icon.getImageSource("ios-menu", 30)]).then(sources => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: "Client.CollegeListScreen",
        label: "Colleges",
        title: "Colleges",
        navigatorButtons: {
          leftButtons: [
            {
              icon: sources[0],
              title: "Menu",
              id: "sideDrawerToggle"
            }
          ]
        }
      },
      appStyle: {
        navBarTextColor: "#fff",
        navBarBackgroundColor: "#631B1E",
        navBarButtonColor: "#fff"
      },

      drawer: {
        left: {
          screen: "Client.SideDrawerScreen"
        }
      }
    });
  });
});
