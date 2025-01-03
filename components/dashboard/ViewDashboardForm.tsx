"use client";
import React from "react";
import Link from "next/link";
import { Home, Users, BookOpen, Settings, LogOut, Library, BookOpenText, GraduationCap, MessagesSquare } from "lucide-react";
import useRole from "@/hooks/useRole";
const ViewDashBoardForm: React.FC = () => {
  const role = useRole();
  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] min-h-screen ">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 p-2 ">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <Link href="/feature/view-system-setting" className="bg-[#9CA3AF59] flex flex-col items-center justify-center p-20 mt-10 rounded-lg hover:shadow-lg hover:shadow-gray-400 hover:bg-gray-400">
            <Settings className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">System Setting</span>
          </Link>
          
          {role !== 'ROLE_CLASS_ADMIN' && (
            <Link href="/feature/view-user-list" className="bg-[#7203E172] flex flex-col items-center justify-center p-20 mt-10 rounded-lg hover:shadow-lg hover:shadow-purple-400 hover:bg-purple-400">
              <Users className="text-white w-16 h-16 mb-4" />
              <span className="text-xl font-bold">User</span>
            </Link>
          )}

          <Link href="/feature/view-subject-list" className="bg-[#60A5FA72] flex flex-col items-center justify-center p-20 mt-10 rounded-lg hover:shadow-lg hover:shadow-blue-400 hover:bg-blue-400">
            <BookOpenText className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">Subject</span>
          </Link>

          <Link href="/feature/view-curriculum-list" className="bg-[#D60C0C8C] flex flex-col items-center justify-center p-20 mt-10 rounded-lg hover:shadow-lg hover:shadow-red-400 hover:bg-red-400">
            <Library className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">Curriculum</span>
          </Link>

          <Link href="/feature/view-class-list" className="bg-[#0189328C] flex flex-col items-center justify-center p-20 mt-10 rounded-lg hover:shadow-lg hover:shadow-green-400 hover:bg-green-400">
            <GraduationCap className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">Class</span>
          </Link>

          <Link href="/feature/feedback-list" className="bg-[#EDB90FA6] flex flex-col items-center justify-center p-20 mt-10 rounded-lg hover:shadow-lg hover:shadow-yellow-400 hover:bg-yellow-400">
            <MessagesSquare className="text-white w-16 h-16 mb-4" />
            <span className="text-xl font-bold">Feedback</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewDashBoardForm;