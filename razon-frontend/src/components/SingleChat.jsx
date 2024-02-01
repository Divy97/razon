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
import { useToast } from "@/components/ui/use-toast";

import { Settings, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { toast } = useToast();

  const getSender = (loggedUser, users) => {
    return users[0]?._id != loggedUser?._id
      ? users[1]?.username
      : users[0]?.username;
  };
  const { user, selectedChat, setSelectedChat } = ChatState();

  //change in group (add, remove, rename)
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleDelete = () => {};
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI1ZTkwMzcwMWY3NTVkZTg2ZThiMmMiLCJ1c2VybmFtZSI6InR3byIsImlhdCI6MTcwNjc5NzIzNCwiZXhwIjoxNzA2ODgzNjM0fQ.2PUUbLn7okQ7kkN5WimBzPW1I2KuW_yPESzHSqJRdHM"
      );

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

      fetch("http://localhost:8080/api/v1/chat/group/rename", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setSelectedChat(result.data);
          setFetchAgain(!fetchAgain);
          setRenameLoading(false);
          toast({
            title: "Group renamed Successfully",
            description: "",
          });
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Something went wrong",
      });
    }
    document?.getElementById("dialogClose")?.click();
    setGroupChatName("");
  };

  const handleSearch = (search) => {
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
        myHeaders.append(
          "Authorization",
          "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI1ZTkwMzcwMWY3NTVkZTg2ZThiMmMiLCJ1c2VybmFtZSI6InR3byIsImlhdCI6MTcwNjc5NzIzNCwiZXhwIjoxNzA2ODgzNjM0fQ.2PUUbLn7okQ7kkN5WimBzPW1I2KuW_yPESzHSqJRdHM"
        );

        let requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(
          `http://localhost:8080/api/v1/users/user?search=${search}`,
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
        toast({
          variant: "destructive",
          title: "Oops!",
          description: "Failed to load search results",
        });
      }
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat?.users?.find((u) => u._id === userToAdd?._id)) {
      toast({
        title: "User already in the group!",
      });
      return;
    }
    // console.log("selectedChat?.groupAdmin?._id", selectedChat?.groupAdmin?._id);
    // console.log("user?._id", user);
    if (selectedChat?.groupAdmin?._id !== JSON.parse(user)?._id) {
      toast({
        title: "Only Admins can add someone",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI1ZTkwMzcwMWY3NTVkZTg2ZThiMmMiLCJ1c2VybmFtZSI6InR3byIsImlhdCI6MTcwNjc5NzIzNCwiZXhwIjoxNzA2ODgzNjM0fQ.2PUUbLn7okQ7kkN5WimBzPW1I2KuW_yPESzHSqJRdHM"
      );

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

      fetch("http://localhost:8080/api/v1/chat/group/add", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          setSelectedChat(result.data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat?.groupAdmin?._id !== JSON.parse(user)?._id &&
      userToRemove?._id !== JSON.parse(user)?._id
    ) {
      toast({
        title: "Only Admins can remove someone",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWI1ZTkwMzcwMWY3NTVkZTg2ZThiMmMiLCJ1c2VybmFtZSI6InR3byIsImlhdCI6MTcwNjc5NzIzNCwiZXhwIjoxNzA2ODgzNjM0fQ.2PUUbLn7okQ7kkN5WimBzPW1I2KuW_yPESzHSqJRdHM"
      );

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

      fetch("http://localhost:8080/api/v1/chat/group/remove", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log("userToRemove?._id", userToRemove?._id);
          console.log("JSON.parse(user)?._id", JSON.parse(user)?._id === userToRemove?._id);
          userToRemove?._id === JSON.parse(user)?._id ? setSelectedChat() : setSelectedChat(result.data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <div className="bg-white w-[100%] text-black flex border-2 border-black">
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
                            className="flex gap-3 flex-row ml-2 flex-wrap"
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
                      <Label htmlFor="name" className="text-left text-sm">
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
                                src="https://github.com/shadcn.png"
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-lg font-bold font-mono">
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
                        variant="destructive"
                        onClick={() => handleRemove(JSON.parse(user))}
                      >
                        Leave Group
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-end p-3 bg-#E8E8E8 w-[100%] h-[100%] border-2 border-black dark:border-white overflow-hidden mt-2"></div>
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
