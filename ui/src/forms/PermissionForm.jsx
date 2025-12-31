import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const PermissionSchema = Yup.object().shape({
  key: Yup.string().required("Key is required"),
  description: Yup.string(),
  module: Yup.string().required("Module is required"),
});

const PermissionForm = ({ onSubmit, initialData }) => {
  const initialValues = {
    key: initialData?.key || "",
    description: initialData?.description || "",
    module: initialData?.module || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PermissionSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="p-4 bg-white rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            {initialData ? "Edit Permission" : "Create Permission"}
          </h2>
          <div className="mb-4">
            <label htmlFor="key" className="block text-sm font-medium text-gray-700">
              Key
            </label>
            <Field
              type="text"
              name="key"
              className="mt-1 block w-full px-3 py-2 bg-white border border-border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage name="key" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Field
              as="textarea"
              name="description"
              rows="3"
              className="mt-1 block w-full px-3 py-2 bg-white border border-border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <div className="mb-4">
            <label htmlFor="module" className="block text-sm font-medium text-gray-700">
              Module
            </label>
            <Field
              type="text"
              name="module"
              className="mt-1 block w-full px-3 py-2 bg-white border border-border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage name="module" component="div" className="text-red-500 text-sm mt-1" />
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

export default PermissionForm;