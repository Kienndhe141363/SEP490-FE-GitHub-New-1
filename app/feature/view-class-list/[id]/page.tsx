"use client";

import React, { useEffect, useState } from "react";
import { Home, Users, BookOpen, Settings, LogOut } from "lucide-react";
import { useParams } from "next/navigation";
import ClassInfo from "./ClassInfo";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import Trainee from "./Trainee";
import Session from "./Session";
import useRole from "@/hooks/useRole";
import Grade from "./Grade";
import TakeAttendanceForm from "./Attendance";
import WeeklyTimetableForm from "@/components/weekly-timeable/WeeklyTimeableForm";
import Schedule from "./Schedule";
import DataVisualizationForm from "@/components/data-visualization/DataVisualizationForm";
import TraineePass from "./TraineePass";

const Page = () => {
  const [activeTab, setActiveTab] = useState("Class Info");
  const listTabs = [
    "Class Info",
    "Trainee",
    // "Attendance",
    // "Grade",
    "Session",
    "Weekly Timetable",
  ];

  const { id } = useParams();

  const [data, setData] = useState<any>(null);

  const [listTrainee, setListTrainee] = useState([]);

  const fetchListTrainee = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/class-management/get-trainee-in-class/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      setListTrainee(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/class-management/detail/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      setData(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchListTrainee();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Class Info":
        return <ClassInfo id={id} data={data} listTrainee={listTrainee} />;
      case "Trainee":
        return (
          <Trainee
            id={id}
            listTrainee={listTrainee}
            fetchListTrainee={fetchListTrainee}
            status={data?.status}
          />
        );
      case "Attendance":
        return <TakeAttendanceForm id={id} listTrainee={listTrainee} />;
      case "Grade":
        return <Grade id={id} />;
      case "Session":
        return <Session id={id} startDate={data?.startDate} />;
      case "Weekly Timetable":
        return <WeeklyTimetableForm id={id} listTrainee={listTrainee} />;
      case "Schedule":
        return <Schedule id={id} startDate={data?.startDate} />;
      case "Trainee Pass":
        return <TraineePass id={id} />;
      case "Data visualization":
        return <DataVisualizationForm id={id} />;
      default:
        return null;
    }
  };

  // tôi muốn khi data có status là true thì mới hiển thị tab Attendance và Grade ở trước tab Session
  if (data?.status) {
    listTabs.splice(2, 0, "Attendance", "Grade");
  }

  const role = useRole();
  if (
    (role === "ROLE_CLASS_ADMIN" || role === "ROLE_MANAGER") &&
    data?.status
  ) {
    listTabs.push("Schedule");
    listTabs.push("Trainee Pass");
  }

  if ((role === "ROLE_CLASS_ADMIN" || role === "ROLE_ADMIN") && data?.status) {
    listTabs.push("Data visualization");
  }

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-2 min-h-screen">
      {/* Sidebar */}
      {/* <aside className="w-[250px] bg-[#6FBC44] h-full flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-2">
            <img
              src="/assets/images/fpt-software.png"
              alt="FPT Software"
              className="h-8"
            />
            <div className="border-l-2 border-white h-8 mx-2"></div>
            <img
              src="/assets/images/fpt-academy.png"
              alt="FPT Academy"
              className="h-8"
            />
          </div>
        </div>

        <nav className="flex flex-col flex-1 text-white">
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <Home className="w-6 h-6 mr-4" />
            <span className="font-medium">Home</span>
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <Users className="w-6 h-6 mr-4" />
            <span className="font-medium">User Management</span>
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <BookOpen className="w-6 h-6 mr-4" />
            <span className="font-medium">Curriculum Management</span>
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:bg-[#5da639]"
          >
            <BookOpen className="w-6 h-6 mr-4" />
            <span className="font-medium">Class Management</span>
          </a>

          <div className="mt-auto">
            <a
              href="#"
              className="flex items-center px-6 py-3 hover:bg-[#5da639]"
            >
              <Settings className="w-6 h-6 mr-4" />
              <span className="font-medium">Setting</span>
            </a>
            <a
              href="#"
              className="flex items-center px-6 py-3 hover:bg-[#5da639]"
            >
              <LogOut className="w-6 h-6 mr-4" />
              <span className="font-medium">Sign out</span>
            </a>
          </div>
        </nav>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 bg-[#EFF5EB] overflow-y-auto">
        <div className="">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-medium">
              Class Detail: {data?.className}
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-8 mb-6">
            {listTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-medium ${
                  activeTab === tab
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-lg p-8">{renderTabContent()}</div>

          {/* Buttons */}
          {/* <div className="flex justify-center gap-4 mt-8">
              <button className="px-8 py-2 bg-[#6FBC44] text-white font-medium rounded-lg">
                Save
              </button>
              <button className="px-8 py-2 bg-[#D5DCD0] text-black font-medium rounded-lg">
                Cancel
              </button>
            </div> */}
          {/* </div> */}
        </div>
      </main>
    </div>
  );
};

export default Page;
