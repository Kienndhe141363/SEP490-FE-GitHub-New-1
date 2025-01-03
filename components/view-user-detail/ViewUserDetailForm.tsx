// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation"; // Import useParams to access route params
// import axios from "axios";
// import moment from "moment";
// import { BASE_API_URL } from "@/config/constant";

// const ViewUserDetailForm: React.FC = () => {
//   const { id: userId } = useParams(); // Extract userId from the URL params
//   const [userDetail, setUserDetail] = useState<any>({
//     account: "",
//     fullName: "",
//     email: "",
//     dateOfBirth: "",
//     phone: "",
//     address: "",
//     emergencyPhone: "",
//     roles: "",
  
//   });
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("jwtToken");
//     if (!token) {
//       router.push("/authen/login");
//       return;
//     }

//     const fetchUserDetail = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/user/management/list/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setUserDetail(response.data);
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//         router.push("/authen/login");
//       }
//     };

//     if (userId) fetchUserDetail(); // Only fetch if userId is available
//   }, [userId, router]);

//   return (
//     <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-10 min-h-screen">
//       <div className="bg-white rounded-[40px] p-8 max-w-[1066px] mx-auto">
//         <div className=" border-[#CDCDCD] pb-6 mb-6">
//           <h1 className="text-4xl font-bold text-[#41464B] mb-2">User Detail</h1>
//         </div>
//         <table className="min-w-full ">
//   <tbody>
//     <tr className="">
//       <td className="px-4 py-2 font-bold text-[22px] text-[#41464B]">Account</td>
//       <td className="px-4 py-2 text-[22px] text-[#41464B]">{userDetail.account}</td>
//     </tr>
//     <tr className="">
//       <td className="px-4 py-2 font-bold text-[22px] text-[#41464B]">Email</td>
//       <td className="px-4 py-2 text-[22px] text-[#41464B]">{userDetail.email}</td>
//     </tr>
//     <tr className="">
//       <td className="px-4 py-2 font-bold text-[22px] text-[#41464B]">Full name</td>
//       <td className="px-4 py-2 text-[22px] text-[#41464B]">{userDetail.fullName}</td>
//     </tr>
//     <tr className="">
//       <td className="px-4 py-2 font-bold text-[22px] text-[#41464B]">Role</td>
//       <td className="px-4 py-2 text-[22px] text-[#41464B]">{userDetail.roles}</td>
//     </tr>
//     <tr className="">
//       <td className="px-4 py-2 font-bold text-[22px] text-[#41464B]">Date of Birth</td>
//       <td className="px-4 py-2 text-[22px] text-[#41464B]">{userDetail.dateOfBirth}</td>
//     </tr>
//     <tr className="">
//       <td className="px-4 py-2 font-bold text-[22px] text-[#41464B]">Address</td>
//       <td className="px-4 py-2 text-[22px] text-[#41464B]">{userDetail.address}</td>
//     </tr>
//     <tr className="">
//       <td className="px-4 py-2 font-bold text-[22px] text-[#41464B]">Phone Number</td>
//       <td className="px-4 py-2 text-[22px] text-[#41464B]">{userDetail.phone}</td>
//     </tr>
//     <tr>
//       <td className="px-4 py-2 font-bold text-[22px] text-[#41464B]">Emergency Number</td>
//       <td className="px-4 py-2 text-[22px] text-[#41464B]">{userDetail.emergencyPhone}</td>
//     </tr>
//   </tbody>
// </table>
        
//         <div className="flex gap-6">
//           <div className="flex justify-end mt-8">
//             <button type="button"
//               onClick={() => router.back()}
//               className="text-black bg-[#D5DCD0] font-bold shadow-md hover:shadow-lg hover:bg-gray-400 py-3 px-6 rounded">
//               Back
//             </button>
//           </div>
//           {/* <div className="flex justify-end mt-8">
//             <button className="bg-[#6FBC44] text-white px-6 py-2 rounded-lg opacity-70 hover:opacity-100 flex items-center gap-2">
//               <span className="text-lg">✏️</span>
//               Edit
//             </button>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewUserDetailForm;


"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { BASE_API_URL } from "@/config/constant";
import SpinnerLoader from "../loading/SpinnerLoader";

const ViewUserDetailForm: React.FC = () => {
  const { id: userId } = useParams();
  const [userDetail, setUserDetail] = useState<any>({
    account: "",
    fullName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    emergencyPhone: "",
    roles: "",
  });
  const [loading, setLoading] = useState<boolean>(true); // Bắt đầu với loading là true
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/authen/login");
      return;
    }

    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(
          `${BASE_API_URL}/user/management/list/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetail(response.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        router.push("/authen/login");
      } finally {
        setLoading(false); // Kết thúc loading ở đây
      }
    };

    if (userId) fetchUserDetail();
  }, [userId, router]);

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-10 min-h-screen">
      {loading ? (
          <SpinnerLoader /> // Hiển thị SpinnerLoader khi loading
        ) : (
      <div className="bg-white rounded-[40px] p-8 max-w-[1066px] mx-auto">
        <div className=" border-b border-[#CDCDCD] pb-6 mb-6">
          <h1 className="text-4xl font-bold  mb-2">User Detail</h1>
        </div>

        
        <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold ">Account</label>
              <input type="text" value={userDetail.account} readOnly className="text-lg  bg-gray-200 border-none rounded-md w-full py-2 px-3" />
            </div>
            <div>
              <label className="block text-lg font-semibold ">Email</label>
              <input type="text" value={userDetail.email} readOnly className="text-lg  bg-gray-200 border-none rounded-md w-full py-2 px-3" />
            </div>
            <div>
              <label className="block text-lg font-semibold ">Full Name</label>
              <input type="text" value={userDetail.fullName} readOnly className="text-lg  bg-gray-200 border-none rounded-md w-full py-2 px-3" />
            </div>
            <div>
              <label className="block text-lg font-semibold ">Role</label>
              <input type="text" value={userDetail.roles} readOnly className="text-lg  bg-gray-200 border-none rounded-md w-full py-2 px-3" />
            </div>
            <div>
              <label className="block text-lg font-semibold ">Date of Birth</label>
              <input type="text" value={userDetail.dateOfBirth} readOnly className="text-lg  bg-gray-200 border-none rounded-md w-full py-2 px-3" />
            </div>
            <div>
              <label className="block text-lg font-semibold ">Address</label>
              <input type="text" value={userDetail.address} readOnly className="text-lg  bg-gray-200 border-none rounded-md w-full py-2 px-3" />
            </div>
            <div>
              <label className="block text-lg font-semibold ">Phone Number</label>
              <input type="text" value={userDetail.phone} readOnly className="text-lg  bg-gray-200 border-none rounded-md w-full py-2 px-3" />
            </div>
            <div>
              <label className="block text-lg font-semibold ">Emergency Number</label>
              <input type="text" value={userDetail.emergencyPhone} readOnly className="text-lg  bg-gray-200 border-none rounded-md w-full py-2 px-3" />
            </div>
          </div>
        

        <div className="flex gap-6">
          <div className="flex justify-end mt-8">
            <button type="button"
              onClick={() => router.back()}
              className="text-black bg-[#D5DCD0] font-bold shadow-md hover:shadow-lg hover:bg-gray-400 py-3 px-6 rounded">
              Back
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ViewUserDetailForm;