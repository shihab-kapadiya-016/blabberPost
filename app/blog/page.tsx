"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { handleDelete } from "../dashboard/page";

interface Blog {
  coverImageUrl:string;
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const MyBlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const res = await axios.get("/api/blog/get-post-of-user");
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
   <div className="min-h-screen bg-background py-10 px-6 sm:px-12">
  <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-600 mb-8">
    My Blogs
  </h1>

  {blogs.length === 0 ? (
    <p className="text-gray-500 text-lg">You haven’t written any blogs yet.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300"
        >
          <Link href={`/blog/${blog._id}`}>
            {/* Cover Image */}
            {blog.coverImageUrl && (
              <img
                src={blog.coverImageUrl}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-5">
              <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                {blog.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(blog.createdAt).toLocaleString()}
              </p>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-200 line-clamp-4">
                {blog.content}
              </p>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex justify-between items-center px-5 pb-4">
            <Link
              href={`/edit/${blog._id}`}
              className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
            >
              <Pencil size={16} /> Edit
            </Link>
            <button
              onClick={() => handleDelete(blog._id, setBlogs)}
              className="text-sm flex items-center gap-1 text-red-500 hover:underline"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default MyBlogsPage;
