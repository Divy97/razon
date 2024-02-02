/* eslint-disable react/prop-types */
import { ChatState } from "@/context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <div
      className={`${
        selectedChat ? "chatBoxDisplay" : ""
      } flex items-center flex-col p-3 border-2 w-[100%] h-[100%]`}
    >
      {selectedChat ? (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        <h1 className="flex justify-center items-center text-3xl m-auto p-auto font-bold font-mono">
          SELECT ANY CHAT TO START CONVO!
        </h1>
      )}
    </div>
  );
};

export default ChatBox;
