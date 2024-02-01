import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  useEffect(() => {
    let userInfo = localStorage.getItem("userinfo");
    setUser(userInfo);
  }, []);
  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};


export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
