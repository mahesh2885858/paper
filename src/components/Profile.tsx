import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import {
  getDatabase,
  ref,
  off,
  onValue,
  push,
  remove,
  set,
} from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import fireBaseApp from "../utils/firebaseConfig";
import { ProfileScreenProps } from "../types/navigationTypes";
import { context } from "../utils/Context";
import * as Crypto from "expo-crypto";
const Profile = ({ navigation }: ProfileScreenProps) => {
  const [todo, setTodo] = useState("");
  const [data, setData] = useState<
    {
      mainKey: string;
      key: string;
      data: {
        id: string;
        todo: string;
      };
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [orgId, setOrgId] = useState("");
  const [initialLoad, setInitialLoad] = useState(false);
  const ctx = useContext(context);
  const [addedTodos, setAddedtodos] = useState(0);
  const AddTodo = async () => {
    setLoading(true);
    const randomId = Crypto.randomUUID();
    const db = getDatabase();
    const savedData = await push(ref(db, "users/" + ctx?.user.uid), {
      todo,
      id: randomId,
    });
    setAddedtodos((prev) => prev + 1);
    setTodo("");
    setLoading(false);
  };
  const UpdateTodo = async (id: string, todoId: string) => {
    const db = getDatabase();
    set(ref(db, "users/" + ctx?.user.uid + "/" + id), {
      id: todoId,
      todo,
    })
      .then(() => {
        setTodo("");
        setEditId("");
        setOrgId("");
      })
      .catch((error) => {
        console.log(error);
        setTodo("");
        setOrgId("");
        setEditId("");
      });
  };
  const deleteTodo = async (id: string) => {
    console.log({ id });
    const db = getDatabase();

    const address = "users/" + ctx?.user.uid + "/" + id;
    const dbref = ref(db, address);
    await remove(dbref);
    setAddedtodos((prev) => prev - 1);
  };
  const logout = async () => {
    const data = await getAuth(fireBaseApp).signOut();
    navigation.replace("Home");
  };

  useEffect(() => {
    setInitialLoad(true);
    const db = getDatabase();
    const starCountRef = ref(db, "users/" + ctx?.user.uid + "/");
    onValue(starCountRef, (snapshot) => {
      const totalEntries: any[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((datasnapshot) => {
          if (datasnapshot.exists()) {
            const mainKey = datasnapshot.key;
            const keyname = datasnapshot.key;
            const data = datasnapshot.val();
            totalEntries.push({ mainKey, key: keyname, data: data });
          }
        });
      }
      console.log(totalEntries);
      setData(totalEntries);
      setInitialLoad(false);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      off(starCountRef);
    };
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Text>Profile</Text>
      <View style={{ width: "100%", alignItems: "center" }}>
        <TextInput
          value={todo}
          onChangeText={(text) => setTodo(text)}
          style={{ width: "85%" }}
          mode="flat"
          label="Todo"
        />
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity
          onPress={editId ? () => UpdateTodo(editId, orgId) : AddTodo}
        >
          <Button>
            <Text>Add</Text>
          </Button>
        </TouchableOpacity>
      )}
      {/* {loading ? <ActivityIndicator /> : <TouchableOpacity onPress={getData} >
                <Button>
                    <Text>Load</Text>
                </Button>
            </TouchableOpacity>} */}
      <View></View>
      {initialLoad && <ActivityIndicator />}
      <ScrollView>
        {data.map((item) => {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              key={item.data.id}
            >
              <Text>{item.data.todo}</Text>
              <Button
                onPress={() => {
                  setEditId(item.key);
                  setTodo(item.data.todo);
                  setOrgId(item.data.id);
                }}
              >
                <Text>edit</Text>
              </Button>
              <Button onPress={() => deleteTodo(item.key)}>
                <Text>delete</Text>
              </Button>
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity onPress={logout}>
        <Button>
          <Text>logout</Text>
        </Button>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
