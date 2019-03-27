import { Navigation } from "react-native-navigation";
import Icon from "react-native-vector-icons/Ionicons";

export default (startOfflineResearchScreen = () => {
  Promise.all([Icon.getImageSource("ios-menu", 30)]).then(sources => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: "Client.OfflineResearchListScreen",
        label: "Research",
        title: "Researches"
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
