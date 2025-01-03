"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiEdit } from "react-icons/fi";
import { getJwtToken } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_API_URL } from "@/config/constant";
import moment from "moment";
import { toast, Toaster } from "react-hot-toast";
import SpinnerLoader from "../loading/SpinnerLoader";
import ConfirmLog from "../confirm-log/ConfirmLog";

const ViewSubjectListForm: React.FC = () => {
  const [subject, setSubject] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all"); // New state for status filter
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false); // Add code
  const [subjectIdToToggle, setSubjectIdToToggle] = useState<number | null>(null); // Add code

  const router = useRouter();

  const fetchSettings = async (page = 1) => {
    const token = getJwtToken();
    if (!token) {
      toast.error("You need to log in first");
      router.push("/authen/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_API_URL}/subject/search`,
        {
          keyword: searchTerm, // Search keyword
          page: page - 1, // Pagination (0-indexed)
          size: 10, // Items per page
          orderBy: "id", // Sorting field
          sortDirection: "asc", // Sorting direction
          status: statusFilter !== "all" ? statusFilter : undefined, // Apply status filter if not "all"
        
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const subjects = response?.data?.data?.dataSource;

      if (Array.isArray(subjects) && subjects.length > 0) {
        // If data exists
        setSubject(subjects);
        setTotalPages(response.data.data.pagination?.totalPages || 1); // Set total pages
        setError(null); // Clear error
      } else {
        // No data found
        setSubject([]);
        setTotalPages(1);
        setError("No data available in the list");
      }
    } catch (err) {
      // Handle errors
      setSubject([]);
      setTotalPages(1);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/authen/login");
      } else {
        toast.error("An error occurred while fetching data");
        console.error("Error fetching subject:", err);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSettings(currentPage);
  }, [currentPage,statusFilter]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Đặt lại trang hiện tại về 1
  };
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Add code: Cập nhật hàm handleToggleStatus
  const handleToggleStatus = (subjectId: number) => { // Add code
    setSubjectIdToToggle(subjectId); // Add code
    setShowConfirm(true); // Add code
  }; // Add code

  // Add code: Hàm xử lý xác nhận thay đổi trạng thái
  const handleConfirmToggle = async () => { // Add code
    if (subjectIdToToggle === null) return; // Add code

    const token = getJwtToken(); // Add code
    if (!token) { // Add code
      router.push("/authen/login"); // Add code
      return; // Add code
    } // Add code

    try { // Add code
      const updatingSubject = subject.find((u) => u.subjectId === subjectIdToToggle); // Add code
      if (!updatingSubject) return; // Add code

      const newStatus = !updatingSubject.status; // Add code
      
      await axios.put( // Add code
        `${BASE_API_URL}/subject/update-subject`, // Add code
        { // Add code
          id: subjectIdToToggle, // Add code
          subjectName: updatingSubject.subjectName, // Add code
          subjectCode: updatingSubject.subjectCode, // Add code
          documentLink: updatingSubject.documentLink, // Add code
          descriptions: updatingSubject.descriptions, // Add code
          status: newStatus, // Add code
          schemes: updatingSubject.scheme, // Add code
        }, // Add code
        { // Add code
          headers: { // Add code
            Authorization: `Bearer ${token}`, // Add code
          }, // Add code
        } // Add code
      ); // Add code

      setSubject((prevData) => // Add code
        prevData.map((subject) => // Add code
          subject.subjectId === subjectIdToToggle // Add code
            ? { ...subject, status: newStatus } // Add code
            : subject // Add code
        ) // Add code
      ); // Add code

      toast.success("Subject status updated successfully!"); // Add code
    } catch (err) { // Add code
      setError("Error updating subject status"); // Add code
      console.error("Error updating subject status:", err); // Add code
      if (axios.isAxiosError(err) && err.response?.status === 401) { // Add code
        router.push("/authen/login"); // Add code
      } // Add code

      toast.error("Failed to update subject status"); // Add code
    } finally { // Add code
      setShowConfirm(false); // Add code
      setSubjectIdToToggle(null); // Add code
    } // Add code
  }; // Add code

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 rounded ${
              currentPage === i
                ? "bg-[#6FBC44] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      if (currentPage > 3) {
        buttons.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            1
          </button>
        );
        if (currentPage > 4) {
          buttons.push(
            <span key="left-ellipsis" className="px-2">
              ...
            </span>
          );
        }
      }

      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages, currentPage + 1);
        i++
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 rounded ${
              currentPage === i
                ? "bg-[#6FBC44] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) {
          buttons.push(
            <span key="right-ellipsis" className="px-2">
              ...
            </span>
          );
        }
        buttons.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-2 min-h-screen">
      {loading ? (
        <SpinnerLoader /> // Sử dụng SpinnerLoader
      ) : (
      
      <>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-6xl font-bold">Subject List</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchSettings(1);
              }
            }}
          />
          <button
            onClick={() => fetchSettings(1)}
            className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:bg-[#5da639]"
          >
            Search
          </button>
          <button
            onClick={() => {
              router.push("/feature/add-subject");
            }}
            className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:bg-[#5da639]"
          >
            + Add 
          </button>
        </div>
      </div>
      <div className="mt-2">
  <span className="font-semibold mr-2">Status:</span>
  <select
    value={statusFilter}
    onChange={(e) => handleStatusFilterChange(e.target.value)} // Gọi hàm xử lý mới
    className="border px-3 py-1 rounded"
  >
    <option value="all">All</option>
    <option value="true">Active</option>
    <option value="false">Inactive</option>
  </select>
</div>
        <table className="w-full mt-4 table-auto border-collapse rounded py-5">
          <thead>
            <tr className="bg-[#6FBC44] text-white">
              <th className="px-6 py-3 uppercase border border-r-white">
                #
              </th>
              <th className="px-6 py-3 text-center border border-r-white">
                Subject Code
              </th>
              <th className="px-6 py-3 text-center border border-r-white">
                Subject Name
              </th>
              <th className="px-6 py-3 text-center border border-r-white">
                Last update
              </th>
              <th className="px-6 py-3 text-center border border-r-white">
                Status
              </th>
              <th className="px-6 py-3 text-center border border-r-white">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {subject.map((subject) => (
              <tr
                key={subject.subjectId}
                className={!subject.status ? "bg-gray-200" : ""}
              >
                <td className="border px-6 py-3 text-center">
                  {subject.subjectId}
                </td>
                <td className="border px-6 py-3 text-left">
                  {subject.subjectCode}
                </td>
                <td className="border px-6 py-3 text-left">
                  {subject.subjectName}
                </td>
                <td className="border px-6 py-3 text-center">
                  {moment(subject.updatedAt).format("DD/MM/YYYY")}
                </td>
                <td className="border px-6 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <div
                      onClick={() => handleToggleStatus(subject.subjectId)} // Add code
                      className={`flex h-6 w-12 cursor-pointer rounded-full border border-black ${
                        subject.status
                          ? "justify-end bg-green-600"
                          : "justify-start bg-black"
                      } px-[1px]`}
                    >
                      <motion.div
                        className="h-5 w-5 rounded-full bg-white"
                        layout
                        transition={{
                          type: "spring",
                          stiffness: 700,
                          damping: 30,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="border px-6 py-3 justify-center-center">
                  <div className="flex justify-center">
                    <Link
                      href={`/feature/view-subject-list/${subject.subjectId}`}
                    >
                      <FiEdit className="w-6 h-6 text-green-600 hover:text-green-800" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subject.length === 0 && (
  <div className="mt-4 text-center ">
    No data available in the list
  </div>
)}
        {/* Pagination Controls */}
        <div className="pagination mt-4 flex align-middle w-full justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            &lt;
          </button>

          {renderPaginationButtons()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </>)} 
    {/* Add code: Thêm modal xác nhận */}
    <ConfirmLog
        isOpen={showConfirm} // Add code
        onConfirm={handleConfirmToggle} // Add code
        onCancel={() => setShowConfirm(false)} // Add code
      /> 
    </div>
  );
};

export default ViewSubjectListForm;
