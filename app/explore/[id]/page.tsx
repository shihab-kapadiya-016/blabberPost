'use client'
import React, { use, useEffect, useState } from 'react';
import PostView from './PostView';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { IBlog } from '@/models/blog';
import { IUser } from '@/models/user';
import { IComment } from '@/models/comment';
import PostViewSkeleton from '@/Components/skeletons/PostViewSkeleton';


function App() {
    const {id} = useParams()

    const [post , setPost] = useState<IBlog | null>(null)
    const [author , setAuthor ] = useState<IUser | null>(null)
    const [comments, setComments] = useState<IComment[] | null>(null)
    const [replies , setReplies] = useState<IComment[]>([])
    const [isPostLoading , setIsPostLoading] = useState(true)

    const fetchPost = async () => {
        const response = await axios.get(`/api/blog/${id}`)
        const postData = response.data
        setPost(postData)
    }
    
    const fetchAuthor = async () => {
      const response = await axios.get(`/api/blog/${id}/user`)
      const authorData = response.data.user
      setAuthor(authorData)
    }

    const fetchComments = async () => {
      const response = await axios.get(`/api/comment/post/${id}`)
      const allCommentsData: IComment[] = response.data

      const commentsData = allCommentsData.filter((c:IComment) => c.parentId === null)
      const replies = allCommentsData.filter((c) => c.parentId !== null)

      setComments(commentsData)
      setReplies(replies)
    }

    useEffect(() => {
        fetchPost()
        fetchAuthor()
        fetchComments()
        setIsPostLoading(false)
    }, [])

  return isPostLoading ? <PostViewSkeleton /> :   (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 md:px-10 lg:px-20">
        { post && author && comments &&  <PostView post={post} setPost={setPost} author={author} comments={comments} setComments={setComments} replies={replies} setReplies={setReplies}  />}
    </div>
  );
}

export default App;