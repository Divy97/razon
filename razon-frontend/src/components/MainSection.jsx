import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  ThumbsUp,
  ThumbsDown,
  MessageSquareQuote,
  List,
  Flag,
  CircleSlash2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SERVER } from "../constants.js";

import { Link, useNavigate } from "react-router-dom";
import { calculateTime } from "./utils/calculateTime.js";
import CreatePost from "./CreatePost.jsx";

import { toast } from "react-toastify";
import { ChatState } from "@/context/ChatProvider.jsx";

const MainSection = () => {
  const navigate = useNavigate();
  const { user } = ChatState();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${SERVER}/posts/get-posts`, requestOptions)
      .then((response) => response.json())
      .then((result) => setPosts(result.data))
      .catch((error) => console.log("error", error));
  }, []);

  const handleProfile = (name) => {
    navigate(`/profile/${name}`);
  };

  return (
    <div>
      <CreatePost />
      <ScrollArea className="h-[78vh] w-full md:w-[70vw] rounded-md border p-5 mx-auto my-5 text-justify">
        {posts.map((post) => (
          <Card key={post._id} className="mb-5 w-[90%] mx-auto h-[auto] p-4 ">
            <div className="flex items-start justify-between px-5 py-2 ">
              <div className="flex items-center justify-around gap-3">
                <Avatar
                  onClick={() => handleProfile(post?.user?.username)}
                  className="cursor-pointer"
                >
                  <AvatarImage
                    className="w-[3rem] h-[3rem]"
                    style={{
                      borderRadius: "50%",
                      border: "2px solid gray",
                    }}
                    src={post?.user?.avatar}
                  />
                  <AvatarFallback className="flex items-center text-center text-xl font-bold">
                    {post?.user?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-xl font-extrabold text-center">
                  {post?.user?.username?.toUpperCase()}
                </h1>
                <h1 className="hidden md:inline md:text-xl font-bold text-center">
                  Posted {calculateTime(post?.createdAt)}
                </h1>
              </div>
              <div className="flex gap-2 items-center justify-center">
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer">
                      <List />
                    </MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem className="flex gap-5 items-center">
                        <CircleSlash2 />{" "}
                        <p
                          className="md:text-lg cursor-pointer"
                          onClick={() => {
                            toast.info("You have a good taste, NOTED", {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "dark",
                            });
                          }}
                        >
                          Do Not recommend
                        </p>
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem className="flex gap-5 items-center">
                        <Flag />{" "}
                        <p
                          className="md:text-lg cursor-pointer"
                          onClick={() => {
                            toast.info("AYE AYE CAPTAIN, REPORTED", {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "dark",
                            });
                          }}
                        >
                          Report
                        </p>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            </div>
            <Link to={`/post/${post._id}`}>
              <div>
                {post.image && (
                  <img
                    src={post?.image}
                    alt="Image"
                    className="rounded-md object-contain m-auto h-[300px] w-[500px]"
                  />
                )}
              </div>
              <CardHeader className="flex w-100 flex-row items-center max-h-10 gap-2 ">
                <CardTitle>{post.title}</CardTitle>
                <div className="flex flex-row items-center gap-2 pb-1">
                  {post.tags.map(
                    (tag, index) =>
                      tag !== "undefined" &&
                      tag !== "[]" && 
                      tag !== "" &&(
                        <Badge key={index} className="dark:bg-white bg-black">
                          {tag}
                        </Badge>
                      )
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
              </CardContent>
              <CardFooter className="flex gap-2 items-center pb-5 m-0">
                <div className="flex gap-2 items-center justify-center">
                  {post?.upvotes?.includes(user?._id) ? (
                    <ThumbsUp fill="#C13584" />
                  ) : (
                    <ThumbsUp />
                  )}{" "}
                  <p>{post.upvotes.length} Upvotes</p>
                </div>
                <div className="flex gap-2 items-center justify-center">
                  {post?.downvotes?.includes(user?._id) ? (
                    <ThumbsDown fill="#C13584" />
                  ) : (
                    <ThumbsDown />
                  )}
                  <p>{post.downvotes.length} Downvotes</p>
                </div>
                <div className="flex gap-2 items-center justify-center">
                  <MessageSquareQuote /> <p>{post.comments.length} <span className="hidden md:inline">Comments</span></p>
                </div>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
};

export default MainSection;
