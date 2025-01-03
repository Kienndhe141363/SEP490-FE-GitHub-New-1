"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Home, Users, BookOpen, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import Link from "next/link";
import { BASE_API_URL } from "@/config/constant";
import useUserStore from "@/store/UserStore";
import toast from "react-hot-toast";
import SpinnerLoader from "../loading/SpinnerLoader";
import ConfirmLog from "../confirm-log/ConfirmLog";

interface User {
  userId: number;
  fullName: string;
  email: string;
  roles: string;
  role: string;
  phone: string;
  status: true | false;
  account: string;
}

const ViewUserListForm: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // Start with page 0
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>(""); // For Status filter
  const [roleFilter, setRoleFilter] = useState<string>(""); // For Role filter
  // const currentUser = useUserStore((state) => state.user);
  const [showConfirm, setShowConfirm] = useState(false); // Add code
  const [userIdToToggle, setUserIdToToggle] = useState<number | null>(null); // Add code

  const searchUsers = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("You need to log in first");
      router.push("/authen/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_API_URL}/user/search`,
        {
          keyword: `%${searchTerm}%`, // Search keyword
          status: statusFilter ? statusFilter === "true" : undefined, // Status (true/false or undefined)
          roleId: roleFilter || undefined, // Role ID (or undefined if not selected)
          page: currentPage,
          orderBy: "userId",
          sortDirection: "asc",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response?.data?.data?.dataSource;
      if (!Array.isArray(userData) || userData.length === 0) {
        // No data returned
        setError("No data available in the list");
        setUsers([]);
        setTotalPages(1);
        return;
      }

      // Process valid data
      setUsers(userData.sort((a, b) => a.userId - b.userId));
      setTotalPages(response.data.data.pagination?.totalPages || 1); // Calculate total pages
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError("No data available in the list");
        } else if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          router.push("/authen/login");
        } else {
          toast.error("An error occurred while searching");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error("Search error:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };


  
  // Add code: Cập nhật hàm handleToggleStatus
  const handleToggleStatus = (userId: number) => { // Add code
    setUserIdToToggle(userId); // Add code
    setShowConfirm(true); // Add code
  }; // Add code

  // Add code: Hàm xử lý xác nhận thay đổi trạng thái
  const handleConfirmToggle = async () => { // Add code
    if (userIdToToggle === null) return; // Add code

    const token = localStorage.getItem("jwtToken"); // Add code
    if (!token) { // Add code
      router.push("/authen/login"); // Add code
      return; // Add code
    } // Add code

    try { // Add code
      const user = users.find((u) => u.userId === userIdToToggle); // Add code
      if (!user) return; // Add code

      const newStatus = !user.status; // Add code

      await axios.post( // Add code
        `${BASE_API_URL}/user/management/status/${userIdToToggle}`, // Add code
        { status: newStatus }, // Add code
        { headers: { Authorization: `Bearer ${token}` }, } // Add code
      ); // Add code

      setUsers((prevUsers) => // Add code
        prevUsers.map((user) => // Add code
          user.userId === userIdToToggle ? { ...user, status: newStatus } : user // Add code
        ) // Add code
      ); // Add code

      toast.success(`Update user status successfully!`); // Add code
    } catch (err) { // Add code
      toast.error("Error updating user status"); // Add code
      console.error("Error updating user status:", err); // Add code
      if (axios.isAxiosError(err) && err.response?.status === 401) { // Add code
        router.push("/authen/login"); // Add code
      } // Add code

      toast.error("Failed to update user status"); // Add code
    } finally { // Add code
      setShowConfirm(false); // Add code
      setUserIdToToggle(null); // Add code
    } // Add code
  }; // Add code

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are within the max visible range
      for (let i = 0; i < totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 rounded ${
              currentPage === i
                ? "bg-[#6FBC44] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      // If there are many pages, show a subset with ellipses
      if (currentPage > 2) {
        pageButtons.push(
          <button
            key={0}
            onClick={() => handlePageChange(0)}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            1
          </button>
        );
        if (currentPage > 3) {
          pageButtons.push(
            <span key="left-ellipsis" className="px-2">
              ...
            </span>
          );
        }
      }

      // Display pages around the current page
      for (
        let i = Math.max(0, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-2 rounded ${
              currentPage === i
                ? "bg-[#6FBC44] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        );
      }

      // Add ellipses and last page if the current page is far from the last page
      if (currentPage < totalPages - 3) {
        if (currentPage < totalPages - 4) {
          pageButtons.push(
            <span key="right-ellipsis" className="px-2">
              ...
            </span>
          );
        }
        pageButtons.push(
          <button
            key={totalPages - 1}
            onClick={() => handlePageChange(totalPages - 1)}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            {totalPages}
          </button>
        );
      }
    }

    return pageButtons;
  };
  const downloadTemplate = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login");
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_API_URL}/user/management/export-template`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Quan trọng để tải file
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "UserTemplate.xlsx"); // Đặt tên file
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Template downloaded successfully!");
    } catch (err) {
      console.error("Error downloading template:", err);
      toast.error("Failed to download template");
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login");
      return;
    }
  
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }
  
    // Kiểm tra đuôi file phải là .xlsx
    if (
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      !file.name.endsWith(".xlsx")
    ) {
      toast.error("Invalid file format. Please upload an Excel file (.xlsx).");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true); // Bắt đầu quá trình loading
    try {
      const response = await fetch(`${BASE_API_URL}/user/management/import`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const contentType = response.headers.get("Content-Type");
  
      if (contentType?.includes("application/json")) {
        const jsonResponse = await response.json();
        if (jsonResponse?.errorCode === "Success") {
          toast.success(jsonResponse.message || "File imported successfully!");
        } else {
          // Hiển thị lỗi nếu phản hồi không thành công
          toast.error(jsonResponse.message || "Error occurred during import.");
        }
      } else if (contentType?.includes("application/octet-stream")) {
        // Nếu API trả về file lỗi
        const blob = await response.blob();
        const errorMessage =
          response.headers.get("x-error-message") ||
          "Import failed. Please check the error file!";
        toast.error(errorMessage);
  
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "import-user-error.xlsx";
        a.click();
      }
    } catch (err) {
      toast.error(
        (err as any)?.response?.data?.message || "Failed to import file"
      );
    }
    setLoading(false); // Kết thúc quá trình loading
  };

  useEffect(() => {
    searchUsers(new Event("submit") as unknown as React.FormEvent); // Gọi lại searchUsers khi thay đổi bộ lọc//-
  }, [statusFilter, roleFilter, currentPage]);

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-2 min-h-screen">
      {loading ? (
        <SpinnerLoader /> // Sử dụng SpinnerLoader
      ) : (
        <>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-6xl font-bold">User List</h2>
        <div className="flex space-x-4">
          <form onSubmit={searchUsers} className="flex space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="border px-3 py-1 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639]"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          <button
            className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639]"
            onClick={() => router.push("/feature/add-user")}
          >
            +Add 
          </button>

          <button
            className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639]"
            onClick={() => downloadTemplate()}
          >
            Download Template
          </button>

          <label className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-gray-500 shadow-md hover:shadow-lg hover:shadow-gray-500 hover:bg-[#5da639] cursor-pointer">
            Import
            <input type="file" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      
      <div className="flex-1 space-x-4 mt-2">
        {/* Status Filter */}
        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Role Filter */}
        <select
          className="border px-3 py-2 rounded "
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="1">ROLE_ADMIN</option>
          <option value="2">ROLE_MANAGER</option>
          <option value="3">ROLE_CLASS_ADMIN</option>
          <option value="4">ROLE_TRAINER</option>
          <option value="5">ROLE_TRAINEE</option>
          <option value="6">ROLE_CONTENT_DEVELOPER</option>
        </select>
      </div>
      
          <table className="w-full mt-4 table-auto border-collapse rounded ">
            <thead>
              <tr className="bg-[#6FBC44] text-white">
                <th className="px-6 py-3 border text-center border-r-white">
                  #
                </th>
                <th className="px-6 py-3 text-center border border-r-white">
                  Account
                </th>
                <th className="px-6 py-3 text-center border border-r-white">
                  Role
                </th>
                <th className="px-6 py-3 text-center border border-r-white">
                  Email
                </th>
                <th className="px-6 py-3 text-center border border-r-white">
                  Phone number
                </th>
                <th className="px-6 py-3 text-center border border-r-white">
                  Status
                </th>
                <th className="px-6 py-3 text-center border border-r-white">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {users
                
                .map((user) => (
                  <tr
                    key={user.userId}
                    className={user.status === false ? "bg-gray-200" : ""}
                  >
                    <td className="border px-6 py-3 text-center">
                      {user.userId}
                    </td>
                    <td className="border px-6 py-3 text-left">
                      {user.account}
                    </td>
                    <td className="border px-6 py-3 text-left">
                      {user.roles || user.role || "No Role"}
                    </td>
                    <td className="border px-6 py-3 text-left">{user.email}</td>
                    <td className="border px-6 py-3 text-center">
                      {user.phone}
                    </td>
                    <td className="border px-6 py-3 text-center">
                    {user.role !== "ROLE_ADMIN" && (
                        <div className="flex items-center justify-center">
                          <div
                            onClick={() => handleToggleStatus(user.userId)}
                            className={`flex h-6 w-12 cursor-pointer rounded-full border border-black ${
                              user.status
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
                      )}
                    </td>
                    <td className="border px-6 py-3 justify-center-center">
                      <div className="flex justify-center">
                        <Link href={`/feature/view-user-detail/${user.userId}`}>
                          <FiEdit className="w-6 h-6 text-green-600 hover:text-green-800" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {users.length === 0 && (
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

            {renderPaginationButtons()}

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
      {/* Add code: Thêm modal xác nhận */}
      <ConfirmLog
        isOpen={showConfirm} // Add code
        onConfirm={handleConfirmToggle} // Add code
        onCancel={() => setShowConfirm(false)} // Add code
      /> 
    </div>
  );
};

export default ViewUserListForm;
