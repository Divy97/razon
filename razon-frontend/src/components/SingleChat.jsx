/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { ChatState } from "@/context/ChatProvider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {toast} from 'react-toastify'

import { Settings, X } from "lucide-react";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import {SERVER} from "../constants.js";

const ENDPOINT = "http://localhost:8080";
let socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, token } = ChatState();

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id
      ? users[1]?.username
      : users[0]?.username;
  };

  //change in group (add, remove, rename)
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + token);

      let raw = JSON.stringify({
        chatId: selectedChat?._id,
        chatName: groupChatName,
      });

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`$${SERVER}/chat/group/rename`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setSelectedChat(result.data);
          setFetchAgain(!fetchAgain);
          setRenameLoading(false);
          toast.success('Group renamed successfully', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast.error('Oops, Something went wrong', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
    document?.getElementById("dialogClose")?.click();
    setGroupChatName("");
  };

  const handleSearch = (search) => {
    if (!search) {
      toast.warn('Enter Username to search', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    } else {
      try {
        setLoading(true);
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(
          `${SERVER}/users/user?search=${search}`,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            setSearchResults(result.data);
            setLoading(false);
            setSearch("");
          })
          .catch((error) => console.log("error", error));
      } catch (error) {
        toast.warn('Oops, Something went wrong', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      }
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat?.users?.find((u) => u._id === userToAdd?._id)) {
      toast.warn('Oops, User already in group', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      return;
    }
    // console.log("selectedChat?.groupAdmin?._id", selectedChat?.groupAdmin?._id);
    // console.log("user?._id", user);
    if (selectedChat?.groupAdmin?._id !== user?._id) {
      toast.error('Only Admin can add users', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      return;
    }

    try {
      setLoading(true);
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + token);

      let raw = JSON.stringify({
        chatId: selectedChat?._id,
        userId: userToAdd?._id,
      });

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${SERVER}/chat/group/add`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setSelectedChat(result.data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast.error('Oops, Something went wrong', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  };

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat?.groupAdmin?._id !== user?._id &&
      userToRemove?._id !== user?._id
    ) {
      toast.error('Only Admin can remove someone', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      return;
    }
    try {
      setLoading(true);
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + token);

      let raw = JSON.stringify({
        chatId: selectedChat?._id,
        userId: userToRemove?._id,
      });

      let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${SERVER}/chat/group/remove`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("userToRemove?._id", userToRemove?._id);
          console.log(
            "user?._id",
            user?._id === userToRemove?._id
          );
          userToRemove?._id === user?._id
            ? setSelectedChat()
            : setSelectedChat(result.data);
          setFetchAgain(!fetchAgain);
          fetchMessages();
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast.error('Something went wrong', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  };

  // messages
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setMessageLoading(true);
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);
      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `${SERVER}/message/${selectedChat?._id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(messages);
          setMessages(result.data);
          setMessageLoading(false);
          socket.emit("join chat", selectedChat?._id);
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast.error('Oops, Something went wrong', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }
  };

  const sendMessage = async (e) => {

    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat?._id)
      try {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + token);
        let raw = JSON.stringify({
          content: newMessage,
          chatId: selectedChat?._id,
        });

        let requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        fetch(`${SERVER}/message`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            setNewMessage("");
            socket.emit("new message", result.data);
            setMessages([...messages, result.data]);
            console.log(result.data);
          })
          .catch((error) => console.log("error", error));
      } catch (error) {
        toast.error('Oops, Something went wrong', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id);
    }

    let lastTying = new Date().getTime();
    let timer = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDifference = timeNow - lastTying;

      if (timeDifference >= timer && typing) {
        socket.emit("stop typing", selectedChat?._id);
        setTyping(false);
      }
    }, timer);
  };

  const [socketConnected, setSocketConnected] = useState(false);
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // typing functionality
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });


  return (
    <>
      {selectedChat ? (
        <>
          <div className="bg-white w-[100%] text-black flex border-2 border-black ">
            {!selectedChat.isGroupChat ? (
              <h1 className="text-3xl m-auto p-auto font-bold font-mono">
                {getSender(user, selectedChat.users).toUpperCase()}
              </h1>
            ) : (
              <div className="flex items-center justify-between w-[100%]">
                <h1 className="text-3xl m-auto p-auto font-bold font-mono">
                  {selectedChat.chatName}
                </h1>
                <Dialog>
                  <DialogTrigger asChild>
                    <Settings className="mr-5" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{selectedChat?.chatName}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-0">
                      {selectedChat?.users?.map((user) => {
                        return (
                          <div
                            key={user?._id}
                            className="flex gap-3 flex-row ml-2 flex-wrap "
                          >
                            <Badge className="flex items-center justify-center gap-1 cursor-pointer">
                              <p className="text-md font-mono">
                                {user.username}
                              </p>{" "}
                              <X size={14} onClick={() => handleRemove(user)} />
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                    <div className="grid gap-4 py-4">
                      <Label htmlFor="name" className="text-left text-sm ">
                        Group Name
                      </Label>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                          id="name"
                          defaultValue={
                            selectedChat?.chatName || "Enter Chat Name..."
                          }
                          className="col-span-3 border-2 border-white"
                          value={groupChatName}
                          onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button onClick={handleRename}>Update</Button>
                      </div>
                      <Label htmlFor="name" className="text-left text-sm">
                        Enter User Name to add user
                      </Label>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                          id="name"
                          className="col-span-3 border-2 border-white"
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    {loading ? (
                      <p>Loading</p>
                    ) : (
                      <>
                        {searchResults?.map((result) => (
                          <button
                            className={`w-[15vw] p-3 rounded flex items-center gap-5 `}
                            key={result?._id}
                            onClick={() => handleAddUser(result)}
                          >
                            <Avatar>
                              <AvatarImage
                                className="w-[3rem] h-[3rem] p-1"
                                style={{
                                  borderRadius: "50%",
                                  border: "2px solid gray",
                                }}
                                src={result?.avatar}
                              />
                              <AvatarFallback className="flex items-center text-center text-xl font-bold">{result?.username?.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-lg font-bold font-mono ">
                                {result?.username}
                              </p>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                    <DialogFooter>
                      <Button
                        type="submit"
                        letiant="destructive"
                        onClick={() => handleRemove(user)}
                      >
                        Leave Group
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-end p-3 bg-#E8E8E8 w-[100%] h-[100%] border-2 mt-2">
            {messageLoading ? (
              <Skeleton className="w-[40px] h-[40px] rounded-full m-auto" />
            ) : (
              <ScrollableChat className="messages" messages={messages} />
            )}
            {
              isTyping ? <h1 className="text-white mb-1 ml-1">typing...</h1> : ""
            }
            <Input
              type="text"
              placeholder="Write Something..."
              onKeyDown={sendMessage}
              onChange={typingHandler}
              value={newMessage}
              />
          </div>
        </>
      ) : (
        <h1 className="flex justify-center items-center text-3xl m-auto p-auto font-bold font-mono">
          SELECT ANY CHAT TO START CONVO!
        </h1>
      )}
    </>
  );
};

export default SingleChat;
