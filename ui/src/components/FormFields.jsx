import { Formik, Form, Field, ErrorMessage } from "formik";

export const TextInput = ({ label, name }) => (
  <div>
    <label className="block font-semibold text-gray-700">{label}</label>
    <Field
      type="text"
      name={name}
      className="w-full border p-2 rounded-lg shadow-sm"
    />
    <ErrorMessage
      name={name}
      component="p"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

export const SelectInput = ({ label, name, options }) => (
  <div>
    <label className="block font-semibold text-gray-700">{label}</label>
    <Field
      as="select"
      name={name}
      className="w-full border p-2 rounded-lg shadow-sm"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
    <ErrorMessage
      name={name}
      component="p"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);
import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import { GiCrossMark } from "react-icons/gi";

const base_url = `${import.meta.env.VITE_BASE_URL}/images/contents`;

export const FileInput = ({ label, name, setFieldValue, existingFile }) => {
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  const openFileModal = (url, type) => {
    setFileUrl(url);
    setFileType(type);
    setIsFileModalOpen(true);
  };

  const closeFileModal = () => {
    setIsFileModalOpen(false);
    setFileUrl(null);
    setFileType(null);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type="file"
        accept={name === "file" ? "application/pdf" : "video/*"}
        onChange={(e) => setFieldValue(name, e.currentTarget.files[0])}
        className="w-full border p-2 rounded-lg"
      />

      {existingFile && (
        <div className="mt-2">
          <span className="text-gray-600">Current:&nbsp;</span>
          <Tooltip title="View existing file" arrow>
            <span
              onClick={() =>
                openFileModal(existingFile, name === "file" ? "pdf" : "video")
              }
              className="text-blue-500 underline cursor-pointer hover:text-blue-700"
            >
              View File
            </span>
          </Tooltip>
        </div>
      )}

      {isFileModalOpen && (
        <div
          onClick={closeFileModal}
          className="fixed inset-0 flex justify-center items-center z-50"
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div
            className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-11/12 max-h-[90vh] overflow-auto z-60"
            onClick={(e) => e.stopPropagation()}
          >
            <GiCrossMark
              onClick={closeFileModal}
              className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-600"
            />
            <div className="w-full p-5 h-[80vh]">
              {fileType === "pdf" ? (
                <embed
                  src={`${base_url}/${fileUrl}#toolbar=0`}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  className="rounded-lg border border-border"
                  onContextMenu={(e) => e.preventDefault()}
                />
              ) : (
                <video
                  src={`${base_url}/${fileUrl}`}
                  controls
                  className="w-full h-full rounded-lg border border-border"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInput;
