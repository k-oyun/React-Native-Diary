import {NavigationContainer} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import React, {useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import Navigator from "./navigator";
import Realm from "realm";
import AppLoading from "expo-app-loading";
import {DBContext} from "./context";

//데이터 형식 지정
const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [ready, setReady] = useState(false);

  //realm을 state로 넣어 context.provider에게 값을 주어 prop사용 없이 write read 가능
  const [realm, setRealm] = useState(null);
  const startLoading = async () => {
    //데이터베이스 열기
    //Realm sdk를 사용하여 스마트폰 데이터베이스 접근
    const connection = await Realm.open({
      path: "oyunDB",
      schema: [FeelingSchema],
    });
    setRealm(connection);
  };
  const onFinish = () => setReady(true);
  if (!ready) {
    return (
      <AppLoading
        onError={console.error}
        startAsync={startLoading}
        onFinish={onFinish}
      />
    );
  }

  return (
    <DBContext.Provider value={realm}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
