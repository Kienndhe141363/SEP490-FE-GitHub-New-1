"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  LogOut,
  ChevronUp,
  ChevronDown,
  Plus,
} from "lucide-react";
import { formatDate } from "date-fns";
import { BASE_API_URL } from "@/config/constant";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { getJwtToken } from "@/lib/utils";
import SpinnerLoader from "../loading/SpinnerLoader";

interface Lesson {
  id: number;
  name: string;
  order: number;
  date: string;
  description?: string;
}

interface Subject {
  id: number;
  name: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

interface AddNewClass4FormProps {
  setActiveStep: (step: number) => void;
  data: any;
}

const AddNewClass4Form = ({ setActiveStep, data }: AddNewClass4FormProps) => {
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    router.push("/feature/view-class-list");
  };
  console.log(data);
  const activeTab = "Session";

  const [subjects, setSubjects] = useState<any>([]);

  const router = useRouter();

  const toggleSubject = (subjectId: number) => {
    setSubjects(
      subjects.map((subject: any) =>
        subject.subjectId === subjectId
          ? { ...subject, isExpanded: !subject.isExpanded }
          : subject
      )
    );
  };

  const handleUpdateClass = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await fetch(
        `${BASE_API_URL}/class-management/update-class-by-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId: data.classId,
            classCode: data.classCode,
            locationId: data.locationId,
            generationId: data.generationId,
            curriculumId: data?.curriculumId || 18,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            description: data.note,
            subjectList: data?.subjectList?.map((subject: any) => ({
              subjectId: subject.subjectId,
              slot: subject.slot,
              trainer: subject.trainer,
            })),
            subjectSessionList: subjects.map((subject: any) => ({
              subjectId: subject.subjectId,
              sessionList: subject.sessionsList.map((session: any) => ({
                sessionId: session.sessionId,
                lesson: session.lesson,
                sessionOrder: session.sessionOrder,
                description: session.description,
                date: session.date ? new Date(session.date) : null,
                startDate: session.startDate ? new Date(session.date) : null,
                endDate: session.endDate ? new Date(session.endDate) : null,
              })),
            })),
          }),
        }
      );
      const res = await response.json();
      console.log("res", res);
      if (res.code === "Success") {
        router.push("/feature/view-class-list");
        // alert("Add class successfully");
        toast("Add class successfully", {
          icon: "✅",
        });
      }
    } catch (error) {
      // console.error(error);
      toast.error("Add class failed", {
        icon: "❌",
      });
    } finally {
      setLoading(false); // Tắt loading
    }
  };

  const getTimeTableBySubject = async (sessionList: any) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/class-management/get-time-table-session`,
        {
          startDate: data.startDate,
          sessions: sessionList,
          slot: 0,
        },
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = response.data;
      return res?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchListSubject = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/subject/get-subject-in-class/${data.classId}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();

      // Combine all session lists into a single list
      const combinedSessionList = res?.data?.listSubject?.reduce(
        (acc: any[], subject: any) => {
          return acc.concat(subject.sessionsList);
        },
        []
      );

      // Call getTimeTableBySubject once with the combined session list
      const combinedSessions = await getTimeTableBySubject(combinedSessionList);

      // Distribute the returned sessions back to their respective subjects
      let sessionIndex = 0;
      const subjects = res?.data?.listSubject?.map(
        (subject: any, index: number) => {
          const sessionsList = subject.sessionsList.map(
            () => combinedSessions[sessionIndex++]
          );
          return {
            ...subject,
            isExpanded: index === 0,
            sessionsList,
          };
        }
      );

      setSubjects(subjects);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchListSubject();
  }, []);

  if (loading) {
    return <SpinnerLoader />;
  }
  return (
    <div className="flex ml-[228px] bg-[#EFF5EB] min-h-screen">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold">New Class</h1>

        {/* Tabs */}
        <div className="mt-6">
          <div className="flex space-x-4 border-b border-gray-300">
            {["Class Info", "Trainee", "Session"].map((tab) => (
              <button
                key={tab}
                className={`pb-2 ${
                  activeTab === tab ? "border-b-2 border-[#6FBC44]" : ""
                }`}
                disabled={activeTab !== tab}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Session Content */}
          <div className="mt-6">
            {/* Header with borders */}
            <div className="grid grid-cols-5 bg-[#6FBC44] text-white rounded-t-lg">
              <div className="p-3 border-r border-white">No</div>
              <div className="p-3 border-r border-white">Lesson</div>
              <div className="p-3 border-r border-white">Order</div>
              <div className="p-3 border-r border-white">Date</div>
              <div className="p-3">Description</div>
            </div>

            {subjects?.map((subject: any) => (
              <div key={subject.subjectId} className="border rounded-lg mb-4">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleSubject(subject.subjectId)}
                >
                  <h3 className="font-bold">{subject.subjectName}</h3>
                  {subject?.isExpanded ? <ChevronUp /> : <ChevronDown />}
                </div>

                {subject?.isExpanded && (
                  <>
                    {subject?.sessionsList?.map(
                      (lesson: any, index: number) => (
                        <div key={index} className="grid grid-cols-5 border-t">
                          <div className="p-4 border-r">{index + 1}</div>
                          <div className="p-4 border-r">{lesson.lesson}</div>
                          <div className="p-4 border-r">
                            {lesson.sessionOrder}
                          </div>
                          <div className="p-4 border-r">
                            {/* {lesson.date
                              ? formatDateRange(lesson.date, lesson.endDate)
                              : "--"} */}
                            {/* {formatDate(getStartDate(index), "dd/MM/yyyy")} */}
                            {formatDate(
                              new Date(lesson.startDate),
                              "dd/MM/yyyy"
                            )}
                          </div>
                          <div className="p-4">{lesson.description}</div>
                        </div>
                      )
                    )}
                    {/* <LessonForm
                      setSubjects={setSubjects}
                      subjects={subjects}
                      subjectId={subject.subjectId}
                    /> */}
                  </>
                )}
              </div>
            ))}

            {/* Navigation Buttons */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                className="bg-gray-200 px-6 py-2 rounded"
                onClick={handleCancel}
              >
                Back
              </button>
              <button
                className="bg-[#6FBC44] text-white px-6 py-2 rounded"
                onClick={handleUpdateClass}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewClass4Form;
