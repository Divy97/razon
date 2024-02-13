import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "./ui/button";

import { Search, Plus, X } from "lucide-react";
import { Input } from "./ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ChatState } from "@/context/ChatProvider.jsx";
import ChatBox from "./ChatBox";

// dialogue
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "./ui/badge";
import { SERVER } from "../constants.js";

const ChatSection = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats, token } =
    ChatState();
  // ChatState
  const { toast } = useToast();

  // fetch again
  const [fetchAgain, setFetchAgain] = useState(false);
  const fetchIndividualChats = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${SERVER}/chat`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to post', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
    
            setTimeout(() => {
              navigate('/login');
            }, 1500);
            return;
        }
        setChats(result.data);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userinfo")));
    fetchIndividualChats();
  }, [fetchAgain]);

  //search users

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const [loggedUser, setLoggedUser] = useState();

  const handleSearch = () => {
    if (!search) {
      toast({
        variant: "destructive",
        title: "Enter User name to search",
        description: "",
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

        fetch(`${SERVER}/users/user?search=${search}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            setSearchResults(result.data);
            setLoading(false);
            setSearch("");
          })
          .catch((error) => console.log("error", error));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Oops!",
          description: "Failed to load search results",
        });
      }
    }
  };

  const accessChat = (id) => {
    console.log("triggered");
    try {
      setChatLoading(true);
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + token);

      let raw = JSON.stringify({
        userId: id,
      });

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${SERVER}/chat`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (!chats.find((c) => c?._id === result?.data?._id)) {
            setChats([result.data, ...chats]);
          }
          setSelectedChat(result.data);
          setChatLoading(false);
          document?.getElementById("sheet")?.click();
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Failed to Create chat, try again later",
      });
    }
  };

  const selectChat = (id) => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${SERVER}/chat`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          result.data.map((e) => (e?._id == id ? setSelectedChat(e) : ""));
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Failed to Create chat, try again later",
      });
    }
  };

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id
      ? users[1]?.username
      : users[0]?.username;
  };

  //group chat

  const [groupChatName, setGroupChatName] = useState("");
  const [groupCreateSearch, setGroupCreateSearch] = useState("");
  const [groupCreateSearchResults, setGroupCreateSearchResults] = useState();
  const [groupCreateLoading, setGroupCreateLoading] = useState(false);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const handleGroupSearch = (query) => {
    setGroupCreateSearch(query);
    if (!query) {
      setGroupCreateSearchResults([]);
      return;
    }

    if (query != user?.username) {
      try {
        setGroupCreateLoading(true);
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(
          `${SERVER}/users/user?search=${groupCreateSearch}`,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            setGroupCreateSearchResults(result.data);
            setGroupCreateLoading(false);
            setGroupCreateSearch("");
          })
          .catch((error) => console.log("error", error));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Oops!",
          description: "Failed to load search results",
        });
      }
    }
  };

  const handleCreateChat = (userToAdd) => {
    if (selectedGroupUsers?.includes(userToAdd)) {
      toast({
        title: "User already in the group!",
      });
      return;
    }

    if (JSON.parse(user).username === userToAdd.username) {
      toast({
        title: "You are the group admin",
        variant: "destructive",
      });
      return;
    }

    setSelectedGroupUsers([...selectedGroupUsers, userToAdd]);
  };

  const handleDelete = (userToDelete) => {
    setSelectedGroupUsers(
      selectedGroupUsers.filter((sel) => sel?._id !== userToDelete?._id)
    );
  };

  const handleCreateGroup = () => {
    if (!groupChatName || !selectedGroupUsers) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Please fill all the fields",
      });
    }

    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer " + token);
      let raw = JSON.stringify({
        name: groupChatName,
        users: selectedGroupUsers.map((e) => e?._id),
      });

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${SERVER}/chat/group/create`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          document?.getElementById("dialogClose")?.click();
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Something went wrong",
      });
    }
  };

  return (
    <div>
      <Tabs
        defaultValue="Personal"
        className="w-[100vw] mt-5 flex flex-col justify-center items-center"
      >
        <TabsList className="w-[auto]">
          <TabsTrigger value="Personal" className="w-[10rem] font-semibold">
            Personal
          </TabsTrigger>
          <TabsTrigger value="Group" className="w-[10rem] font-semibold">
            Group
          </TabsTrigger>
        </TabsList>
        <Sheet>
          <SheetTrigger
            style={{
              position: "absolute",
              top: "8%",
              right: "8%",
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button className="flex items-center justify-between gap-2">
                    <Search />
                    <p className="text-lg font-bold font-mono">
                      Find Your Friends
                    </p>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-md font-bold font-mono">
                    Search your friends to chat
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Search Friends</SheetTitle>
              <SheetDescription>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search by Username"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="text-lg font-bold"
                    onClick={handleSearch}
                  >
                    Go
                  </Button>
                </div>
                {loading ? (
                  <div className="mt-5">
                    <div className="flex items-center space-x-4 mb-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mb-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mb-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    {searchResults?.map((result) => {
                      return (
                        <button
                          className="w-[20vw] p-3 dark:text-white rounded-full flex items-center gap-5 border-2 bg-outline mb-2 hover:bg-white hover:dark:text-black hover:border-black hover:cursor-pointer"
                          key={result?._id}
                          onClick={() => accessChat(result?._id)}
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
                            <AvatarFallback className="flex items-center text-center text-xl font-bold">
                              {result.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-lg font-bold font-mono">
                              {result.username.toUpperCase()} <br />{" "}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <TabsContent value="Personal" className="w-[100vw] p-10 flex">
          <div
            className={`w-[20vw] h-[75vh] border-2 flex flex-col p-2 items-center ${
              selectedChat ? "hideChats" : ""
            }`}
          >
            <Button className="gap-2 w-[10rem] mt-2 mb-2" variant="outline">
              <p className="text-lg font-bold font-mono">My Chats</p>
            </Button>
            {chatLoading ? (
              <>
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </>
            ) : (
              <div>
                {chats?.map((chat) => {
                  return (
                    !chat.isGroupChat && (
                      <button
                        className={`w-[15vw] p-3 rounded-full flex items-center gap-5 border-2 bg-outline mb-2 hover:cursor-pointer
                            ${
                              selectedChat?._id === chat?._id
                                ? "dark:bg-white dark:text-black bg-black text-white"
                                : "dark:text-white text-black"
                            }
                          `}
                        key={chat?._id}
                        onClick={() => selectChat(chat?._id)}
                      >
                        <Avatar>
                          <AvatarImage
                            className="w-[3rem] h-[3rem] p-1"
                            style={{
                              borderRadius: "50%",
                              border: "2px solid gray",
                            }}
                            src={chat?.avatar}
                          />
                          <AvatarFallback className="flex items-center text-center text-xl font-bold">
                            {getSender(loggedUser, chat.users)
                              .substring(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-lg font-bold font-mono">
                            {!chat.isGroupChat
                              ? getSender(loggedUser, chat.users)
                              : chat.chatName}{" "}
                            <br />{" "}
                            <p className="text-base font-sans font-medium">
                              {chat?.latestMessage?.content}
                            </p>
                          </p>
                        </div>
                      </button>
                    )
                  );
                })}
              </div>
            )}
          </div>
          <div className={`w-[70vw] h-[75vh] flex items-end border-2`}>
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        </TabsContent>
        <TabsContent
          value="Group"
          className="w-[100vw] p-10 flex"
          style={{
            marginTop: "-5rem",
          }}
        >
          <div className="w-[20vw] h-[75vh] border-2 flex flex-col p-2 items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center justify-between gap-2 ml-28 mt-2">
                  <Plus />
                  <p className="text-lg font-bold font-mono">Create Group</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Group Chat</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Group Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue="Chat name"
                      className="col-span-3"
                      value={groupChatName}
                      onChange={(e) => setGroupChatName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      UserName
                    </Label>
                    <Input
                      id="username"
                      defaultValue="Add Users..."
                      className="col-span-3"
                      value={groupCreateSearch}
                      onChange={(e) => handleGroupSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {selectedGroupUsers?.map((user) => {
                    return (
                      <Badge
                        key={user?._id}
                        className="flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <p className="text-md font-mono">{user.username}</p>{" "}
                        <X size={14} onClick={() => handleDelete(user)} />
                      </Badge>
                    );
                  })}
                </div>

                {groupCreateLoading ? (
                  <p>Loading</p>
                ) : (
                  <>
                    {groupCreateSearchResults?.slice(0, 4).map((result) => (
                      <button
                        className={`w-[15vw] p-3 rounded flex items-center gap-5 `}
                        key={result?._id}
                        onClick={() => handleCreateChat(result)}
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
                          <AvatarFallback className="flex items-center text-center text-xl font-bold">
                            {result.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-lg font-bold font-mono">
                            {result.username}
                          </p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
                <DialogFooter>
                  <Button type="submit" onClick={handleCreateGroup}>
                    Create Chat
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {chats?.map((chat) => {
              return (
                chat.isGroupChat && (
                  <button
                    className={`w-[15vw] mt-2 p-3 dark:text-white rounded-full flex items-center gap-5 border-2 bg-outline mb-2 hover:bg-white hover:dark:text-black hover:border-black hover:cursor-pointer
                      ${
                        selectedChat?._id === chat?._id
                          ? "bg-white dark:text-black"
                          : ""
                      }
                    `}
                    key={chat?._id}
                    onClick={() => selectChat(chat?._id)}
                  >
                    <Avatar>
                      <AvatarImage
                        className="w-[3rem] h-[3rem] p-1"
                        style={{
                          borderRadius: "50%",
                          border: "2px solid gray",
                        }}
                        src={chat?.avatar}
                      />
                      <AvatarFallback className="flex items-center text-center text-xl font-bold">
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                              ?.substring(0, 2)
                              .toUpperCase()
                          : chat.chatName?.substring(0, 2)?.toUpperCase()}{" "}
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-bold font-mono">
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}{" "}
                        <p className="text-base font-sans font-medium">
                          {chat?.latestMessage?.content}
                        </p>
                      </p>
                    </div>
                  </button>
                )
              );
            })}
          </div>
          <div className="w-[70vw] h-[75vh] border-2">
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatSection;
