import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./src/components/Home";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./src/types/navigationTypes";
import Login from "./src/components/Login";
import fireBaseApp from "./src/utils/firebaseConfig";
import { getAuth } from "firebase/auth";
import Profile from "./src/components/Profile";
import ContextProvider from "./src/utils/Context";
getAuth(fireBaseApp).onAuthStateChanged((user) => {
  console.log({ firebaseuser: user });
});

const theme = {
  ...MD3LightTheme, // or MD3DarkTheme
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#3498db",
    secondary: "#f1c40f",
    tertiary: "#a1b2c3",
  },
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ContextProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              options={{ title: "Register" }}
              component={Home}
            />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ContextProvider>
  );
}
