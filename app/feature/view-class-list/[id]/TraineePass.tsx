import SpinnerLoader from "@/components/loading/SpinnerLoader";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";

type Props = {
  id: any;
};

const TraineePass = ({ id }: Props) => {
  const [traineePass, setTraineePass] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTraineePass = async (page: number = 1) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_API_URL}/grade-management/search-trainee-pass`,
        {
          page: page - 1, // Pagination (0-indexed)
          size: 10,
          keyword: searchTerm,
          classId: id,
        },
        {
          headers: { Authorization: `Bearer ${getJwtToken()}` },
        }
      );
      const res = response?.data?.data;
      setTraineePass(res?.dataSource);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTraineePass(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
    <div>
      {loading ? (
        <SpinnerLoader /> // Hiển thị SpinnerLoader khi loading
      ) : (
        <>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-6xl font-bold">List Trainee Pass</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search..."
                className="border px-3 py-1 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setCurrentPage(1);
                    fetchTraineePass(currentPage);
                  }
                }}
              />
              <button
                onClick={() => {
                  setCurrentPage(1);
                  fetchTraineePass(currentPage);
                }}
                className="bg-[#6FBC44] text-white font-bold py-2 px-4 rounded shadow-md hover:shadow-lg hover:bg-[#5da639]"
              >
                Search
              </button>
            </div>
          </div>

          <table className="w-full mt-6 table-auto border-collapse rounded overflow-hidden">
            <thead>
              <tr className="bg-[#6FBC44] text-white ">
                <th className="px-4 py-3 border text-center">#</th>
                <th className="px-4 py-3 border text-center">Full Name</th>
                <th className="px-4 py-3 border text-center">Grade</th>
                <th className="px-4 py-3 border text-center">Ranking</th>
              </tr>
            </thead>
            <tbody>
              {traineePass.map((classItem, index) => (
                <tr
                  key={classItem.classId}
                  //   className={!classItem.status ? "bg-gray-200" : ""}
                >
                  <td className="border px-6 py-3 text-center">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>

                  {/* Class Code */}
                  <td className="px-6 py-3 border text-left">
                    {classItem.fullName}
                  </td>

                  {/* Class Admin */}
                  <td className="px-6 py-3 border text-center">
                    {classItem.grade}
                  </td>

                  {/* Class Admin */}
                  <td className="px-6 py-3 border text-center">
                    {classItem.ranking}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </>
      )}
    </div>
  );
};

export default TraineePass;
