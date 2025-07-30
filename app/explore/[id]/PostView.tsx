import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Trash2, Cone } from 'lucide-react';
import { IBlog } from '@/models/blog';
import { IUser } from '@/models/user';
import { IComment } from '@/models/comment';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import CommentInput from './CommentInput';
import axios from 'axios';
import ReplyInput from './ReplyInput';
import { Types } from 'mongoose';
import ReplyList from './ReplyList';
import { toast } from 'sonner';
import PostViewSkeleton from '@/Components/skeletons/PostViewSkeleton';


interface PostViewProps {
  post: IBlog;
  setPost: Function
  author: IUser
  comments: IComment[]
  setComments: Function
  replies: IComment[]
  setReplies: Function
}

const PostView: React.FC<PostViewProps> = ({ post, setPost, author, comments, setComments, replies, setReplies }) => {

  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const [likes, setLikes] = useState<string[]>(post.likes.map((userId) => userId.toString()))
  const isLiked = likes.includes(currentUser?.id!)
  const [showAllComments, setShowAllComments] = useState(false);
  const [postComment, setPostComment] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [commentAuthors, setCommentAuthors] = useState<IUser[] | []>([])
  const [replyCommentId, setReplyCommentId] = useState("")


  const handleDeleteReply = async (id: string) => {
    try {
      const response = await axios.delete(`/api/comment/${id}`)

      if (response.status === 200) {
        setReplies((prev: IComment[]) => prev.filter((r) => r._id.toString() !== id))
      }
    } catch (error) {
      console.error(error)
    }
  }


  const handleLike = async () => {

    if (!currentUser) {
      if (!currentUser) {
        toast.error("Login required", {
          description: "You must be logged in.",
          icon: "🔒",
          duration: 4000,
          className: "dark:bg-red-400 dark:text-white text-white bg-red-600",
        });
        return
      }

    }

    try {
      if (!isLiked) {
        setLikes((prev) => [...prev, currentUser?.id!])  
        const response = await axios.post(`/api/blog/${post._id}/likes`)
      } else {
        setLikes((prev) => prev.filter((userId) => userId !== currentUser?.id))
      }
    } catch (error) {
      console.error("Error while toggling likes: " + error)
    }


  };

  const commentOnSubmit = async (comment: string) => {
    setIsLoading(false)

    if (!currentUser) {
      toast.error("Login required", {
        description: "You must be logged in to comment.",
        icon: "🔒",
        duration: 4000,
        className: "dark:bg-red-400 dark:text-white text-white bg-red-600",
      });
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post(`/api/comment/post/${post._id}`, { content: comment })
      const commentData = response.data.comment

      const updatedComments = [commentData, ...comments];
      setComments(updatedComments);

      fetchCommentAuthors(updatedComments)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCommentAuthors = async (commentsToFetch: IComment[]) => {
    try {
      const responses = await Promise.all(
        commentsToFetch?.map((comment) =>
          axios.get(`/api/comment/${comment._id}/user`)
        )
      );

      const authorsData = responses.map((res) => res.data);
      setCommentAuthors(authorsData);
    } catch (error) {
      console.error("Error fetching comment authors:", error);
    }
  };


  useEffect(() => {
    fetchCommentAuthors(comments)
    
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const displayedComments = showAllComments ? comments : comments.slice(0, 3);


  async function handleDeleteComment(id: string) {
    try {
      const replies = await fetchRepliesOfAComment(id)

      const res = await axios.delete(`/api/comment/${id}`)

      if (res.status === 200) {
        setComments((prev: IComment[]) => prev.filter((c) => c._id !== id));
      }

      if (replies) {
        replies.forEach(async (reply: IComment) => {
          await handleDeleteReply(reply._id)
        });
      }



    } catch (error) {
      console.error(error);
    }
  }

  const fetchRepliesOfAComment = async (commentId: string) => {
    try {
      const replies = await axios.get(`/api/comment/${commentId}`)
      return (replies.data)
    } catch (error) {
      console.error("error while fetching replies of a comment" + error)
    }
  }

  const handleReplySubmit = async (id: string, content: string) => {


    if (!currentUser) {
      if (!currentUser) {
        toast.error("Login required", {
          description: "You must be logged in.",
          icon: "🔒",
          duration: 4000,
          className: "dark:bg-red-400 dark:text-white text-white bg-red-600",
        });
        return
      }
    }
    try {
      const response = await axios.post(`/api/comment/${id}`, { content })
      const replyData = response.data.reply

      setReplies((prevReplies: IComment[]) => [replyData, ...prevReplies])

      // Fetch only the new author's data
      const authorRes = await axios.get(`/api/comment/${replyData._id}/user`)
      setCommentAuthors((prevAuthors) => [...prevAuthors, authorRes.data])
    } catch (error) {
      console.error("Error submitting reply:", error)
    }
  }


  return (
    <article className="rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card text-card-foreground">
      <div className="relative w-full aspect-[16/5] overflow-hidden rounded-lg">
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="p-8">
        {/* Author + Meta Info */}
        <div className="flex items-center justify-between mb-6">
          {author ? (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={author.avatarUrl}
                  alt={author.username}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
              </div>
              <div>
                <h3 className="font-semibold hover:text-blue-600 cursor-pointer transition-colors">
                  {author.username}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>@{author.username}</span>
                  <span>•</span>
                  <time>
                    {formatDate(new Date(post.createdAt).toLocaleDateString())}
                  </time>
                </div>
              </div>
            </div>
          ) : (
            // Optional: show skeleton or placeholder
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 leading-tight hover:text-foreground transition-colors">
          {post.title}
        </h1>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8 text-foreground">
          <div className="leading-relaxed whitespace-pre-wrap">{post.content}</div>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${isLiked
                ? "text-red-500 bg-red-50 hover:bg-red-100"
                : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
                }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-800 " : ""}`} />
              <span className="font-medium">{likes.length}</span>
            </button>

            <button
              className="flex items-center space-x-2 px-3 py-2 rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
              onClick={() => setPostComment(true)}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{comments.length}</span>
            </button>
          </div>
        </div>

        {/* Comment Input */}
        {postComment && (
          <CommentInput onSubmit={commentOnSubmit} isLoading={isLoading} />
        )}

        {/* Comment Section */}
        {displayedComments.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-6 text-center">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          commentAuthors &&
          displayedComments.map((comment: IComment, idx) => {
            const author = commentAuthors.find((a) => a._id === comment.authorId);

            return (
              <div key={comment._id || idx} className="flex space-x-4 mb-8 mt-6">
                {/* Avatar */}
                <img
                  src={author?.avatarUrl}
                  alt={author?.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />

                {/* Comment Body */}
                <div className="flex-1">
                  <div className="bg-muted rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span>{author?.username}</span>
                        <span className="text-muted-foreground text-xs font-normal">
                          @{author?.email?.split("@")[0]}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(new Date(comment.createdAt).toLocaleDateString())}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-foreground">
                      {comment.content}
                    </p>
                  </div>

                  {/* Reply input (conditionally shown) */}
                  {replyCommentId === comment._id && (
                    <div className="mt-2 ml-2">
                      <ReplyInput
                        onSubmit={(content) => handleReplySubmit(comment._id, content)}
                        replyingTo={author?.username}
                        setReplyCommentId={setReplyCommentId}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-3 ml-3 -mb-3 text-xs text-muted-foreground">
                    <button
                      className="hover:text-blue-600 font-medium transition"
                      onClick={() => setReplyCommentId(comment._id)}
                    >
                      Reply
                    </button>

                    {author?.username === currentUser?.username && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="hover:text-red-600 transition"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {/* Replies */}
                  <ReplyList
                    parentId={comment._id}
                    allReplies={replies}
                    commentAuthors={commentAuthors}
                    currentUser={currentUser}
                    onDelete={handleDeleteReply}
                  />
                </div>
              </div>
            );
          })
        )}


        {/* Show all button */}
        {comments.length > 3 && !showAllComments && (
          <button
            onClick={() => setShowAllComments(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View all {comments.length} comments
          </button>
        )}
      </div>
    </article>

  );
};

export default PostView;