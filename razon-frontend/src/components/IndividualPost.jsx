import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import { Textarea } from "@/components/ui/textarea";

import {
  X,
  UserPlus,
  UserMinus,
  ThumbsUp,
  ThumbsDown,
  MessageSquareQuote,
  Flag,
} from "lucide-react";

import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { calculateTime } from "./utils/calculateTime";
import { ChatState } from "@/context/ChatProvider";
import { ScrollArea } from "./ui/scroll-area";
import { SERVER } from "../constants.js";
import {toast} from 'react-toastify';

const IndividualPost = () => {
  const { postId } = useParams();
  const { user, token } = ChatState();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [postDetails, setPostDetails] = useState([]);
  const fetchPostDetails = () => {
    const t = localStorage.getItem("token");
    setLoading(true);
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + t);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${SERVER}/posts/get-posts-info/${postId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setPostDetails(result.data);
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  const fetchPostDetailsAgain = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${SERVER}/posts/get-posts-info/${postId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setPostDetails(result.data);
      })
      .catch((error) => console.log("error", error));
  };

  const [postComments, setPostComments] = useState();
  const fetchPostComments = () => {
    const t = localStorage.getItem("token");
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + t);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${SERVER}/posts/post-comments/${postId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
          
        setPostComments(result.data);
      })
      .catch((error) => console.log("error", error));
  };

  const likePost = (id) => {
    console.log("like");
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(`${SERVER}/posts/upvote?post_id=${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to Like', {
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
        fetchPostDetailsAgain();
      })
      .catch((error) => console.log("error", error));
  };

  const unLikePost = (id) => {
    console.log("like");
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(`${SERVER}/posts/downvote?post_id=${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to UnLink', {
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
        fetchPostDetailsAgain();
      })
      .catch((error) => console.log("error", error));
  };

  const [commentContent, setCommentContent] = useState("");
  const createComment = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);

    let raw = JSON.stringify({
      content: commentContent,
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${SERVER}/posts/create-comment?post_id=${postId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to comment', {
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
        fetchPostComments();
        setCommentContent("");
      })
      .catch((error) => console.log("error", error));
  };

  const likeComment = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${SERVER}/posts/upvote-comment?comment_id=${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to Like', {
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
        fetchPostComments();
      })
      .catch((error) => console.log("error", error));
  };

  const unLikeComment = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${SERVER}/posts/downvote-comment?comment_id=${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to Dislike', {
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
        fetchPostComments();
      })
      .catch((error) => console.log("error", error));
  };

  const [repliesMap, setRepliesMap] = useState({});
  const fetchCommentReplies = async (commentId) => {
    try {
      const response = await fetch(
        `${SERVER}/posts/comment-replies/${commentId}`
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching comment replies: ${response.statusText}`
        );
      }
      const reply = await response.json();
      console.log("reply", reply);

      const processedReplies = reply?.data?.map((reply) => ({
        ...reply,
        user: {
          _id: reply?.user?._id,
          username: reply?.user?.username,
          avatar: reply?.user?.avatar,
        },
      }));

      return processedReplies;
    } catch (error) {
      console.error("Error fetching comment replies:", error.message);
      throw error; // Rethrow the error to be caught in the calling function
    }
  };

  const fetchCommentsAndReplies = async (comment) => {
    const commentId = comment?._id;
    try {
      const replies = await fetchCommentReplies(commentId);

      setRepliesMap((prevMap) => ({
        ...prevMap,
        [commentId]: replies,
      }));
      console.log("Type of repliesMap[comment?._id]:", typeof replies, replies);
    } catch (error) {
      console.error("Error fetching comment replies:", error.message);
    }
  };

  useEffect(() => {
    if (postComments) {
      postComments?.forEach((comment) => {
        console.log("comment", comment);
        fetchCommentsAndReplies(comment);
      });
    }
  }, [postComments]);

  const follow = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${SERVER}/users/followUser/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to Follow', {
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
        setTimeout(() => {
          fetchPostDetails();
        }, 100);
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

    fetch(`${SERVER}/users/unFollowUser/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to UnFollow', {
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
        setTimeout(() => {
          fetchPostDetails();
        }, 100);
      })
      .catch((error) => console.log("error", error));
  };

  // comments
  const [commentBox, setCommentBox] = useState(false);

  // comment's reply
  const [replyCommentBox, setReplyCommentBox] = useState(false);
  const [replyBoxId, setReplyBoxId] = useState(null);

  const commentReplyBoxHandler = (id) => {
    setReplyBoxId((prevId) => (prevId === id ? null : id));
    setReplyCommentBox(true);
  };

  const [replyContent, setReplyContent] = useState("");
  const createReply = (comment_id) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + token);

    let raw = JSON.stringify({
      content: replyContent,
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${SERVER}/posts/create-reply/${comment_id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to reply', {
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
        fetchPostComments();
        setReplyContent("");
      })
      .catch((error) => console.log("error", error));
  };

  const likeReply = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${SERVER}/posts/upvote-nested-reply?reply_id=${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to Like', {
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
        fetchPostComments();
      })
      .catch((error) => console.log("error", error));
  };

  const unLikeReply = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${SERVER}/posts/downvote-nested-reply?reply_id=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if(result.message == "jwt malformed") {
          toast.warn('Oops, You have to login to DisLike', {
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
        console.log(result);
        fetchPostComments();
      })
      .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    const fetchData = () => {
      fetchPostDetails();
      fetchPostComments();
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navigation />
      <ScrollArea className="h-[88vh] rounded-md border  md:p-5 mx-auto my-5 text-justify">
        {loading ? (
          <div className="w-100 h-[90vh] flex items-center justify-center">
            <h1 className="text-xl md:text-3xl font-mono font-bold">Loading...</h1>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">


            <div className="h-[6vh] w-[90vw] md:w-[60vw] mt-5 border-2 pl-5 pr-5 rounded flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <h3 className="text-xl font-bold font-serif">
                  {postDetails?.title}
                </h3>
                {postDetails?.tags?.map((tag, index) => {
                  return (
                    tag !== "undefined" && (
                      <Badge
                        key={index}
                        className="dark:bg-white bg-black w-[auto] h-4"
                      >
                        {tag}
                      </Badge>
                    )
                  );
                })}
              </div>
              <Link to="/">
                <Button
                  variant="outline"
                  className="md:w-[6rem] p-2 h-[2rem] text-md flex items-center justify-around"
                >
                  <X size={18} /> <span> Close </span>
                </Button>
              </Link>
            </div>



            <div className="h-[auto] w-[90vw] md:w-[60vw] border-2 ">
              <div className="h-[2vh] w-[90vw] md:w-[60vw] pt-7 pl-5 pr-5 rounded flex justify-between items-center">
                <div className="flex items-center justify-around gap-3">
                  <Avatar onClick={() => {
                          navigate(`/profile/${postDetails?.user?.username}`)
                        }} className="cursor-pointer">
                    <AvatarImage
                      className="w-[3rem] h-[3rem]"
                      style={{
                        borderRadius: "50%",
                        border: "2px solid gray",
                      }}
                      src={postDetails?.user?.avatar}
                    />
                    <AvatarFallback className="flex items-center text-center md:text-xl font-bold">
                      {postDetails?.user?.username
                        ?.substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-xl font-extrabold text-center">
                    {postDetails?.user?.username?.toUpperCase()}
                  </h1>
                  <h1 className="hidden sm:inline md:text-xl font-bold text-center">
                    Posted {calculateTime(postDetails?.createdAt)}
                  </h1>
                </div>

                <div>

                {postDetails?.user?.followers.includes(user?._id) ? (
                  <UserMinus
                  className="cursor-pointer "
                  onClick={() => {
                    unFollow(postDetails?.user?._id);
                  }}
                  />
                  ) : (
                    <UserPlus
                    className="cursor-pointer "
                    onClick={() => {
                      follow(postDetails?.user?._id);
                    }}
                    />
                    )}
                    </div>
              </div>
              <div className="mt-7">
                <h3 className="text-xl md:text-3xl font-bold font-serif p-16 pb-0 pt-0">
                  {postDetails?.title}
                </h3>
                <div className="">

                {postDetails?.image && (
                  <img
                  src={postDetails?.image}
                  alt="postImage"
                  className="p-8 mx-auto md:h-[25rem] object-fit rounded"
                  />
                  )}
                  </div>
                {postDetails?.content && (
                  <h1 className="p-16 pt-3 text-justify text-lg font-bold font-sans">
                    {postDetails?.content}
                  </h1>
                )}
                <div className="flex pt-0 pb-2 p-16 gap-3">
                  <div
                    className="cursor-pointer flex gap-2 items-center justify-center"
                    onClick={() => likePost(postDetails?._id)}
                  >
                    {postDetails?.upvotes?.includes(user?._id) ? (
                      <ThumbsUp fill="#C13584" />
                    ) : (
                      <ThumbsUp />
                    )}
                    <p>{postDetails?.upvotes?.length} <span className="hidden md:inline">Upvotes</span></p>
                  </div>
                  <div
                    className="cursor-pointer flex gap-2 items-center justify-center"
                    onClick={() => unLikePost(postDetails?._id)}
                  >
                    {postDetails?.downvotes?.includes(user?._id) ? (
                      <ThumbsDown fill="#C13584" />
                    ) : (
                      <ThumbsDown />
                    )}

                    <p>{postDetails?.downvotes?.length} <span className="hidden md:inline">Downvotes</span></p>
                  </div>
                  <div
                    className="cursor-pointer flex gap-2 items-center justify-center"
                    onClick={() => setCommentBox(!commentBox)}
                  >
                    <MessageSquareQuote />
                    
                    <p>{postDetails?.comments?.length} <span className="hidden md:inline">Comments</span></p>
                  </div>
                  <div className="cursor-pointer flex gap-2 items-center justify-center "
                   onClick={() => {
                    toast.info("AYE AYE CAPTAIN, REPORTED", {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                    });
                    }}
                  >
                    <Flag /> <span className="hidden md:inline">Report</span>
                  </div>
                </div>
              </div>
              <div>
                {commentBox ? (
                  <div className="md:pt-2 md:pb-5 md:p-16 pl-16 ">
                    <Textarea
                      className="border-2 border-white font-mono font-md font-bold focus:border-0"
                      placeholder="Type your message here."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button
                        className="mt-2 text-lg border-2 border-white"
                        variant="outline"
                        onClick={createComment}
                      >
                        <span className="hidden md:inline">Comment</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {postDetails?.comments?.length > 0 ? <h1 className="text-xl md:text-2xl font-bold pt-2 pb-2 p-16">Comments</h1> : <h1 className="text-xl md:text-2xl font-bold pt-2 pb-2 p-16">Write a Comment</h1>}
              <div className="md:pt-2 md:p-16 pl-8">
                {postComments?.map((comment) => (
                  <div key={comment?._id}>
                    <div className="flex items-center gap-4">
                      <Avatar onClick={() => {
                          navigate(`/profile/${comment?.user?.username}`)
                        }} className="cursor-pointer" >
                        <AvatarImage
                          className="w-[3rem] h-[3rem]"
                          style={{
                            borderRadius: "50%",
                            border: "2px solid gray",
                          }}
                          src={comment?.user?.avatar}
                        />
                        <AvatarFallback className="flex items-center text-center  md:text-xl font-bold">
                          {comment?.user?.username
                            ?.substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h1 className="text-lg font-extrabold text-center">
                        {comment?.user?.username?.toUpperCase()}
                      </h1>
                      <h1 className="hidden sm:inline md:text-lg font-bold text-center">
                        Posted {calculateTime(comment?.createdAt)}
                      </h1>
                    </div>
                    <h1 className="md:text-xl font-bold font-mono pt-1 pb-3 p-14">
                      {comment?.content}
                    </h1>
                    <div className="flex pt-0 pb-5 p-14 gap-3">
                      <div
                        className="cursor-pointer flex gap-2 items-center justify-center"
                        onClick={() => likeComment(comment?._id)}
                      >
                        {comment?.upvotes?.includes(user?._id) ? (
                          <ThumbsUp fill="#C13584" />
                        ) : (
                          <ThumbsUp />
                        )}
                        <p>{comment?.upvotes?.length} <span className="hidden md:inline">Upvotes</span></p>
                      </div>
                      <div
                        className="cursor-pointer flex gap-2 items-center justify-center"
                        onClick={() => unLikeComment(comment?._id)}
                      >
                        {comment?.downvotes?.includes(user?._id) ? (
                          <ThumbsDown fill="#C13584" />
                        ) : (
                          <ThumbsDown />
                        )}

                        <p>{comment?.downvotes?.length} <span className="hidden md:inline">Downvotes</span></p>
                      </div>
                      <div
                        className="cursor-pointer flex gap-2 items-center justify-center"
                        onClick={() => commentReplyBoxHandler(comment?._id)}
                      >
                        <MessageSquareQuote />
                        <p>{comment?.replies?.length} <span className="hidden md:inline">Replies</span></p>
                      </div>
                      <div className="cursor-pointer flex gap-2 items-center justify-center">
                        <Flag /> <span className="hidden md:inline">Report</span>
                      </div>
                    </div>
                    {replyCommentBox && comment?._id === replyBoxId ? (
                      <div className="pt-2 pb-5 p-16">
                        <Textarea
                          className="border-2 border-white font-mono font-md font-bold focus:border-0"
                          placeholder="Type your reply here."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex items-center justify-end">
                          <Button
                            className="mt-2 md:text-lg border-2 border-white"
                            variant="outline"
                            onClick={() => createReply(comment?._id)}
                          >
                            Reply
                          </Button>
                        </div>
                        {repliesMap[comment?._id]?.map((reply) => {
                          console.log("reply", reply);
                          return (
                            <>
                              <div key={reply._id}>
                                <div className="flex items-center gap-2 justify-start">
                                  <Avatar onClick={() => {
                          navigate(`/profile/${reply?.user?.username}`)
                        }} className="cursor-pointer" >
                                    <AvatarImage
                                      className="w-[2rem] h-[2rem]"
                                      style={{
                                        borderRadius: "50%",
                                        border: "2px solid gray",
                                      }}
                                      src={reply?.user?.avatar}
                                    />
                                    <AvatarFallback className="flex items-center text-center md:text-xl font-bold">
                                      {reply?.user?.username
                                        ?.substring(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex gap-2 items-center mt-[-0.5rem]">
                                    <h1 className="md:text-lg font-extrabold text-center">
                                      {reply?.user?.username?.toUpperCase()}
                                    </h1>
                                    <h1 className="hidden sm:inline md:text-lg md:font-bold text-center">
                                      Posted {calculateTime(reply?.createdAt)}
                                    </h1>
                                  </div>
                                </div>
                                <h1 className="text-xl font-bold font-mono pt-0 pb-0 p-12">
                                  {reply?.content}
                                </h1>
                              </div>
                              <div className="flex pt-2 pb-5 p-12 gap-3">
                                <div
                                  className="cursor-pointer flex gap-2 items-center justify-center"
                                  onClick={() => likeReply(reply?._id)}
                                >
                                  {reply?.upvotes?.includes(user?._id) ? (
                                    <ThumbsUp fill="#C13584" />
                                  ) : (
                                    <ThumbsUp />
                                  )}
                                  <p>{reply?.upvotes?.length} <span className="hidden md:inline">Upvotes</span></p>
                                </div>
                                <div
                                  className="cursor-pointer flex gap-2 items-center justify-center"
                                  onClick={() => unLikeReply(reply?._id)}
                                >
                                  {reply?.downvotes?.includes(user?._id) ? (
                                    <ThumbsDown fill="#C13584" />
                                  ) : (
                                    <ThumbsDown />
                                  )}

                                  <p>{reply?.downvotes?.length} <span className="hidden md:inline">Downvotes</span></p>
                                </div>
                                <div className="cursor-pointer flex gap-2 items-center justify-center">
                                  <Flag /> <span className="hidden md:inline">Report</span>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default IndividualPost;
