import httpService from "./httpService";

export const signinApi = async (data) => {
  try {
    const response = await httpService.post("/auth/signin", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signupApi = async (data, token) => {
  try {
    const response = await httpService.post("/auth/signup", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserApi = async (id, data, token) => {
  try {
    const response = await httpService.put(`/auth/update-user/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getAllUsersApi = async (token) => {
  try {
    const response = await httpService.get("/auth/all-users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/signin";
};

export const createMultipleUsersApi = async (users, token) => {
  try {
    const response = await httpService.post(
      "/auth/create-multiple-users",
      { users },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating multiple users:", error);
    throw error;
  }
};

export const adminResetUserPasswordApi = async (id, newPassword, token) => {
  try {
    const response = await httpService.put(
      `/auth/reset-password/${id}`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting user password:", error);
    throw error;
  }
};

export const deleteUserApi = async (userId, token) => {
  try {
    const response = await httpService.delete(`/auth/delete-user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

