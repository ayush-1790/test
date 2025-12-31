"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBlogByIdApi, updateBlogApi } from "@/apiServices/blogApiService";
import { useUserContext } from "@/context/UserContext";

export default function EditBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const { token, user } = useUserContext();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogByIdApi(id);
        const blog = data.data;
        setTitle(blog.title);
        setContent(blog.content);
        setIsPublished(blog.isPublished);

        // Basic permission check on client side, also enforced on server
        if (
          user &&
          blog.author?._id &&
          user._id !== blog.author._id &&
          user.id !== blog.author._id
        ) {
          // alert("You are not authorized to edit this blog.");
          // router.push("/blogs");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to fetch blog details.");
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      // Wait for user to be loaded
      fetchBlog();
    }
  }, [id, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateBlogApi(id, { title, content, isPublished }, token);
      router.push(`/blogs/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update blog. Ensure you are the author.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-2xl text-text mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 font-bold mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
            required
          ></textarea>
        </div>
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="text-gray-700">
            Publish immediately
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}
