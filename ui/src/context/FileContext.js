"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getAllFilesApi, deleteFileApi } from "@/apiServices/fileService";

export const FileContext = createContext();

export const useFileContext = () => useContext(FileContext);

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await getAllFilesApi(token);
      setFiles(res.files || []);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  }, []);

  const deleteFile = useCallback(async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await deleteFileApi(fileId, token);
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
      return { success: true };
    } catch (err) {
      console.error("Failed to delete file:", err);
      throw err; // Re-throw so components can handle the error
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <FileContext.Provider
      value={{
        files,
        fetchFiles,
        setFiles,
        deleteFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
