import { ChatState } from "@/context/ChatProvider";
import Navigation from "../Navigation";
import "./UserProfile.css";

import {
  CircleUserRound,
  BadgePlus,
  Zap,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  MessageSquareQuote,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { SERVER } from "@/constants";

import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { calculateTime } from "../utils/calculateTime";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";


const UserProfile = () => {
  const { user: loggedInUser, token } = ChatState();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();

  const navigate = useNavigate();
  const { username } = useParams();
  const [reload, setReload] = useState(false);
  const follow = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:8080/api/v1/users/followUser/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success("Followed", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setReload(!reload)
          navigate(`/profile/${username}`);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const unFollow = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/users/unFollowUser/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          toast.success("UnFollowed", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setReload(!reload)
          navigate(`/profile/${username}`);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${SERVER}/posts/get-posts/${username}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setPosts(result?.data);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast.warn("Oops, Can't get posts from this user", {
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
  }, [reload]);

  useEffect(() => {
    try {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${SERVER}/users/user/${username}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setUser(result.data);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      toast.warn("Oops, something went wrong", {
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
  }, [reload]);

  console.log(user);
  return (
    <div className="h-[100vh]">
      <Navigation />
      {user && posts ? (
        <div className="h-[90vh] flex pl-36 pr-36 mt-5 gap-5">
          <div className="flex h-[90vh] flex-col w-[65vw] border-2">
            <h1 className="m-5 mb-2 font-mono font-bold text-3xl">
              Your Posts
            </h1>
            <div className="h-[100%]">
              <div className="w-[97%] ml-5 border-2 h-[5rem] flex justify-start items-center">
                <div className="w-[10rem] cursor-pointer ml-10">
                  <div className="flex gap-5 items-center">
                    <BadgePlus />
                    <h1 className="text-2xl font-bold">New</h1>
                  </div>
                </div>
                <div className="w-[10rem] cursor-pointer">
                  <div className="flex gap-5 items-center">
                    <Zap />
                    <h1 className="text-2xl font-bold">Hot</h1>
                  </div>
                </div>
                <div className="w-[10rem] c0ursor-pointer">
                  <div className="flex gap-5 items-center">
                    <TrendingUp />
                    <h1 className="text-2xl font-bold">Top</h1>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <ScrollArea className="h-[71vh] w-[100%] rounded-md  p-5 mx-auto my-5 text-justify">
                  {posts?.map((post) => (
                    <Card key={post._id} className="mb-5 w-[100%] h-[auto] p-4">
                      <div className="flex items-start justify-between px-5 py-2">
                        <div className="flex items-center justify-around gap-3">
                          <Avatar>
                            <AvatarImage
                              className="w-[3rem] h-[3rem]"
                              style={{
                                borderRadius: "50%",
                                border: "2px solid gray",
                              }}
                              src={post?.user?.avatar}
                            />
                            <AvatarFallback className="flex items-center text-center text-xl font-bold">
                              {post?.user?.username
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <h1 className="text-xl font-extrabold text-center">
                            {post?.user?.username?.toUpperCase()}
                          </h1>
                          <h1 className="text-xl font-bold text-center">
                            Posted {calculateTime(post?.createdAt)}
                          </h1>
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
                        <CardHeader className="flex w-100 flex-row items-center max-h-10 gap-2">
                          <CardTitle>{post.title}</CardTitle>
                          <div className="flex flex-row items-center gap-2 pb-1">
                            {post.tags.map(
                              (tag, index) =>
                                tag !== "undefined" &&
                                tag !== "[]" && (
                                  <Badge
                                    key={index}
                                    className="dark:bg-white bg-black"
                                  >
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
                            <ThumbsUp /> <p>{post.upvotes.length} Upvotes</p>
                          </div>
                          <div className="flex gap-2 items-center justify-center">
                            <ThumbsDown />{" "}
                            <p>{post.downvotes.length} Downvotes</p>
                          </div>
                          <div className="flex gap-2 items-center justify-center">
                            <MessageSquareQuote />{" "}
                            <p>{post.comments.length} Comments</p>
                          </div>
                        </CardFooter>
                      </Link>
                    </Card>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[25vw] h-[55vh] border-2 items-center pt-7">
            <div className="w-56 h-56 rounded-full border-2 border-red-600 mt-5 ">
              <img src={user?.avatar} className="w-56 h-56 rounded-full p-3" />
            </div>
            <h1 className="text-center m-2 font-sans font-bold text-3xl">
              {user?.username?.toUpperCase()}
            </h1>
            <div className="flex flex-wrap gap-5 ml-20 mt-5">
              <div className="w-[10rem]">
                <h1 className="text-xl font-bold">Followers</h1>
                <div className="flex gap-2 items-center">
                  <CircleUserRound />
                  <h1 className="text-xl font-bold">
                    {user?.followers?.length}
                  </h1>
                </div>
              </div>
              <div className="w-[10rem]">
                <h1 className="text-xl font-bold">Following</h1>
                <div className="flex gap-2 items-center">
                  <CircleUserRound />
                  <h1 className="text-xl font-bold">
                    {user?.following?.length}
                  </h1>
                </div>
              </div>
            </div>
            {loggedInUser?.username === user?.username ? (
              <Button className="w-[90%] rounded-3xl mt-12 ml-2 mr-2 font-extrabold text-xl"
              onClick={
                () => navigate('/create-post')
              }
              >
                New Post
              </Button>
            ) : user?.followers.includes(loggedInUser?._id) ? (
              <Button
                className="w-[90%] rounded-3xl mt-12 ml-2 mr-2 font-extrabold text-xl"
                onClick={() => unFollow(user?._id)}
              >
                UnFollow
              </Button>
            ) : (
              <Button
                className="w-[90%] rounded-3xl mt-12 ml-2 mr-2 font-extrabold text-xl"
                onClick={() => follow(user?._id)}
              >
                Follow
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[100vh]">
          Loading.....
        </div>
      )}
    </div>
  );
};

export default UserProfile;
