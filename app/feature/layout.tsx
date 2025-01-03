"use client";

import {
  BookOpenText,
  CircleUser,
  GraduationCap,
  Home,
  Library,
  LogOut,
  MessagesSquare,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useRole from "@/hooks/useRole";
import { BASE_API_URL } from "@/config/constant";
import axios from "axios";
import ConfirmLogSignout from "@/components/confirm-log/ConfirmLogSignout";

const Layout = ({ children }: { children: ReactNode }) => {
  const currentPath = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>({
    fullName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    emergencyPhone: "",
    roles: "",
    account: "",
  });

  const [showConfirm, setShowConfirm] = useState(false); // Add code
  // Lấy vai trò người dùng
  const role = useRole();

  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login"); // Chuyển hướng nếu không có token
      return;
    }

    // Gọi API để lấy thông tin người dùng
    axios
      .get(`${BASE_API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileData(response.data);
      })
      .catch(() => {
        router.push("/authen/login"); // Chuyển hướng nếu có lỗi
      });
  }, [router]);

  // Add event listeners for route changes
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  // Helper function to determine if the link is active
  const isActive = (path: string) => currentPath === path;

  // Add code: Xử lý đăng xuất
  const handleSignOut = () => {
    setShowConfirm(true); // Add code
  }; // Add code

  // Add code: Hàm xác nhận đăng xuất
  const confirmSignOut = () => { // Add code
    localStorage.removeItem("jwtToken");
    router.push("/authen/login");
  }; // Add code

  console.log(role);
  console.log(profileData);

  return (
    <div className="flex min-h-screen">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-[228px] bg-[#6FBC44] fixed h-screen z-10">
        <div className="p-10">
          <Image
            src="/assets/images/logo-fpt-1.png"
            alt="FPT Logo"
            width={150}
            height={50}
            className=""
            priority
          />
        </div>
        <nav className="text-white">
          <Link
            href="/authen/dashboard"
            className={`flex items-center px-6 py-3 ${
              isActive("/authen/dashboard")
                ? "bg-[#5da639]"
                : "hover:bg-[#5da639]"
            }`}
          >
            <Home className="w-6 h-6 mr-4" />
            <span className="font-bold">Dashboard</span>
          </Link>

                    {/* Hiển thị các mục khác nếu không phải ROLE_TRAINEE */}
                    {role !== "ROLE_TRAINEE" && (
            <>
              {/* Hiển thị System Setting cho ROLE_ADMIN, ROLE_CLASS_ADMIN, ROLE_MANAGER */}
              {["ROLE_ADMIN", "ROLE_CLASS_ADMIN", "ROLE_MANAGER"].includes(role) && (
                <Link
                  href="/feature/view-system-setting"
                  className={`flex items-center px-6 py-3 ${
                    isActive("/feature/view-system-setting")
                      ? "bg-[#5da639]"
                      : "hover:bg-[#5da639]"
                  }`}
                >
                  <Settings className="w-6 h-6 mr-4" />
                  <span className="font-bold">System Setting</span>
                </Link>
              )}

              {/* Hiển thị User cho ROLE_ADMIN, ROLE_CLASS_ADMIN, ROLE_MANAGER */}
              {["ROLE_ADMIN", "ROLE_CLASS_ADMIN", "ROLE_MANAGER"].includes(role) && (
                <Link
                  href="/feature/view-user-list"
                  className={`flex items-center px-6 py-3 ${
                    isActive("/feature/view-user-list")
                      ? "bg-[#5da639]"
                      : "hover:bg-[#5da639]"
                  }`}
                >
                  <Users className="w-6 h-6 mr-4" />
                  <span className="font-bold">User</span>
                </Link>
              )}

              {/* Hiển thị Subject cho các vai trò được chỉ định */}
              {["ROLE_ADMIN", "ROLE_CLASS_ADMIN", "ROLE_MANAGER", "ROLE_CONTENT_DEVELOPER", "ROLE_TRAINER", "ROLE_TRAINEE"].includes(role) && (
                <Link
                  href="/feature/view-subject-list"
                  className={`flex items-center px-6 py-3 ${
                    isActive("/feature/view-subject-list")
                      ? "bg-[#5da639]"
                      : "hover:bg-[#5da639]"
                  }`}
                >
                  <BookOpenText className="w-6 h-6 mr-4" />
                  <span className="font-bold">Subject</span>
                </Link>
              )}

              {/* Hiển thị Curriculum cho các vai trò được chỉ định */}
              {["ROLE_ADMIN", "ROLE_CLASS_ADMIN", "ROLE_MANAGER", "ROLE_CONTENT_DEVELOPER", "ROLE_TRAINER", "ROLE_TRAINEE"].includes(role) && (
                <Link
                  href="/feature/view-curriculum-list"
                  className={`flex items-center px-6 py-3 ${
                    isActive("/feature/view-curriculum-list")
                      ? "bg-[#5da639]"
                      : "hover:bg-[#5da639]"
                  }`}
                >
                  <Library className="w-6 h-6 mr-4" />
                  <span className="font-bold">Curriculum</span>
                </Link>
              )}
            </>
          )}

          {/* Hiển thị Class cho các vai trò được chỉ định */}
          {["ROLE_ADMIN", "ROLE_CLASS_ADMIN", "ROLE_MANAGER", "ROLE_TRAINER", "ROLE_TRAINEE"].includes(role) && (
            <Link
              href={`${
                role === "ROLE_TRAINEE"
                  ? `/feature/view-class-detail/${profileData.userId}`
                  : "/feature/view-class-list"
              }`}
              className={`flex items-center px-6 py-3 ${
                isActive("/feature/view-class-list")
                  ? "bg-[#5da639]"
                  : "hover:bg-[#5da639]"
              }`}
            >
              <GraduationCap className="w-6 h-6 mr-4" />
              <span className="font-bold">Class</span>
            </Link>
          )}

          {/* Hiển thị Feedback cho ROLE_ADMIN, ROLE_CLASS_ADMIN, ROLE_MANAGER, ROLE_TRAINEE */}
          {["ROLE_ADMIN", "ROLE_CLASS_ADMIN", "ROLE_MANAGER", "ROLE_TRAINEE"].includes(role) && (
            <Link
              href="/feature/feedback-list"
              className={`flex items-center px-6 py-3 ${
                isActive("/feature/feedback-list")
                  ? "bg-[#5da639]"
                  : "hover:bg-[#5da639]"
              }`}
            >
              <MessagesSquare className="w-6 h-6 mr-4" />
              <span className="font-bold">Feedback</span>
            </Link>
          )}

           
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-6 py-3 hover:bg-[#5da639] text-left"
          >
            <LogOut className="w-6 h-6 mr-4" />
            <span className="font-bold">Sign out</span>
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex justify-end items-center bg-[#EFF5EB] h-8 px-6 text-gray-800">
          <Link
            href="/authen/view-profile"
            className="flex items-center space-x-2 hover:underline"
          >
            <img
                  src={"/assets/icon/User-Avatar.png"}
                  alt=""
                  className="rounded-full object-cover w-6 h-6 mt-3 "
                  
                />
            <span className="font-bold mt-3">{profileData.account}</span>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>


      {/* Add code: Thêm modal xác nhận đăng xuất */}
      <ConfirmLogSignout
        isOpen={showConfirm} // Add code
        onConfirm={confirmSignOut} // Add code
        onCancel={() => setShowConfirm(false)} // Add code
      />
    </div>
  );
};

export default Layout;
