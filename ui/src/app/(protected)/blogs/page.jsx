"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllBlogsApi, deleteBlogApi } from "@/apiServices/blogApiService";
import { useUserContext } from "@/context/UserContext";
import Can from "@/components/Can";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useUserContext();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogsApi();
      setBlogs(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlogApi(id, token);
        fetchBlogs();
      } catch (error) {
        console.error(error);
        alert("Failed to delete blog. Ensure you have permission.");
      }
    }
  };

  const isAuthor = (blog) => {
    return user?.id === blog.author?._id;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blogs</h1>
        <Can I="blog:create">
          <Link
            href="/blogs/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Create New Blog
          </Link>
        </Can>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white text-text rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className=" mb-4 line-clamp-3">
                    {blog.content}
                  </p>
                  <p className="text-sm mb-4">
                    By {blog.author?.name || "Unknown"}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/blogs/${blog._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Read More
                    </Link>
                    <div className="space-x-2">
                      <Can I={(user) => isAuthor(blog)} a={{ ownerId: blog.author?._id }}>
                          <Can I="blog:update">
                            <Link
                              href={`/blogs/edit/${blog._id}`}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              Edit
                            </Link>
                          </Can>
                          <Can I="blog:delete">
                            <button
                              onClick={() => handleDelete(blog._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </Can>
                      </Can>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No blogs found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
