/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [token, setToken] = useState("");
  useEffect(() => {
    let userInfo = localStorage.getItem("userinfo");
    let t = localStorage.getItem("token");
    setUser(JSON.parse(userInfo));
    setToken(t);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
