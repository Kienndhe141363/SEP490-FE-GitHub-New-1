import useRole from "@/hooks/useRole";
import { formatDate } from "date-fns";
import { useState } from "react";

type Props = {
  id: any;
  data: any;
  listTrainee: any[];
};

const ClassInfo = ({ id, data, listTrainee }: Props) => {
  const role = useRole();
  return (
    <div className="grid grid-cols-2 gap-4">
      {/** Adjusted each field to have uniform styling */}
      <div className="flex flex-col">
        <label className="text-lg font-semibold mb-1">Class Code</label>
        <input
          type="text"
          className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
          value={data?.classCode}
          readOnly
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-semibold mb-1">Class Admin</label>
        <input
          type="text"
          className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
          value={data?.admin}
          readOnly
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-semibold mb-1">Location</label>
        <input
          type="text"
          className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
          value={data?.locationName}
          readOnly
        />
      </div>

      {role !== "ROLE_TRAINEE" && (
        <div className="flex flex-col">
          <label className="text-lg font-semibold mb-1">Plan Trainee No</label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
            value={data?.planTraineeNo}
            readOnly
          />
        </div>
      )}

      <div className="flex flex-col">
        <label className="text-lg font-semibold mb-1">Start Date</label>
        <input
          type="text"
          className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
          value={
            data?.startDate &&
            formatDate(new Date(data?.startDate), "dd/MM/yyyy")
          }
          readOnly
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-semibold mb-1">End Date</label>
        <input
          type="text"
          className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
          value={
            data?.endDate && formatDate(new Date(data?.endDate), "dd/MM/yyyy")
          }
          readOnly
        />
      </div>

      {role !== "ROLE_TRAINEE" && (
        <div className="flex flex-col">
          <label className="text-lg font-semibold mb-1">Supplier</label>
          <input
            type="text"
            className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
            value={data?.supplier}
            readOnly
          />
        </div>
      )}

      <div className="flex flex-col">
        <label className="text-lg font-semibold mb-1">Curriculum</label>
        <input
          type="text"
          className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
          value={data?.curriculumName}
          readOnly
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-semibold mb-1">Trainee No</label>
        <input
          type="text"
          className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
          value={listTrainee?.length}
          readOnly
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-semibold mb-1">Generation</label>
        <input
          type="text"
          className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
          value={data?.generationName}
          readOnly
        />
      </div>

      <div className="flex flex-col">
        <label className="text-lg font-semibold mb-1">Description</label>
        <input
          type="textarea"
          className="w-full h-10 px-3 border border-gray-300 rounded bg-gray-100 cursor-auto"
          value={data?.descriptions}
          readOnly
        />
      </div>
    </div>
  );
};

export default ClassInfo;
