"use client";
import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  LogOut,
  UserSquare2,
  GraduationCap,
  ChevronDown,
} from "lucide-react";
import { FiEdit } from "react-icons/fi";
import axios from "axios";
import { BASE_API_URL } from "@/config/constant";
import { useRouter } from "next/navigation";
import Link from "next/link";
import loading from "../ui/loading";
import SpinnerLoader from "../loading/SpinnerLoader";
import toast from "react-hot-toast";


interface FeedbackData {
  feedbackId: number;
  userId: number;
  traineeName: string;
  subjectCode: string;
  avgRating: number;
  openDate: string;
  lastUpdate: string;
}

interface User {
  userId: number;
  fullName: string;
  email: string;
  roles: string;
  phone: string;
  status: true | false;
}

interface Subject {
  subjectId: string;
  subjectCode: string;
}

const FeedbackListForm: React.FC = () => {
  // States
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showTrainerDropdown, setShowTrainerDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showRateDropdown, setShowRateDropdown] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("All");
  const [selectedRate, setSelectedRate] = useState<number | null>(null);
  const [orderBy, setOrderBy] = useState<string>("");
  const [showNotRated, setShowNotRated] = useState(false);
  const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([
    { subjectId: "All", subjectCode: "All" },
  ]);
  const [trainers, setTrainers] = useState<User[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<string>("All");
  const trainerDropdownRef = React.useRef<HTMLDivElement>(null);
  const subjectDropdownRef = React.useRef<HTMLDivElement>(null);

  // Filter options
  const rates = [
    { label: "All", value: null },
    { label: "5 ⭐", value: 5 },
    { label: "4 ⭐", value: 4 },
    { label: "3 ⭐", value: 3 },
    { label: "2 ⭐", value: 2 },
    { label: "1 ⭐", value: 1 },
  ];

  const router = useRouter();

  // Fetch trainers with ROLE_TRAINER
  useEffect(() => {
    const fetchTrainers = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        router.push("/authen/login");
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_API_URL}/user/management/list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { role: "ROLE_TRAINER" },
          }
        );

        const trainerData = response?.data?.users.filter(
          (user: User) => user.status
        );
        if (Array.isArray(trainerData)) {
          setTrainers(trainerData);
        } else {
          console.error("Data received is not an array:", trainerData);
          setTrainers([]);
        }
      } catch (err) {
        console.error("Error fetching trainers:", err);
      }
    };

    fetchTrainers();
  }, []);

  // Fetch feedback data from the backend
  useEffect(() => {
    const fetchFeedbacks = async (page = 0) => {
      setLoading(true); // Start loading
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          toast.error("You need to log in first");
          router.push("/authen/login");
          return;
        }
    
        const response = await axios.post(
          `${BASE_API_URL}/feedback-management/search`,
          {
            page, // Current page
            pageSize: 10, // Items per page
            userId: selectedTrainer !== "All" ? selectedTrainer : undefined, // Filter by Trainer
            subjectId: selectedSubjectId !== "All" ? selectedSubjectId : undefined, // Filter by Subject
            rate: selectedRate !== null ? selectedRate : undefined, // Filter by Rate
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Authorization header
            },
          }
        );
    
        const feedbackData = response?.data?.data?.dataSource;
    
        if (Array.isArray(feedbackData) && feedbackData.length > 0) {
          // If feedback data exists
          setFeedbacks(feedbackData);
          setTotalPages(response.data.data.pagination?.totalPages || 1); // Set total pages
        } else {
          // No data available
          setFeedbacks([]);
          setTotalPages(1);
          setError("No feedback data available");
        }
      } catch (error) {
        // Handle errors
        setFeedbacks([]);
        setTotalPages(1);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          router.push("/authen/login");
        } else {
          toast.error("An error occurred while fetching feedback data");
          console.error("Error fetching feedbacks:", error);
        }
      } finally {
        setLoading(false); // End loading
      }
    };
    

    fetchFeedbacks(currentPage);
  }, [
    currentPage,
    selectedTrainer,
    selectedSubjectId,
    selectedRate,
    showNotRated,
    orderBy,
  ]);

  // Fetch subjects for the dropdown
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          router.push("/authen/login");
          return;
        }

        const response = await axios.post(
          `${BASE_API_URL}/subject/search`,
          {
            keyword: "",
            page: 0,
            size: 100, // Adjust size as needed
            orderBy: "id",
            sortDirection: "asc",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedSubjects = response.data.data.dataSource.map(
          (subject: any) => ({
            subjectId: subject.subjectId,
            subjectCode: subject.subjectCode,
          })
        );
        setSubjects([
          { subjectId: "All", subjectCode: "All" },
          ...fetchedSubjects,
        ]); // Add "All" option
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []); // Run once on component mount

  // Handle subject selection
  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setShowSubjectDropdown(false);
  };

  // Handle rate selection
  const handleRateSelect = (rate: number | null) => {
    setSelectedRate(rate);
    setShowRateDropdown(false);
  };

  // Handle trainer selection
  const handleTrainerSelect = (trainerId: string) => {
    setSelectedTrainer(trainerId);
    setShowTrainerDropdown(false);
  };

  // Handle not rated toggle
  const handleNotRatedToggle = () => {
    setShowNotRated(!showNotRated);
    if (!showNotRated) {
      setSelectedRate(null);
      setShowRateDropdown(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        trainerDropdownRef.current &&
        !trainerDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTrainerDropdown(false);
      }
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSubjectDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-2 relative min-h-screen">
      {loading ? (
        <SpinnerLoader /> // Hiển thị SpinnerLoader khi loading
      ) : (

        <>
      <h2 className="text-6xl font-bold mb-8">Feedback List</h2>
    {/* Hiển thị thông báo lỗi */}
      {/* Search and Filters */}
      <div className="mb-8">
  <div className="flex justify-between mb-4">
    <div className="flex gap-2">
      <p className="font-semibold flex items-center mr-2">Filter:</p>
      
      {/* Trainer Dropdown */}
      <div className="relative" ref={trainerDropdownRef}>
        <button
          onClick={() => setShowTrainerDropdown(!showTrainerDropdown)}
          className={`w-24 bg-[#6FBC44] text-white px-2 py-1.5 rounded flex items-center justify-between ${
            selectedTrainer ? "bg-[#5da639]" : ""
          }`}
        >
          <span className="truncate">
            {selectedTrainer === "All"
              ? "All"
              : trainers.find(
                  (trainer) => trainer.userId.toString() === selectedTrainer
                )?.fullName || "Trainer"}
          </span>
          <ChevronDown size={14} />
        </button>
        {showTrainerDropdown && (
          <div className="absolute top-full mt-1 bg-white border rounded shadow-lg z-10 w-full max-h-48 overflow-y-auto">
            <div
              className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleTrainerSelect("All")}
            >
              All
            </div>
            {trainers.map((trainer) => (
              <div
                key={trainer.userId}
                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer truncate"
                onClick={() =>
                  handleTrainerSelect(trainer.userId.toString())
                }
              >
                {trainer.fullName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subject Dropdown */}
      <div className="relative" ref={subjectDropdownRef}>
        <button
          onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
          className={`w-24 bg-[#6FBC44] text-white px-2 py-1.5 rounded flex items-center justify-between ${
            selectedSubjectId ? "bg-[#5da639]" : ""
          }`}
        >
          <span className="truncate">
            {selectedSubjectId === "All"
              ? "All"
              : subjects.find(
                  (subject) => subject.subjectId === selectedSubjectId
                )?.subjectCode || "Subject"}
          </span>
          <ChevronDown size={14} />
        </button>
        {showSubjectDropdown && (
          <div className="absolute top-full mt-1 bg-white border rounded shadow-lg z-10 w-full max-h-48 overflow-y-auto">
            {subjects.map((subject) => (
              <div
                key={subject.subjectId}
                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer truncate"
                onClick={() => handleSubjectSelect(subject.subjectId)}
              >
                {subject.subjectCode}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rate Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowRateDropdown(!showRateDropdown)}
          className={`w-24 bg-[#6FBC44] text-white px-2 py-1.5 rounded flex items-center justify-between ${
            selectedRate !== null ? "bg-[#5da639]" : ""
          }`}
          disabled={showNotRated}
        >
          <span className="truncate">
            {selectedRate !== null ? `${selectedRate} ⭐` : "Rate"}
          </span>
          <ChevronDown size={14} />
        </button>
        {showRateDropdown && (
          <div className="absolute top-full mt-1 bg-white border rounded shadow-lg z-10 w-full">
            {rates.map((rate) => (
              <div
                key={rate.label}
                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRateSelect(rate.value)}
              >
                {rate.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className={`w-24 bg-[#6FBC44] text-white px-2 py-1.5 rounded ${
          showNotRated ? "bg-[#5da639]" : ""
        }`}
        onClick={handleNotRatedToggle}
      >
        Not Rate
      </button>

      {/* Order Options */}
      <div className="flex gap-2">
        <button
          className={`w-24 bg-[#6FBC44] text-white px-2 py-1.5 rounded ${
            orderBy === "latest" ? "bg-[#5da639]" : ""
          }`}
          onClick={() => setOrderBy("latest")}
        >
          Latest
        </button>
        <button
          className={`w-24 bg-[#6FBC44] text-white px-2 py-1.5 rounded ${
            orderBy === "high" ? "bg-[#5da639]" : ""
          }`}
          onClick={() => setOrderBy("high")}
        >
          High
        </button>
        <button
          className={`w-24 bg-[#6FBC44] text-white px-2 py-1.5 rounded ${
            orderBy === "low" ? "bg-[#5da639]" : ""
          }`}
          onClick={() => setOrderBy("low")}
        >
          Low
        </button>
      </div>
    </div>

    <div className="flex gap-4 ml-4">
      <input
        type="text"
        placeholder="Class code"
        className="border px-3 py-1.5 rounded w-36"
      />
      <button className="bg-[#6FBC44] text-white px-4 py-1.5 rounded">
        Search
      </button>
    </div>
  </div>
</div>

      
      {/* Feedback Table */}
      <table className="w-full bg-[#6FBC44] rounded-t-lg">
        <thead>
          <tr className="text-white">
            <th className="px-6 py-3 border text-center">#</th>
            <th className="px-6 py-3 border text-center">Trainee Name</th>
            <th className="px-6 py-3 border text-center">Subject Code</th>
            <th className="px-6 py-3 border text-center">Avg Rating</th>
            <th className="px-6 py-3 border text-center">Open Date</th>
            <th className="px-6 py-3 border text-center">Last Update</th>
            <th className="px-6 py-3 border text-center">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {feedbacks.map((feedback, index) => (
            <tr key={feedback.feedbackId} className="border-b">
              <td className="px-6 py-3 text-center">{feedback.feedbackId}</td>
              <td className="px-6 py-3">{feedback.traineeName}</td>
              <td className="px-6 py-3">{feedback.subjectCode}</td>
              <td className="px-6 py-3 text-center">{feedback.avgRating} ⭐</td>
              <td className="px-6 py-3 text-center">
                {new Date(feedback.openDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-3 text-center">
                {new Date(feedback.lastUpdate).toLocaleDateString()}
              </td>
              <td className="border px-6 py-3 justify-center-center">
                <div
                  className="flex justify-center"
                  onClick={() =>
                    router.push(`/feature/feedback-list/${feedback.feedbackId}`)
                  }
                >
                  {/* <Link href={``}> */}
                  <FiEdit className="w-6 h-6 text-green-600 hover:text-green-800" />
                  {/* </Link> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {feedbacks.length === 0 && (
        <div className="mt-4 text-center ">
          No data available in the list
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination mt-4 flex align-middle w-[100%] justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={`px-3 py-2 rounded ${
              currentPage === index
                ? "bg-[#6FBC44] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </>
      )}
    </div>
  );
};

export default FeedbackListForm;
