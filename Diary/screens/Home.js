import React, {useEffect, useState} from "react";
import styled from "styled-components/native";
import colors from "../color";
import {Ionicons} from "@expo/vector-icons";
import {useDB} from "../context";
import {FlatList, LayoutAnimation, TouchableOpacity} from "react-native";

const View = styled.View`
  flex: 1;
  background-color: ${colors.bgColor};
  padding: 0px 30px;
  padding-top: 100px;
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-size: 38px;
  font-weight: 500;
  margin-bottom: 100px;
`;
const Btn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 50px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.btnColor};
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
`;
const BtnText = styled.Text`
  color: white;
`;

const Record = styled.View`
  background-color: ${colors.cardColor};
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  border-radius: 10px;
`;

const Emotion = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`;
const Message = styled.Text`
  font-size: 18px;
`;

const Separator = styled.View`
  height: 10px;
`;
const Home = ({navigation: {navigate}}) => {
  //DB로부터 불러오기
  const realm = useDB();
  const [feelings, setFeelings] = useState([]);
  useEffect(() => {
    const feelings = realm.objects("Feeling");

    //데이터베이스의 변화(추가,삭제)를 실시간 추적하여 렌더링
    feelings.addListener((feelings, changes) => {
      //Layout animation은 state에 변화가 있을시 자동으로 애니메이션 실행 보통 state전에 사용
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      //단축키 제공 LayoutAnimation.spring();

      //최근 작성 순서로
      setFeelings(feelings.sorted("_id", true));
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []);

  //필터링하는법
  //feelings.filtered("emotion='🥲' ");

  //작성한 것을 삭제
  //Record를 누를시 삭제
  const onPress = (id) => {
    realm.write(() => {
      //id를 이용하여 DB의 feeling을 찾고 제거
      const feeling = realm.objectForPrimaryKey("Feeling", id);
      realm.delete(feeling);
    });
  };
  return (
    <View>
      <Title>My journal</Title>
      <FlatList
        data={feelings}
        contentContainerStyle={{paddingVertical: 10}}
        //item간 간격
        ItemSeparatorComponent={Separator}
        keyExtractor={(feeling) => feeling._id + ""}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => onPress(item._id)}>
            <Record>
              <Emotion>{item.emotion}</Emotion>
              <Message>{item.message}</Message>
            </Record>
          </TouchableOpacity>
        )}
      />
      <Btn onPress={() => navigate("Write")}>
        <Ionicons name="add" color="white" size={40} />
      </Btn>
    </View>
  );
};

export default Home;
