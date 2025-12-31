import httpService from "./httpService";

const API_ENDPOINT = "/roles";

export const getAllRolesApi = (token) => {
  return httpService.get(API_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRoleById = (id, token) => {
  return httpService.get(`${API_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createRole = (roleData, token) => {
  return httpService.post(API_ENDPOINT, roleData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateRole = (id, roleData, token) => {
  return httpService.put(`${API_ENDPOINT}/${id}`, roleData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteRole = (id, token) => {
  return httpService.delete(`${API_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
