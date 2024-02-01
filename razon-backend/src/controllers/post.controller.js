import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import { Post } from "../model/post.model.js";
import { Comment, Reply } from "../model/reply.model.js";
import { User } from "../model/user.model.js";
import uploadImageOnCloudinary from "../utils/cloudinary.js";

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

  const imageLocalPath = req.files?.avatar[0]?.path;
  const postImage = await uploadImageOnCloudinary(imageLocalPath);
  console.log(postImage);
  const createPost = await Post.create({
    title,
    content,
    user: req.user._id,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlQMBEQACEQEDEQH/xAAbAAEBAAIDAQAAAAAAAAAAAAAAAQIFAwQGB//EADsQAAEDAwIEAgYGCgMAAAAAAAABAgMEBREGEiExQVFhgQcTFCJxoTJCkbGywSMzNlJygpKz0eEWJGP/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBAUG/8QALREBAAICAQIDBgYDAAAAAAAAAAECAxESBDETIUEiIzNRcYFSYaGx4fAyQlP/2gAMAwEAAhEDEQA/APHYPrPyzFUwFQAAAAAMkAoRAAE6hVAuQgUQgAZciicwBEAIqdgqBUAAUCoBkVEXmAIInMAAAoAB1KCgPsIBUAADGQqYBtMEUAAZZKGQgAIBQAmQKqkEyFUIqeKFAIAAAEAAApgG0wQ2YKGFAZUCooNCKAVAIQXBQAAUIAAAACAUCAAAFAAOAEwFRVVCKNcNkwpUAHkoFCAAAAAgAKBACgAAAABFTIVireqGdLEojijJAAFKyoEAAAAHeulB7DHb3cf+1RtqML0y5yfYu3PmYrbcy7ZcfCK/nG3RNuKgAAAAAAAAMHN6oSYaiUR2CbGSLnoUZFZQCgQAFessGmoI6Ft91I50FsRUWGFP1lW7miNTsvz+HE4ZMkzPGnd7cPT1iviZe37upq51TU3B9Xc9lLO9rUhoGpl0MX1Ud0bw6c/BC4tRGoY6nlNuV/Kfk88dnlUIAAAAABOoUAc0AwchlYlEUK5DTAAAAd+wx00t8t8dbj2Z1TGkueW1XJnPh3M33xnTrhiJyRvs+gw1iV3pZWnurkSKj3R0US/Ra5ERWqid14r9nZDy61h3Hq+nFuXV6t6dngNQ09VS3uvhr93tKTuV6r9bK5z55yenHMTWNPnZ4mMkxbu1xtwVOYUABAAAAYCoEAovEDFWdlJpdsisgAAB6eh0fUVtpir6WZtYsiZWmo9r5I/48uTHkinGc0RbT206SbVi0Tv6OWe2aiqqmifV2mu9ppnMalU2Jdysavu5ROap359FzwM8qRExEt+HmtMTavnHr+Tk1db79ebpU3aqtbqSDbhvr5GMXa1OHNUyvggxWpWsV2nUY8uW83mumsp7LBXadrLpSSSxy0Ks9fDKiK1yOXCK1yY+xU8zc3mLxWfVzjDW+Kbx6O16NP21t3xk/A4nUfDk6H48OW82ee862vMFPLTxbJnPfJUSoxrUyifmSl4rjiZby4Zy57RC1uhK2G2zV1FXUNwjgTMqUsu5Wp1X/QrniZ1MaL9FaK8qztrKvTlXTaepb56yGSkqHI1NjlVzF4/S4d0VDcZYm3H1cbdPaMcZPSUi05VyacdffWQtpWypEjXOVHK7cjeHTr36DxI58Fjp7Ti8T0bmn9H1XK9IHXe1Mq15U6VG52e3BDnPUR8naOhtP+0baddN1sddU0FTJBBV070ascj8bstVyYdywqJ80NzljW4co6a3Kaz3hqaqJYKiWFXNesb1buYuUXC808DpE7jbhavG2nGVlQARAAAC+YV6PSiUNR66hq7DPcJp03Rz0z/0sTUxyReHn44OOXfeJ09nT8fOtqzO3ccunmKrHVmqI1Th6pdmU8DHt/KHT3XrNmqvK2NmyKiornHPuR0k1W9u5W/wY+eUN1i8+c6ccvhRGoifu4ay8ufbUtdDD7LQI/e9m7c+Z/7z3dfBEwiGox+fKe7nfNuvCsahsvRp+2tu+Mn4HGeo+HLp0Px4bSo02y+6v1DPV1K01BQyukqJEbudjjwankpzjJwpXXeXe2Dxc15mdRDd6FdYVgvjLEyuRUpP0rqpW4cmHYwieZjLz8uTv0vg6t4e+zWaKVL5oW92F/GSBvr4U+PvJj+ZvzNZfYyRZy6bWXBbHPoupKWam0tpjS9Omaqqd617VXk5y54+b1/pGOd3tknsZqzGKmGO8uJlo0zp7UNHbqqe41dzjqIcuia1kTHqqK3xxxTuXlkvXcdiMWDFkiszM2dD0sIn/MZuCfqI/uNdN/g5dfPvnkD0PCBBQJgKoRFAAbnStzoLTdW1Vztza6FG4Ri49x3RyIvBfPuc8lbWjynT0dPkpjtu8behayhra510s+oLvSzKq4WWikk2Z+ruj4Y8Dl7URq1Xq9i1udLzE/RskueoUbtbrGFU7rQO3f2znqn4f1/l299/0/T+GurLNLd6hKm7Xa5172t+lHbXsRE7I6Ta1DcX4x7Ma+7lbD4k7vaZ+2v308/qGmttOsTaFzGOa1GLEkqTOdxXL5Hp7qO5Jtbnkdcc2nu82euOuuP9+rZ+i+nV+q46lzmsho4pJZXuXCNTarfzM9RPsab6GvveXyWm1nJbdR3isp6eOpo6+V2+GXgj25XauenBey8yeDyrENR1c0y2mI3Es6fXnsTJ4bbY6CjpZonMdFFnKqv1ldjjjjhPETg35zKx1vHfGsRDTaV1BPpu4rWU8TZt0SxujeuEcnBfyOmTHF408+DPOG24ZXjUtbc9QNvK7YZo1YsTG8Wx7eSePHK+YriiK8VydRa+TxG5rdfJUzpWssFuZc0RE9sd76pjkqIqc8dcqc46f035O9uuiZ5cY382h1Pe5NQ3V9wmgZC9zGs2Mcqpw+J0x04Rp5s+ac1+Uw1KKdHEQAoBAKEAAADKOR8T98b3Md+81cKTUSsWmPOJdtLxdG8EuVaidvaH/wCScK/Jvxcn4pdeoqJ6lc1E8sq/+j1d95eMR2Sb2nvLhKyza9zN21zk3N2rhcZTt8BoiZjsxAgRQCgQAAQKoRAKAAAAAAAAAAAAAAAAgAAFE5AAKEZlZYqgWJQigAAAAARAKAAgFAAQABQAVFBDkKwAYEaAAACAACAUAAAAAIAAAUAFZlYRVC6YkUAAAIBQIAAoAAAAgAAAAoE3KNroygFCAFwoNoAAAAAAAAAAAIAAoECsSKoRW8ykuTBWDoBi4jUMQAFAAAAAAAUCAAAAD//Z",
    tags: tags || [],
  });

  if (!createPost) {
    throw new Error("Something went wrong while creating a post");
  }

  const post = await Post.findById(createPost._id).populate('user', 'username'); 
  console.log({ ...post.toObject(), username: req.user.username });
  res.status(200).json(new ApiResponse(200, { ...post.toObject(), username: req.user.username }, "Post created successfully"));
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
  const posts = await Post.find().populate('user', 'username');  ;

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
