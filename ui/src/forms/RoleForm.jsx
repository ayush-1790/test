import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getAllPermissions } from "@/apiServices/permissionApiServices";
import { useUserContext } from "@/context/UserContext";

const RoleSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  permissions: Yup.array().of(Yup.string()),
});

const RoleForm = ({ onSubmit, initialData }) => {
  const { token } = useUserContext();
  const [permissions, setPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await getAllPermissions(token);
        setPermissions(response.data);
      } catch (error) {
        console.error("Failed to fetch permissions", error);
      } finally {
        setLoadingPermissions(false);
      }
    };
    if (token) fetchPermissions();
  }, [token]);

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, curr) => {
    const module = curr.module || "Other";
    if (!acc[module]) acc[module] = [];
    acc[module].push(curr);
    return acc;
  }, {});

  const initialValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    permissions:
      initialData?.permissions?.map((p) =>
        typeof p === "object" ? p._id : p
      ) || [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={RoleSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="p-4 bg-white rounded-lg max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {initialData ? "Edit Role" : "Create Role"}
          </h2>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Field
              type="text"
              name="name"
              className="mt-1 block w-full px-3 py-2 bg-white border border-border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Field
              as="textarea"
              name="description"
              rows="3"
              className="mt-1 block w-full px-3 py-2 bg-white border border-border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            {loadingPermissions ? (
              <p>Loading permissions...</p>
            ) : (
              Object.entries(groupedPermissions).map(([module, perms]) => (
                <div key={module} className="mb-4 border p-3 rounded-md">
                  <h3 className="font-semibold text-md mb-2">{module}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {perms.map((perm) => (
                      <label
                        key={perm._id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <Field
                          type="checkbox"
                          name="permissions"
                          value={perm._id}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span className="text-sm">
                          {perm.description || perm.key}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RoleForm;
