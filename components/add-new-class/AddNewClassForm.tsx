"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import { BASE_API_URL } from "@/config/constant";
import { Home, Users, BookOpen, Settings, LogOut } from "lucide-react";
import { FormError } from "../custom/form-error";
import toast from "react-hot-toast";
import SpinnerLoader from "../loading/SpinnerLoader";
import { number } from "zod";

interface User {
  userId: number;
  account: string;
  fullName: string;
}

interface Curriculum {
  curriculumId: number;
  curriculumName: string;
  status: boolean;
}

interface ClassFormData {
  className: string;
  descriptions: string;
  admin: string;
  curriculumId: number;
  planTraineeNo: number;
  supplier: string;
}

interface AddNewClassFormProps {
  setActiveStep: (step: number) => void;
  setData: (data: any) => void;
}

const AddNewClassForm = ({ setActiveStep, setData }: AddNewClassFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [curriculum, setCurriculum] = useState(null);

  // States for form data
  const [formData, setFormData] = useState<ClassFormData>({
    className: "",
    descriptions: "",
    admin: "",
    curriculumId: 0,
    planTraineeNo: 0,
    supplier: "",
  });

  // States for dropdown data
  const [admins, setAdmins] = useState<User[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);

  // State for form validation
  const [errors, setErrors] = useState({
    className: "",
    admin: "",
    curriculumId: "",
    planTraineeNo: "",
  });

  // Fetch admins and curriculums on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      const token = getJwtToken();
      if (!token) {
        router.push("/authen/login");
        return;
      }

      try {
        // Fetch admins
        const adminsResponse = await axios.post(
          `${BASE_API_URL}/user/search`,
          {
            roleId: 3,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(adminsResponse);
        //@ts-ignore
        console.log(adminsResponse?.data?.data?.dataSource);
        const fetchedAdmin = adminsResponse?.data?.data?.dataSource.filter(
          (user: any) => user.role.includes("ROLE_CLASS_ADMIN")
        );
        setAdmins(fetchedAdmin);
        //setAdmins(adminsResponse.data.data.dataSource || []);

        // Fetch curriculums
          const curriculumsResponse = await axios.post(
          `${BASE_API_URL}/curriculums/search`,
          {
            size:100,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(curriculumsResponse);
        const activeCurriculums = (curriculumsResponse.data.data.dataSource || []).filter(
          (curriculum: Curriculum) => curriculum.status === true
        );
        // const curriculums = curriculumsResponse?.data.data.dataSource;
        setCurriculums(activeCurriculums);
      } catch (err) {
        setError("Error fetching data.");
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/authen/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
        className: "",
        admin: "",
        curriculumId: "",
        planTraineeNo: "",
    };

    if (!formData.className) {
        newErrors.className = "Class code is required";
    }
    if (!formData.admin) {
        newErrors.admin = "Class Admin is required";
    }
    if (!formData.curriculumId) {
        newErrors.curriculumId = "Curriculum is required";
    }
    if (
        !formData.planTraineeNo || 
        isNaN(formData.planTraineeNo) || 
        Number(formData.planTraineeNo) <= 0
    ) {
        newErrors.planTraineeNo = "Plan Trainee No must be a number greater than 0";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = getJwtToken();
    if (!token) {
      router.push("/authen/login");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_API_URL}/class-management/add`,
        {
          ...formData,
          status: 1,
          createdDate: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res);

      router.push("/feature/view-class-list"); // Adjust the route as needed
      // setActiveStep(1);
      // setData(res?.data?.data);
      toast.success("Add class successfully!")
    } catch (err) {
      setError("Error creating class.");
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/authen/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SpinnerLoader />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 ml-[228px] bg-[#EFF5EB] p-6 min-h-screen overflow-auto">
        <div className="flex justify-between items-center ">
          <h2 className="text-6xl font-bold ">New Class</h2>
        </div>

        {error && <FormError message={error} />}

        <div className="flex-2 mt-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md w-9/12 mx-auto py-8 px-6"
          >
            <div className="space-y-16">
              {/* Class Code, Admin */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xl font-bold mb-2">
                    Class Name<span className="text-red-500 text-xl">*</span>
                  </label>
                  <input
                    type="text"
                    name="className"
                    placeholder="Eg: Fresher Korean ..."
                    value={formData.className}
                    onChange={handleInputChange}
                    className={`w-full h-11 border ${
                      errors.className ? "border-red-500" : "border-gray-300"
                    } rounded px-3`}
                  />
                  {errors.className && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.className}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xl font-bold mb-2">Class Admin<span className="text-red-500 text-xl">*</span></label>
                  <select
                    name="admin"
                    value={formData.admin}
                    onChange={handleInputChange}
                    className={`w-full h-11 border ${
                      errors.admin ? "border-red-500" : "border-gray-300"
                    } rounded px-3 bg-white`}
                  >
                    <option value="">Select Class_Admin</option>
                    {admins.map((admin) => (
                      <option key={admin.userId} value={admin.account}>
                        {admin.fullName} ({admin.account})
                      </option>
                    ))}
                  </select>
                  {errors.admin && (
                    <p className="text-red-500 text-sm mt-1">{errors.admin}</p>
                  )}
                </div>
              </div>

              {/* Supplier, Curriculum */}
              <div className="grid grid-cols-2 gap-6 mt-5">
                <div>
                  <label className="block text-xl font-bold mb-2">
                    Supplier
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full h-11 border border-gray-300 rounded px-3"
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold mb-2">
                    Curriculum<span className="text-red-500 text-xl">*</span>
                  </label>
                  <select
                    name="curriculumId"
                    value={formData.curriculumId}
                    onChange={handleInputChange}
                    className={`w-full h-11 border ${
                      errors.curriculumId ? "border-red-500" : "border-gray-300"
                    } rounded px-3 bg-white`}
                  >
                    <option value="">Select curriculum</option>
                    {curriculums.map((curriculum) => (
                      <option
                        key={curriculum.curriculumId}
                        value={curriculum.curriculumId}
                      >
                        {curriculum.curriculumName}
                      </option>
                    ))}
                  </select>
                  {errors.curriculumId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.curriculumId}
                    </p>
                  )}
                </div>
              </div>

              {/* Plan Trainee No and Description */}
              <div className="grid grid-cols-2 gap-6 mt-5">
                <div>
                  <label className="block text-xl font-bold mb-2">
                    Plan Trainee No
                  </label>
                  <input
                    type="number"
                    name="planTraineeNo"
                    value={formData.planTraineeNo || ""}
                    onChange={handleInputChange}
                    className="h-11 w-full border border-gray-300 rounded px-3"
                  />
                  {errors.planTraineeNo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.planTraineeNo}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-[157px] h-[43px] bg-[#6FBC44] text-white font-bold rounded hover:bg-[#5da639] disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-[157px] h-[43px] bg-[#D5DCD0] text-black font-bold rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddNewClassForm;
