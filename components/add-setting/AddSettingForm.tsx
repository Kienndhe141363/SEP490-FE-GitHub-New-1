"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getJwtToken } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_API_URL } from "@/config/constant";
import toast from "react-hot-toast";
import SpinnerLoader from '@/components/loading/SpinnerLoader'; // Import SpinnerLoader

const AddSettingForm: React.FC = () => {
  const [loading, setLoading] = useState(false); // State để theo dõi trạng thái loading

  const options = [
    { Label: "Generation", Value: "GENERATION" },
    { Label: "Location", Value: "LOCATION" },
  ];

  const validationSchema = Yup.object({
    settingName: Yup.string().required("Setting Name is required"),
    settingGroup: Yup.string().required("Setting Group is required"),
    status: Yup.string().required("Status is required"),
    description: Yup.string().required("Description is required"),
  });

  const initialValues = {
    settingName: "",
    settingGroup: "",
    status: true,
    description: "",
  };

  const router = useRouter();

  const handleSubmit = async (values: typeof initialValues) => {
    console.log("Form data:", values);

    const token = getJwtToken();
    if (!token) {
      router.push("/authen/login");
      return;
    }

    setLoading(true); // Bắt đầu loading

    try {
      const response = await axios.post(`${BASE_API_URL}/settings/create`, 
        {
          ...values,
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        router.push("/feature/view-system-setting");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      toast.error("Failed to submit form data. Please try again.");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-24 min-h-screen">
            {loading && <SpinnerLoader/>} {/* Hiển thị spinner khi loading */}
      <div className="flex justify-between items-center py-8">
        <h2 className="text-4xl font-bold">New System Setting</h2>
      </div>
      <div className="bg-white rounded-[40px] p-12 mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="grid grid-cols-2 gap-12">
              <div className="mb-6">
                <label className="block font-bold mb-1">Setting Name<span className="text-red-600 text-xl">*</span></label>
                <Field
                  name="settingName"
                  placeholder="Input Setting Name"
                  className="w-full p-2 border border-gray-700 rounded-lg"
                />
                <ErrorMessage name="settingName" component="div" className="text-red-500 " />
              </div>

              <div className="mb-6 w-7/12">
                <label className="block font-bold mb-1">Setting Group<span className="text-red-600 text-xl">*</span></label>
                <Field
                  as="select"
                  name="settingGroup"
                  className="w-full p-2.5 border border-gray-700 rounded-lg"
                >
                  <option value="" label="Select a group" />
                  {options.map((option) => (
                    <option key={option.Value} value={option.Value}>
                      {option.Label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="settingGroup" component="div" className="text-red-500" />
              </div>

              <div className="mb-6 w-full">
                <label className="block font-bold mb-1">Description<span className="text-red-600 text-xl">*</span></label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Input Description"
                  className="w-full p-2 border border-gray-700 rounded-lg"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 " />
              </div>

              <div className="mb-6">
                <label className="font-bold mb-1 hidden">Status</label>
                <div className="flex items-center p-3">
                  <label className="mr-10 py-3 px-3 hidden">
                    <Field
                      hidden="true"
                      type="radio"
                      name="status"
                      value={true}
                      checked={values.status === true}
                      onChange={() => setFieldValue("status", true)}
                      className="w-4 h-4 mr-3"
                    />
                    Active
                  </label>
                  <label className="hidden">
                    <Field
                      type="radio"
                      name="status"
                      value={false}
                      checked={values.status === false}
                      onChange={() => setFieldValue("status", false)}
                      className="w-4 h-4 mr-3"
                    />
                    Inactive
                  </label>
                </div>
                <ErrorMessage name="status" component="div" className="text-red-500" />
              </div>

              <div className="flex mt-10 col-span-2">
                <button
                  type="submit"
                  className="text-white bg-[#6FBC44] font-bold shadow-md hover:shadow-lg hover:bg-[#5da639] py-3 px-9 rounded mr-10"
                >
                  Add
                </button>
                <button
                  onClick={() => router.back()}
                  type="button"
                  className="text-black bg-[#D5DCD0] font-bold shadow-md hover:shadow-lg hover:bg-gray-400 py-3 px-6 rounded"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddSettingForm;