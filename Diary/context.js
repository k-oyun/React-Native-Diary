import React, {useContext} from "react";

//context를 사용해 prop을 주고 받지 않고 write read가능
export const DBContext = React.createContext();

//hook을 만들어 useDB만 사용하여 DB에 접근
export const useDB = () => {
  return useContext(DBContext);
};
