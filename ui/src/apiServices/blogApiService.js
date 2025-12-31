import httpService from "./httpService";

export const createBlogApi = async (data, token) => {
  try {
    const response = await httpService.post("/blogs", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

export const getAllBlogsApi = async () => {
  try {
    const response = await httpService.get("/blogs");
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const getBlogByIdApi = async (id) => {
  try {
    const response = await httpService.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

export const updateBlogApi = async (id, data, token) => {
  try {
    const response = await httpService.put(`/blogs/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

export const deleteBlogApi = async (id, token) => {
  try {
    const response = await httpService.delete(`/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};
