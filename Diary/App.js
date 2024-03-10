import {NavigationContainer} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import React, {useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import Navigator from "./navigator";
import Realm from "realm";
import AppLoading from "expo-app-loading";

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
  const startLoading = async () => {
    //데이터베이스 열기
    //Realm sdk를 사용하여 스마트폰 데이터베이스 접근
    const realm = await Realm.open({
      path: "oyunsMacDB",
      schema: [FeelingSchema],
    });
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
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
