import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useContext, useState } from "react";
import { Button, ActivityIndicator, Text, TextInput } from "react-native-paper";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import fireBaseApp from "../utils/firebaseConfig";
import { LoginScreenProps } from "../types/navigationTypes";
import { context } from "../utils/Context";
import { StackActions } from "@react-navigation/native";

const Login = ({ navigation }: LoginScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const ctx = useContext(context);
  const auth = getAuth(fireBaseApp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const RegisterUser = async () => {
    setError("");
    setIsLoading(true);
    try {
      if (email && password) {
        const data = await signInWithEmailAndPassword(auth, email, password);
        ctx?.setUser({ email: data.user.email as string, uid: data.user.uid });

        setIsLoading(false);
        setEmail("");
        setPassword("");
        navigation.reset({
          index: 0,
          routes: [{ name: "Profile" }],
        });
      } else {
        setError("please provide all the fields");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.log(err);
      setError(err.message);
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text variant="bodyLarge">Login</Text>
      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{ width: "85%" }}
        mode="flat"
        label="Email"
      />
      <TextInput
        value={password}
        onChangeText={(t) => setPassword(t)}
        style={{ width: "85%" }}
        mode="flat"
        label="Password"
      />

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity onPress={RegisterUser}>
          <Button mode="contained-tonal">
            <Text>Login</Text>
          </Button>
        </TouchableOpacity>
      )}
      <Text>{error}</Text>
      <View style={{ flexDirection: "row" }}>
        <Text>Register from </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={{ color: "blue" }}>Here</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    gap: 10,
  },
});
export default Login;
