"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getBlogByIdApi, deleteBlogApi } from "@/apiServices/blogApiService";
import { useUserContext } from "@/context/UserContext";
import Can from "@/components/Can";

export default function BlogDetailPage() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useUserContext();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogByIdApi(id);
        setBlog(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlogApi(id, token);
        router.push("/blogs");
      } catch (error) {
        console.error(error);
        alert("Failed to delete blog. Ensure you have permission.");
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!blog) return <div className="text-center mt-10">Blog not found.</div>;

  const isAuthor = user?.id === blog.author?._id;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-bg-surface text-text rounded-lg shadow-md mt-10">
      <div className="mb-6">
        <Link
          href="/blogs"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          &larr; Back to Blogs
        </Link>
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex justify-between items-center text-gray-500 text-sm border-b pb-4 mb-4">
          <span>By {blog.author?.name || "Unknown"}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="prose max-w-none mb-8">
        <p className="whitespace-pre-wrap">{blog.content}</p>
      </div>

      <Can I={() => isAuthor}>
        <div className="flex justify-end space-x-4 border-t pt-4">
          <Can I="blog:update">
            <Link
              href={`/blogs/edit/${id}`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Edit
            </Link>
          </Can>
          <Can I="blog:delete">
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Delete
            </button>
          </Can>
        </div>
      </Can>
    </div>
  );
}
