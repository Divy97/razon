/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatState } from "@/context/ChatProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  const isSameSenderMargin = (messages, m, i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 60;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };

  const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

  return (
    // <ScrollArea className="h-[58vh] w-[100%] flex items-end flex-col pr-2">
    <ScrollArea className="h-auto flex flex-col pr-2 " style={{flexDirection:"column-reverse"}}>
      {messages &&
        messages.map((m, i) => (
          <div className="flex" key={m._id}>
            {(isSameSender(messages, m, i, JSON.parse(user)?._id) ||
              isLastMessage(messages, i, JSON.parse(user)?._id)) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="mt-[7px] mr-1 m-2 cursor-pointer">
                      <AvatarImage
                        className="w-[3rem] h-[3rem] p-1"
                        style={{
                          borderRadius: "50%",
                          border: "2px solid gray",
                        }}
                        src="https://github.com/shadcn.png"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{m.sender.username}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === JSON.parse(user)._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  JSON.parse(user)?._id
                ),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                height: "40px",
                maxWidth: "75%",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollArea>
  );
};

export default ScrollableChat;
