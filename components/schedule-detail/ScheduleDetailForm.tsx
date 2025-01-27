"use client";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ScheduleForm = ({
  schedule,
  setScheduleSelected,
  classId,
  fetchScheduleByClass2,
}: any) => {
  const [listTrainer, setListTrainer] = useState([]);
  const [listScheduleByClass, setListScheduleByClass] = useState<any>([]);

  const getSchedule = ({ subjectId, endDate, newList }: any) => {
    const scheduleDetail = newList?.find((item: any) => {
      const endTimeWithAddedHours = new Date(item.endTime);
      endTimeWithAddedHours.setHours(endTimeWithAddedHours.getHours() + 7);

      return (
        endTimeWithAddedHours.toISOString() === new Date(endDate).toISOString()
      );
    });

    return scheduleDetail;
  };

  const fetchScheduleByClass = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/class-management/get-schedule-by-class`,
        {
          classId,
          size: 1000,
          subjectId: schedule.subjectId,
        },
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );

      const res = response.data;
      const newList = res?.data?.dataSource;
      setListScheduleByClass(newList);
      const findSchedule = getSchedule({
        subjectId: schedule.subjectId,
        endDate: schedule.endDate,
        newList: newList,
      });

      setFormData({
        subjectName: schedule.subjectName,
        lesson: schedule.lesson,
        trainer: findSchedule?.trainer,
        date: schedule.date,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        scheduleDetailId: findSchedule?.scheduleDetailId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [formData, setFormData] = useState({
    subjectName: "Java",
    lesson: "Lesson2",
    trainer: "",
    date: "2024-12-09", // Định dạng ngày (YYYY-MM-DD) cho input type="date"
    startDate: "2024-12-09",
    endDate: "2024-12-09",
    scheduleDetailId: 0,
  });
  console.log(schedule, "schedule");
  console.log(formData, "formData");
  console.log(listTrainer, "listTrainer");
  console.log(listScheduleByClass, "listScheduleByClass");
  const fetchListTrainer = async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/class-management/get-trainer-for-class`,
        {
          startDate: schedule.startDate,
          endDate: schedule.endDate,
        },
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = response.data;
      setListTrainer(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm xử lý khi thay đổi giá trị trong form
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm xử lý khi nhấn nút "Save"
  const handleSave = async () => {
    try {
      const findSchedule = getSchedule({
        subjectId: schedule.subjectId,
        endDate: schedule.endDate,
        newList: listScheduleByClass,
      });
      const body = listScheduleByClass.map((item: any) =>
        findSchedule?.scheduleDetailId === item.scheduleDetailId
          ? {
              trainer: formData.trainer,
              lesson: formData.lesson,
              date: formData.date,
              scheduleDetailId: formData.scheduleDetailId,
            }
          : {
              trainer: item.trainer,
              lesson: item.lesson,
              date: item.date,
              scheduleDetailId: item.scheduleDetailId,
            }
      );
      const res = await axios.put(
        `${BASE_API_URL}/class-management/update-class-session`,
        body,
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      toast.success(`Updated schedule successfully`);
      setScheduleSelected(null);
      if (res) fetchScheduleByClass2({ subjectId: schedule.subjectId });
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm xử lý khi nhấn nút "Cancel"
  const handleCancel = () => {
    setScheduleSelected(null);
  };

  useEffect(() => {
    if (schedule) {
      fetchListTrainer();
      fetchScheduleByClass();
    }
  }, [schedule]);

  if (
    !listTrainer.find((item: any) => item.account === formData?.trainer) &&
    formData?.trainer
  )
    listTrainer.push({
      account: formData?.trainer,
    });

  const hasTeacherReplace = listTrainer?.length > 1;

  return (
    <div className="min-h-screen flex-1  bg-[#EFF5EB] p-8 py-10">
      <h2 className="text-4xl font-bold p-4 mb-16">Schedule Detail</h2>
      <div className=" flex items-center justify-center bg-[#EFF5EB] ">
        <div className="bg-white p-8 rounded-md shadow-md md:w-11/12 ">
          <div className="grid grid-cols-2 gap-6 py-10">
            <div>
              <label className="block font-semibold mb-1 text-xl">
                Subject
              </label>
              <input
                type="text"
                name="subjectName"
                value={formData.subjectName}
                readOnly
                className="border rounded w-full p-2 bg-gray-200"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xl">
                Session
              </label>
              <input
                type="text"
                name="lesson"
                value={formData.lesson}
                readOnly
                className="border rounded w-full p-2 bg-gray-200"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xl">
                Trainer
              </label>
              <select
                name="trainer"
                value={formData.trainer}
                onChange={handleChange}
                className="border rounded w-full p-2"
                disabled={!hasTeacherReplace}
              >
                {listTrainer.map((trainer, index) => (
                  <option key={index} value={trainer.account}>
                    {trainer.account}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xl">Date</label>
              <input
                type="date"
                name="date"
                value={new Date(formData.startDate).toISOString().split("T")[0]}
                onChange={handleChange}
                className="border rounded w-full p-2"
                disabled={hasTeacherReplace}
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-black px-6 py-2 rounded w-32 mr-4"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-[#6FBC44] text-white px-6 py-2 rounded w-32"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
