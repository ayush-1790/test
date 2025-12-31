import httpService from "./httpService";

const API_ENDPOINT = "/permissions";

export const getAllPermissions = (token) => {
  return httpService.get(API_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPermissionById = (id, token) => {
  return httpService.get(`${API_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createPermission = (permissionData, token) => {
  return httpService.post(API_ENDPOINT, permissionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePermission = (id, permissionData, token) => {
  return httpService.put(`${API_ENDPOINT}/${id}`, permissionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePermission = (id, token) => {
  return httpService.delete(`${API_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
