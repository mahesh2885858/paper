import { View, Text } from "react-native";
import React, { createContext, useState } from "react";
import { getAuth } from "firebase/auth";
import fireBaseApp from "../utils/firebaseConfig";
const UserCredential = getAuth(fireBaseApp);
import { User as fireBaseUser } from "firebase/auth";
type ContextInterface = {
  user: { uid: string; email: string };
  setUser: React.Dispatch<
    React.SetStateAction<{
      uid: string;
      email: string;
    }>
  >;
};
export const context = createContext<ContextInterface | null>(null);
const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({ uid: "", email: "" });
  const value = {
    user,
    setUser,
  };

  return <context.Provider value={value}>{children}</context.Provider>;
};

export default ContextProvider;
