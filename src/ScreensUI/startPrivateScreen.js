import { Navigation } from "react-native-navigation";
import Icon from "react-native-vector-icons/Ionicons";

const startTabs = () => {
  Promise.all([
    Icon.getImageSource("ios-home", 30),
    Icon.getImageSource("ios-qr-scanner", 30),
    Icon.getImageSource("ios-person", 30),
    Icon.getImageSource("ios-menu", 30)
  ]).then(sources => {
    Navigation.startTabBasedApp({
      tabs: [
        {
          screen: "Client.HomeScreen",
          label: "Home",
          title: "Home",
          icon: sources[0],
          navigatorButtons: {
            leftButtons: [
              {
                icon: sources[3],
                title: "Menu",
                id: "sideDrawerToggle"
              }
            ]
          }
        },

        {
          screen: "Client.ScannerScreen",
          label: "Scanner",
          title: "Scanner",
          icon: sources[1],
          navigatorButtons: {
            leftButtons: [
              {
                icon: sources[3],
                title: "Menu",
                id: "sideDrawerToggle"
              }
            ]
          }
        },

        {
          screen: "Client.PersonScreen",
          label: "Person",
          title: "Person",
          icon: sources[2],
          navigatorButtons: {
            leftButtons: [
              {
                icon: sources[3],
                title: "Menu",
                id: "sideDrawerToggle"
              }
            ]
          }
        }
      ],
      appStyle: {
        tabBarBackgroundColor: "#631B1E",
        tabBarButtonColor: "#808080",
        tabBarHideShadow: true,
        tabBarSelectedButtonColor: "#fff",
        tabBarTranslucent: false,
        tabFontSize: 10,
        selectedTabFontSize: 10
      },
      drawer: {
        left: {
          screen: "Client.SideDrawerScreen"
        }
      }
    });
  });
};

export default startTabs;
