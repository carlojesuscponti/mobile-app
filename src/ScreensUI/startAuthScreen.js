import { Navigation } from "react-native-navigation";

const startAuthScreen = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: "Client.AuthScreen"
    }
  });
};

export default startAuthScreen;
