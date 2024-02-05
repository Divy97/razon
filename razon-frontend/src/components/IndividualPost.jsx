import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

const IndividualPost = () => {
  const { postId } = useParams();
  const storedToken = localStorage.getItem("token");

  const { user } = ChatState();
  const [loading, setLoading] = useState(false);
  const [postDetails, setPostDetails] = useState([]);
  const fetchPostDetails = () => {
    setLoading(true);
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/posts/get-posts-info/${postId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setPostDetails(result.data);
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  const fetchPostDetailsAgain = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/posts/get-posts-info/${postId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setPostDetails(result.data);
      })
      .catch((error) => console.log("error", error));
  };

  const [postComments, setPostComments] = useState();
  const fetchPostComments = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/posts/post-comments/${postId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setPostComments(result.data);
      })
      .catch((error) => console.log("error", error));
  };

  const likePost = (id) => {
    console.log("like");
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(
      `http://localhost:8080/api/v1/posts/upvote?post_id=${id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        fetchPostDetailsAgain();
      })
      .catch((error) => console.log("error", error));
  };

  const unLikePost = (id) => {
    console.log("like");
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(
      `http://localhost:8080/api/v1/posts/downvote?post_id=${id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        fetchPostDetailsAgain();
      })
      .catch((error) => console.log("error", error));
  };

  const [commentContent, setCommentContent] = useState("");
  const createComment = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let raw = JSON.stringify({
      content: commentContent,
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/posts/create-comment?post_id=${postId}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        fetchPostComments();
        setCommentContent("");
      })
      .catch((error) => console.log("error", error));
  };

  const likeComment = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/posts/upvote-comment?comment_id=${id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        fetchPostComments();
      })
      .catch((error) => console.log("error", error));
  };

  const unLikeComment = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/posts/downvote-comment?comment_id=${id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        fetchPostComments();
      })
      .catch((error) => console.log("error", error));
  };

  const [repliesMap, setRepliesMap] = useState({});
  const fetchCommentReplies = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/posts/comment-replies/${commentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Error fetching comment replies: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching comment replies:", error.message);
      return [];
    }
  };

  const fetchCommentsAndReplies = async (comment) => {
    console.log(comment?._id);
    const commentId = comment?._id;
    const replies = await fetchCommentReplies(commentId);
    setRepliesMap((prevMap) => ({
      ...prevMap,
      [commentId]: replies,
    }));
  };

  useEffect(() => {
    if (postComments) {
      postComments.forEach((comment) => {
        fetchCommentsAndReplies(comment);
      });
    }
  }, [postComments]);

  const follow = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:8080/api/v1/users/followUser/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setTimeout(() => {
          fetchPostDetails();
        }, 100);
      })
      .catch((error) => console.log("error", error));
  };

  const unFollow = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/users/unFollowUser/${id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
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

  const [replyContent, setReplyContent] = useState('');
  const createReply = (comment_id) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let raw = JSON.stringify({
      content: replyContent,
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/posts/create-reply/${comment_id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        fetchPostComments();
        setReplyContent("");
      })
      .catch((error) => console.log("error", error));
  }

  const likeReply = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/posts/upvote-nested-reply?reply_id=${id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        fetchPostComments();
      })
      .catch((error) => console.log("error", error));
  };

  const unLikeReply = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + storedToken);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8080/api/v1/posts/downvote-nested-reply?reply_id=${id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        fetchPostComments();
      })
      .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    fetchPostDetails();
    fetchPostComments();
  }, [postId]);

  return (
    <div>
      <Navigation />
      <ScrollArea className="h-[88vh] rounded-md border p-5 mx-auto my-5 text-justify">
        {loading ? (
          <div className="w-100 h-[90vh] flex items-center justify-center">
            <h1 className="text-3xl font-mono font-bold">Loading...</h1>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="h-[6vh] w-[60vw] mt-5 border-2 pl-5 pr-5 rounded flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <h3 className="text-xl font-bold font-serif">
                  {postDetails?.title}
                </h3>
                {postDetails?.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    className="dark:bg-white bg-black w-[auto] h-4"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link to="/">
                <Button
                  variant="outline"
                  className="w-[6rem] p-2 h-[2rem] text-md flex items-center justify-around"
                >
                  <X size={18} /> <span> Close </span>
                </Button>
              </Link>
            </div>
            <div className="h-[auto] w-[60vw] border-2">
              <div className="h-[2vh] w-[60vw] pt-7 pl-5 pr-5 rounded flex justify-between items-center">
                <div className="flex items-center justify-around gap-3">
                  <Avatar>
                    <AvatarImage
                      className="w-[3rem] h-[3rem]"
                      style={{
                        borderRadius: "50%",
                        border: "2px solid gray",
                      }}
                      src="https://github.com/shadcn.png"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <h1 className="text-xl font-extrabold text-center">
                    {postDetails?.user?.username?.toUpperCase()}
                  </h1>
                  <h1 className="text-xl font-bold text-center">
                    Posted {calculateTime(postDetails?.createdAt)}
                  </h1>
                </div>
                {postDetails?.user?.followers.includes(JSON.parse(user)._id) ? (
                  <UserMinus
                    className="cursor-pointer"
                    onClick={() => {
                      unFollow(postDetails?.user?._id);
                    }}
                  />
                ) : (
                  <UserPlus
                    className="cursor-pointer"
                    onClick={() => {
                      follow(postDetails?.user?._id);
                    }}
                  />
                )}
              </div>
              <div className="mt-7">
              <h3 className="text-3xl font-bold font-serif p-16 pb-0 pt-0">
                  {postDetails?.title}
                </h3>                {postDetails?.image && (
                  <img
                    src={postDetails?.image}
                    alt="postImage"
                    className="mx-auto w-[35rem] h-[25rem] object-fit rounded"
                  />
                )}
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
                    {postDetails?.upvotes?.includes(JSON.parse(user)?._id) ? (
                      <ThumbsUp fill="#C13584" />
                    ) : (
                      <ThumbsUp />
                    )}
                    <p>{postDetails?.upvotes?.length} Upvotes</p>
                  </div>
                  <div
                    className="cursor-pointer flex gap-2 items-center justify-center"
                    onClick={() => unLikePost(postDetails?._id)}
                  >
                    {postDetails?.downvotes?.includes(JSON.parse(user)?._id) ? (
                      <ThumbsDown fill="#C13584" />
                    ) : (
                      <ThumbsDown />
                    )}

                    <p>{postDetails?.downvotes?.length} Downvotes</p>
                  </div>
                  <div
                    className="cursor-pointer flex gap-2 items-center justify-center"
                    onClick={() => setCommentBox(!commentBox)}
                  >
                    <MessageSquareQuote />
                    <p>{postDetails?.comments?.length} Comments</p>
                  </div>
                  <div className="cursor-pointer flex gap-2 items-center justify-center">
                    <Flag /> Report
                  </div>
                </div>
              </div>
              <div>
                {commentBox ? (
                  <div className="pt-2 pb-5 p-16">
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
                      >Comment</Button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <h1 className="text-2xl font-bold pt-2 pb-2 p-16">Comments</h1>
              <div className="pt-2 p-16">
                {postComments?.map((comment) => (
                  <div key={comment?._id}>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          className="w-[3rem] h-[3rem]"
                          style={{
                            borderRadius: "50%",
                            border: "2px solid gray",
                          }}
                          src="https://github.com/shadcn.png"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <h1 className="text-lg font-extrabold text-center">
                        {comment?.user?.username?.toUpperCase()}
                      </h1>
                      <h1 className="text-lg font-bold text-center">
                        Posted {calculateTime(comment?.createdAt)}
                      </h1>
                    </div>
                    <h1 className="text-xl font-bold font-mono pt-1 pb-3 p-14">
                      {comment?.content}
                    </h1>
                    <div className="flex pt-0 pb-5 p-14 gap-3">
                      <div
                        className="cursor-pointer flex gap-2 items-center justify-center"
                        onClick={() => likeComment(comment?._id)}
                      >
                        {comment?.upvotes?.includes(JSON.parse(user)?._id) ? (
                          <ThumbsUp fill="#C13584" />
                        ) : (
                          <ThumbsUp />
                        )}
                        <p>{comment?.upvotes?.length} Upvotes</p>
                      </div>
                      <div
                        className="cursor-pointer flex gap-2 items-center justify-center"
                        onClick={() => unLikeComment(comment?._id)}
                      >
                        {comment?.downvotes?.includes(JSON.parse(user)?._id) ? (
                          <ThumbsDown fill="#C13584" />
                        ) : (
                          <ThumbsDown />
                        )}

                        <p>{comment?.downvotes?.length} Downvotes</p>
                      </div>
                      <div
                        className="cursor-pointer flex gap-2 items-center justify-center"
                        onClick={() => commentReplyBoxHandler(comment?._id)}
                      >
                        <MessageSquareQuote />
                        <p>{comment?.replies?.length} Replies</p>
                      </div>
                      <div className="cursor-pointer flex gap-2 items-center justify-center">
                        <Flag /> Report
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
                            className="mt-2 text-lg border-2 border-white"
                            variant="outline"
                            onClick={() =>  createReply(comment?._id)}
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
                                  <Avatar>
                                    <AvatarImage
                                      className="w-[2rem] h-[2rem]"
                                      style={{
                                        borderRadius: "50%",
                                        border: "2px solid gray",
                                      }}
                                      src="https://github.com/shadcn.png"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <div className="flex gap-2 items-center mt-[-0.5rem]">
                                    <h1 className="text-lg font-extrabold text-center">
                                      {reply?.user?.username?.toUpperCase() ||
                                        "SIX"}
                                    </h1>
                                    <h1 className="text-lg font-bold text-center">
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
                                  {reply?.upvotes?.includes(
                                    JSON.parse(user)?._id
                                  ) ? (
                                    <ThumbsUp fill="#C13584" />
                                  ) : (
                                    <ThumbsUp />
                                  )}
                                  <p>{reply?.upvotes?.length} Upvotes</p>
                                </div>
                                <div
                                  className="cursor-pointer flex gap-2 items-center justify-center"
                                  onClick={() => unLikeReply(reply?._id)}
                                >
                                  {reply?.downvotes?.includes(
                                    JSON.parse(user)?._id
                                  ) ? (
                                    <ThumbsDown fill="#C13584" />
                                  ) : (
                                    <ThumbsDown />
                                  )}

                                  <p>{reply?.downvotes?.length} Downvotes</p>
                                </div>
                                <div className="cursor-pointer flex gap-2 items-center justify-center">
                                  <Flag /> Report
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
