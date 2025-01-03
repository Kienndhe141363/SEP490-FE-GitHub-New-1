"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getJwtToken } from "@/lib/utils";
import { BASE_API_URL } from "@/config/constant";
import axios from "axios";
import toast from "react-hot-toast";

// Helper functions for date handling
const createDaysArray = (month: number, year: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

const createYearsArray = (startYear: number, endYear: number) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
};

interface Week {
  start: number;
  end: number;
  startDate: Date;
  endDate: Date;
}

const getWeeksInMonth = (month: number, year: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const weeks: Week[] = [];
  let currentStart = 1;

  while (currentStart <= daysInMonth) {
    const currentDate = new Date(year, month, currentStart);
    const remainingDays = daysInMonth - currentStart + 1;
    let daysInWeek = Math.min(7, remainingDays);

    if (currentStart === 1) {
      daysInWeek = 7 - firstDayOfMonth.getDay();
    } else if (remainingDays >= 7) {
      daysInWeek = 7;
    }

    weeks.push({
      start: currentStart,
      end: currentStart + daysInWeek - 1,
      startDate: new Date(year, month, currentStart),
      endDate: new Date(year, month, currentStart + daysInWeek - 1)
    });
    currentStart += daysInWeek;
  }

  return weeks;
};

const weekLabels = (weeks: Week[]) => {
  return weeks.map((week, index) => {
    const startDateStr = week.startDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit'
    });
    const endDateStr = week.endDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit'
    });
    return `Week ${index + 1} (${startDateStr} - ${endDateStr})`;
  });
};

const monthMapping: { [key: string]: number } = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const attendanceStatus = {
  P: "Present",
  A: "Absent",
  L: "Late",
  E: "Early",
  An: "Absent with notice",
  Ln: "Late with notice",
  En: "Early with notice",
};

const attendanceNotes = {
  P: "Present",
  L: "Late Not Justified",
  Ln: "Late In",
  E: "Early Out Not Justified",
  En: "Early Out",
  An: "Absent Not Justified",
  A: "Absent",
};

const getAttendanceColor = (status: string) => {
  switch (status) {
    case "P":
      return "bg-green-400 text-green-800";
    case "A":
      return "bg-red-400 text-red-800";
    case "L":
      return "bg-yellow-400 text-yellow-800";
    case "E":
      return "bg-yellow-400 text-pink-800";
    case "An":
      return "bg-blue-400 text-blue-800";
    case "Ln":
      return "bg-purple-400 text-purple-800";
    case "En":
      return "bg-purple-400 text-gray-800";
    default:
      return "";
  }
};

const isCurrentDate = (date: number, selectedMonth: string, selectedYear: number) => {
  const today = new Date();
  const months = Object.keys(monthMapping);
  const checkDate = new Date(selectedYear, months.indexOf(selectedMonth), date);
  
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
};

type Props = {
  id: any;
  listTrainee: any[];
};

const TakeAttendanceForm = ({ id, listTrainee }: Props) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const dateTime = {
    January: createDaysArray(0, currentYear),
    February: createDaysArray(1, currentYear),
    March: createDaysArray(2, currentYear),
    April: createDaysArray(3, currentYear),
    May: createDaysArray(4, currentYear),
    June: createDaysArray(5, currentYear),
    July: createDaysArray(6, currentYear),
    August: createDaysArray(7, currentYear),
    September: createDaysArray(8, currentYear),
    October: createDaysArray(9, currentYear),
    November: createDaysArray(10, currentYear),
    December: createDaysArray(11, currentYear),
  };

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<keyof typeof dateTime>(
    Object.keys(dateTime)[currentMonth] as keyof typeof dateTime
  );
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [listSubject, setListSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [listAttendance, setListAttendance] = useState([]);
  const [listAttendanceUpdate, setListAttendanceUpdate] = useState([]);

  const years = createYearsArray(currentYear - 5, currentYear + 5);
  const months = Object.keys(dateTime);
  const attendanceStatusKeys = Object.keys(attendanceStatus);

  const fetchListSubject = async () => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/subject/get-subject-in-class/${id}`,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = await response.json();
      if (res?.data) {
        setListSubject(res?.data?.listSubject);
        setSelectedSubject(res?.data?.listSubject[0]?.subjectId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchListAttendance = async () => {
    try {
      const res = await axios.post(
        `${BASE_API_URL}/attendance-management/search-by-class?classId=${id}&subjectId=${selectedSubject}`,
        {
          classId: id,
          subjectId: selectedSubject,
        },
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );
      if (res?.data) {
        setListAttendance(res?.data?.data?.listAttendances);
        setListAttendanceUpdate([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeMonth = (month: keyof typeof dateTime) => {
    setSelectedMonth(month);
  };

  const handleReset = () => {
    setListAttendanceUpdate([]);
  };

  const handleAddAttendance = async () => {
    try {
      const formatData = listAttendanceUpdate.map((grade: any) => ({
        status: grade.status,
        attendanceNote: "note",
        scheduleDetailId: grade.scheduleDetailId,
        userId: grade.userId,
      }));

      await axios.post(
        `${BASE_API_URL}/attendance-management/attendance-update`,
        {
          data: formatData,
        },
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );
      toast("Add attendance successfully", {
        icon: "✅",
      });
      fetchListAttendance();
    } catch (error) {
      toast.error("Add attendance failed", {
        icon: "❌",
      });
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setListAttendance([]);
  };

  const findAttendance = (userId: number, date: any) => {
    const currentYear = new Date().getFullYear();
    const monthIndex = months.indexOf(selectedMonth);
    const targetDate = new Date(currentYear, monthIndex, date);
  
    const userAttendance = listAttendance.find(
      (attendance: any) => attendance.userId === userId
    );
  
    const attendanceDetail = userAttendance?.litAttendanceStatuses.find(
      (attendance: any) => {
        const endDate = new Date(attendance.endDate);
        return endDate.getDate() === targetDate.getDate() &&
               endDate.getMonth() === targetDate.getMonth() &&
               endDate.getFullYear() === targetDate.getFullYear();
      }
    );

    return (
      listAttendanceUpdate.find(
        (attendance: any) =>
          attendance.userId === userId && attendance.date === date
      )?.status ||
      attendanceDetail?.status ||
      ""
    );
  };

  const isDisableAttendance = (userId: number, date: any) => {
    if (!isCurrentDate(date, selectedMonth, selectedYear)) {
      return true;
    }

    const userAttendance = listAttendance.find(
      (attendance: any) => attendance.userId === userId
    );

    const attendanceDetail = userAttendance?.litAttendanceStatuses.find(
      (attendance: any) => {
        const endDate = new Date(attendance.endDate).getDate();
        return endDate === date;
      }
    );

    return !attendanceDetail;
  };

  const findScheduleDetailId = (userId: number, date: any) => {
    const userAttendance = listAttendance.find(
      (attendance: any) => attendance.userId === userId
    );

    const attendanceDetail = userAttendance?.litAttendanceStatuses.find(
      (attendance: any) => {
        const endDate = new Date(attendance.endDate).getDate();
        return endDate === date;
      }
    );

    return attendanceDetail?.scheduleDetailId;
  };

  const getCurrentWeekDays = () => {
    if (!weeks[selectedWeek]) return [];
    const { start, end } = weeks[selectedWeek];
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  useEffect(() => {
    fetchListSubject();
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    fetchListAttendance();
  }, [selectedSubject, listTrainee]);

  useEffect(() => {
    const monthIndex = Object.keys(dateTime).indexOf(selectedMonth);
    const weeksInMonth = getWeeksInMonth(monthIndex, selectedYear);
    setWeeks(weeksInMonth);
    setSelectedWeek(0);
  }, [selectedMonth, selectedYear]);

  return (
    <div>
      <Card className="shadow-none border-0">
        <CardContent className="p-0">
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-4">
              <span className="font-medium">MileStone:</span>

              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue>{selectedYear}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedMonth} onValueChange={handleChangeMonth}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue>{selectedMonth}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedWeek.toString()} 
                onValueChange={(value) => setSelectedWeek(Number(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  {weekLabels(weeks).map((label, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium">Subject:</span>
              <Select
                value={selectedSubject}
                onValueChange={handleSubjectChange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {listSubject?.map((subject: any) => (
                    <SelectItem
                      key={subject.subjectId}
                      value={subject.subjectId}
                    >
                      {subject.subjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium">Note:</span>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Click to view note" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(attendanceNotes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {key}: {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-center w-16 bg-[#6FBC44] text-white border">
                    #
                  </th>
                  <th
                    className="p-3 text-left bg-[#6FBC44] text-white border"
                    style={{ width: "300px" }}
                  >
                    Name
                  </th>
                  {getCurrentWeekDays().map((date: number) => {
                    const monthIndex = months.indexOf(selectedMonth);
                    const currentDate = new Date(selectedYear, monthIndex, date);
                    const formattedDate = currentDate.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit'
                    });
                    
                    return (
                      <th
                        key={date}
                        className="p-3 text-center bg-[#6FBC44] text-white border min-w-3"
                      >
                        {formattedDate}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {listTrainee.map((trainee, index) => (
                  <tr key={trainee.userId}>
                    <td className="p-3 text-center border">{index + 1}</td>
                    <td className="p-3 border" style={{ whiteSpace: "nowrap" }}>
                      {trainee.fullName}
                    </td>
                    {getCurrentWeekDays().map((date: number) => (
                      <td
                        key={`${trainee.userId}-${date}`}
                        className="p-3 text-center border min-w-3"
                      >
                        <select
                          className={`bg-transparent cursor-pointer outline-none min-w-3 text-center font-medium
                                    ${getAttendanceColor(findAttendance(trainee.userId, date))}
                                    ${isDisableAttendance(trainee.userId, date) ? 'opacity-50' : ''}`}
                          value={findAttendance(trainee.userId, date) || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!isCurrentDate(date, selectedMonth, selectedYear)) return;

                            const foundIndex = listAttendanceUpdate.findIndex(
                              (item) =>
                                item.userId === trainee.userId &&
                                item.date === date
                            );
                            if (foundIndex !== -1) {
                              listAttendanceUpdate[foundIndex] = {
                                userId: trainee.userId,
                                date: date,
                                status: value,
                                scheduleDetailId: findScheduleDetailId(
                                  trainee.userId,
                                  date
                                ),
                              };
                              setListAttendanceUpdate([...listAttendanceUpdate]);
                            } else {
                              setListAttendanceUpdate([
                                ...listAttendanceUpdate,
                                {
                                  userId: trainee.userId,
                                  date: date,
                                  status: value,
                                  scheduleDetailId: findScheduleDetailId(
                                    trainee.userId,
                                    date
                                  ),
                                },
                              ]);
                            }
                          }}
                          disabled={isDisableAttendance(trainee.userId, date)}
                        >
                          <option value=""></option>
                          {attendanceStatusKeys.map((status, index) => (
                            <option
                              key={status}
                              value={attendanceStatusKeys[index]}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              className="bg-gray-200 px-6 py-2 rounded"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              className={`${
                listAttendanceUpdate.length === 0
                  ? "bg-[#bddaaa]"
                  : "bg-[#6FBC44]"
              }  text-white px-6 py-2 rounded`}
              onClick={handleAddAttendance}
              disabled={listAttendanceUpdate.length === 0}
            >
              Save
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TakeAttendanceForm;