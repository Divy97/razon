import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import { Post } from "../model/post.model.js";
import { Comment, Reply } from "../model/reply.model.js";
import { User } from "../model/user.model.js";

const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  if (!req.user) {
    throw new Error("User not authorized");
  }
  if (!title) {
    throw new Error("Title is Required");
  }

  if (!content) {
    throw new Error("Content is Required");
  }

  const createPost = await Post.create({
    title,
    content,
    user: req.user._id,
    tags: tags || [],
  });

  if (!createPost) {
    throw new Error("Something went wrong while creating a post");
  }

  const post = await Post.findById(createPost._id);

  res.status(200).json(new ApiResponse(200, post, "Post created successfully"));
});

const upvote = asyncHandler(async (req, res) => {
  const { post_id } = req.query;
  const userId = req.user?._id;

  if (!post_id) {
    throw new ApiError(400, "PostID is required");
  }

  const post = await Post.findById(post_id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const alreadyUpvoted = post.upvotes.includes(userId);
  const alreadyDownvoted = post.downvotes.includes(userId);

  if (alreadyUpvoted) {
    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      { $pull: { upvotes: userId } },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, updatedPost, "Upvote removed successfully"));
  } else {
    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      {
        $push: { upvotes: userId },
        $pull: { downvotes: userId },
      },
      { new: true }
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedPost, "Upvote registered successfully")
      );
  }
});

const downvote = asyncHandler(async (req, res) => {
  const { post_id } = req.query;
  const userId = req.user?._id;

  if (!post_id) {
    throw new ApiError(400, "PostID is required");
  }

  const post = await Post.findById(post_id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const alreadyUpvoted = post.upvotes.includes(userId);
  const alreadyDownvoted = post.downvotes.includes(userId);

  if (alreadyDownvoted) {
    // User has already downvoted, remove downvote
    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      { $pull: { downvotes: userId } },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, updatedPost, "Downvote removed successfully"));
  } else {
    // User has not downvoted, add downvote
    // Remove upvote if user had already upvoted
    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      {
        $push: { downvotes: userId },
        $pull: { upvotes: userId },
      },
      { new: true }
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedPost, "Downvote registered successfully")
      );
  }
});

const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { post_id } = req.query;

  if (!content || !post_id) {
    throw new ApiError(400, "Content and post ID are required");
  }

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    const comment = new Comment({
      content,
      user: req.user?._id,
      post: post._id,
    });
    await comment.save();
    await Post.findByIdAndUpdate(post._id, {
      $push: { comments: comment._id },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error creating comment");
  }
});

const upvoteComment = asyncHandler(async (req, res) => {
  const { comment_id } = req.query;

  if (!comment_id) {
    throw new ApiError(400, "Something went wrong, while upVoting comment");
  }

  const commentExists = await Comment.findById(comment_id);
  if (!commentExists) {
    throw new ApiError("CommentID is not valid");
  }
  const givenComment = await Comment.findByIdAndUpdate(
    comment_id,
    {
      $inc: { upvotes: 1 },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, givenComment, "Upvote registered successfully"));
});

const downvoteComment = asyncHandler(async (req, res) => {
  const { comment_id } = req.query;

  if (!comment_id) {
    throw new ApiError(400, "Something went wrong, while upVoting comment");
  }

  const commentExists = await Comment.findById(comment_id);
  if (!commentExists) {
    throw new ApiError("CommentID is not valid");
  }
  const givenComment = await Comment.findByIdAndUpdate(
    comment_id,
    {
      $inc: { downvotes: 1 },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, givenComment, "Upvote registered successfully"));
});

const createReply = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { comment_id } = req.query;
  const { content } = req.body;

  if (!userId) {
    throw new ApiError(400, "User not authorized");
  }

  if (!comment_id || !content) {
    throw new ApiError(400, "Content and post ID are required");
  }

  const comment = await Comment.findById(comment_id);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const newReply = new Reply({
    content,
    user: req.user?._id,
    comment: comment_id,
  });

  await newReply.save();
  await Comment.findByIdAndUpdate(comment_id, {
    $push: { replies: newReply._id },
  });
  res.status(201).json(newReply);
});

const createNestedReply = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { reply_id } = req.query;
  const { content } = req.body;

  if (!userId) {
    throw new ApiError(400, "User not authorized");
  }

  if (!reply_id || !content) {
    throw new ApiError(400, "Content and reply ID are required");
  }

  const reply = await Reply.findById(reply_id);
  if (!reply) {
    throw new ApiError(404, "Reply not found");
  }

  const newNestedReply = new Reply({
    content,
    user: req.user?._id,
    comment: reply_id,
  });

  await newNestedReply.save();
  await Reply.findByIdAndUpdate(reply_id, {
    $push: { replies: newNestedReply._id },
  });
  res.status(201).json(newNestedReply);
});

const upvoteReply = asyncHandler(async (req, res) => {
  const { reply_id } = req.query;
  const userId = req.user?._id;

  if (!reply_id) {
    throw new ApiError(400, "ReplyID is required");
  }

  const reply = await Reply.findById(reply_id);
  if (!reply) {
    throw new ApiError(404, "Reply not found");
  }

  const alreadyUpvoted = reply.upvotes.includes(userId);
  const alreadyDownvoted = reply.downvotes.includes(userId);

  if (alreadyUpvoted) {
    const updatedReply = await Reply.findByIdAndUpdate(
      reply_id,
      { $pull: { upvotes: userId } },
      { new: true }
    );

    res.status(200).json(new ApiResponse(200, updatedReply, "Upvote removed successfully"));
  } else {
    const updatedReply = await Reply.findByIdAndUpdate(
      reply_id,
      {
        $push: { upvotes: userId },
        $pull: { downvotes: userId },
      },
      { new: true }
    );

    res.status(200).json(new ApiResponse(200, updatedReply, "Upvote registered successfully"));
  }
});

const downvoteReply = asyncHandler(async (req, res) => {
  const { reply_id } = req.query;
  const userId = req.user?._id;

  if (!reply_id) {
    throw new ApiError(400, "ReplyID is required");
  }

  const reply = await Reply.findById(reply_id);
  if (!reply) {
    throw new ApiError(404, "Reply not found");
  }

  const alreadyUpvoted = reply.upvotes.includes(userId);
  const alreadyDownvoted = reply.downvotes.includes(userId);

  if (alreadyDownvoted) {
    const updatedReply = await Reply.findByIdAndUpdate(
      reply_id,
      { $pull: { downvotes: userId } },
      { new: true }
    );

    res.status(200).json(new ApiResponse(200, updatedReply, "Downvote removed successfully"));
  } else {
    const updatedReply = await Reply.findByIdAndUpdate(
      reply_id,
      {
        $push: { downvotes: userId },
        $pull: { upvotes: userId },
      },
      { new: true }
    );

    res.status(200).json(new ApiResponse(200, updatedReply, "Downvote registered successfully"));
  }
});

const getPostByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User not found with the specified username");
  }

  const userPosts = await Post.find({ user: user._id });

  if (!userPosts) {
    throw new ApiError(404, "No posts found for the specified username");
  }

  res.status(200).json(userPosts);
});

const getPostDetails = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  console.log(postId);
  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.status(200).json(post);
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();

  if (!posts) {
    throw new ApiError(404, "No posts found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  console.log(postId);
  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  console.log(post);
  const comments = await Comment.find({ _id: { $in: post.comments } });
  console.log(comments);
  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const getCommentReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  const replies = await Reply.find({ _id: { $in: comment.replies } });
  console.log(replies);
  res
    .status(200)
    .json(new ApiResponse(200, replies, "Replies fetched successfully"));
});

const getReplyNestedReplies = asyncHandler(async (req, res) => {
  const { replyId } = req.params;
  if (!replyId) {
    throw new ApiError(400, "Reply ID is required");
  }

  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new ApiError(404, "Reply not found");
  }

  const nestedReplies = await Reply.find({ _id: { $in: reply.replies } });
  console.log(nestedReplies);
  res
    .status(200)
    .json(new ApiResponse(200, nestedReplies, "Replies fetched successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  const postToDelete = await Post.findById(postId);

  if (!postToDelete) {
    throw new ApiError(404, "Post not found");
  }

  // Check if the authenticated user is the creator of the post
  if (postToDelete.user.toString() !== req.user?._id.toString()) {
    throw new ApiError(
      403,
      "Unauthorized. You can only delete your own posts."
    );
  }

  const deletedPost = await Post.findByIdAndDelete(postId);

  if (!deletedPost) {
    throw new ApiError(404, "Post not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});

export {
  createPost,
  upvote,
  downvote,
  createComment,
  upvoteComment,
  downvoteComment,
  createReply,
  createNestedReply,
  upvoteReply,
  downvoteReply,
  getPostByUsername,
  getPostDetails,
  getAllPosts,
  deletePost,
  getPostComments,
  getCommentReplies,
  getReplyNestedReplies,
};
