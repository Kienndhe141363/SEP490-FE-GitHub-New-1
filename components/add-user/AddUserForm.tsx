"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/config/constant";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import SpinnerLoader from "../loading/SpinnerLoader";

interface ErrorResponse {
  message?: string;
}

const AddUserForm: React.FC = () => {
  const options = [
    { Label: "System Admin", Value: "ROLE_ADMIN" },
    { Label: "Manager", Value: "ROLE_MANAGER" },
    { Label: "Class Admin", Value: "ROLE_CLASS_ADMIN" },
    { Label: "Trainer", Value: "ROLE_TRAINER" },
    { Label: "Trainee", Value: "ROLE_TRAINEE" },
    { Label: "Content Developer", Value: "ROLE_CONTENT_DEVELOPER" },
  ];

  const allowedRoles = options.map((option) => option.Value);
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    account: Yup.string().required("Account is required"),
    roles: Yup.string()
      .oneOf(allowedRoles, "Role is required")
      .required("Role is required"),
  });

  const initialValues = {
    fullName: "",
    email: "",
    account: "",
    roles: "",
  };

  const router = useRouter();

  const handleSubmit = async (
    values: typeof initialValues,
    {
      setFieldError,
      setSubmitting,
    }: {
      setFieldError: (field: string, message: string) => void;
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_API_URL}/user/management/add`,
        {
          ...values,
          roles: [values.roles],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Successfully added");
      if (response.status === 200) {
        router.push("/feature/view-user-list");
      }
    } catch (error) {
      // Reset submitting state
      setSubmitting(false);

      // Type guard to check if it's an AxiosError
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;

        // Check if we have a response with an error message
        if (axiosError.response && axiosError.response.data) {
          const errorMessage = axiosError.response.data.message || "";

          // Specific error handling
          if (errorMessage.toLowerCase().includes("email")) {
            setFieldError("email", "Email already exists");
          } else if (errorMessage.toLowerCase().includes("account")) {
            setFieldError("account", "Account already exists");
          } else {
            // Generic error handling
            toast.error("Failed to submit form data. Please try again.");
          }
        } else {
          // If no specific error message
          toast.error("Failed to submit form data. Please try again.");
        }
      } else {
        // Non-axios error
        toast.error("An unexpected error occurred. Please try again.");
      }

      console.error("Error submitting form data:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-10 ">
        <h2 className="text-6xl font-bold mb-16 p-2">New User</h2>
        <div className="bg-white rounded-[40px] p-8 ">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="grid grid-cols-2 gap-6" autoComplete="off">
              
              <div className="mb-6">
                <label className="block font-bold mb-1">Full Name</label>
                <Field
                  autoComplete="off"
                  name="fullName"
                  placeholder="Input your name"
                  className="w-full p-2 border border-gray-700 rounded"
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block font-bold mb-1 text-xl">Email</label>
                  <Field
                    autoComplete="off"
                    name="email"
                    type="email"
                    placeholder="Template@gmail.com"
                    className="w-full p-2 border border-gray-700 rounded"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block font-bold mb-1 text-xl">
                    Account
                  </label>
                  <Field
                    autoComplete="new-password"
                    name="account"
                    placeholder="Input Account"
                    className="w-full p-2 border border-gray-700 rounded"
                  />
                  <ErrorMessage
                    name="account"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block font-bold mb-1 text-xl">Role</label>
                  <Field
                    autoComplete="off"
                    as="select"
                    name="roles"
                    className="w-full p-2.5 border border-gray-700 rounded"
                  >
                    <option value="" label="Select a role" />
                    {options.map((option) => (
                      <option key={option.Value} value={option.Value}>
                        {option.Label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="roles"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="flex mt-2 flex-col">
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-white bg-[#6FBC44] font-bold shadow-md hover:shadow-lg hover:bg-[#5da639] py-3 px-9 rounded mr-10 "
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="text-black bg-[#D5DCD0] font-bold shadow-md hover:shadow-lg hover:bg-gray-400 py-3 px-6 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
