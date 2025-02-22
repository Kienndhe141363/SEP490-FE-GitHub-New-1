"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/UserStore";
import { UploadButton } from "@/app/utils/uploadthing";
import { BASE_API_URL } from "@/config/constant";
import { getJwtToken } from "@/lib/utils";
import toast from "react-hot-toast";
import SpinnerLoader from "../loading/SpinnerLoader";

const ViewProfileForm = () => {
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
  const [updateData, setUpdateData] = useState<any>({
    dateOfBirth: "",
    phone: "",
    address: "",
    emergencyPhone: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const setCurrentUser = useUserStore((state) => state.setUser);
  const setUserAvatarAction = useUserStore((state) => state.updateAvatar);
  const [loading, setLoading] = useState(false);
  const handleAvatarClick = () => {
    console.log("Clicking on avatar");
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true); // Bắt đầu loading

      const imageUrl = URL.createObjectURL(file); // Giữ lại dòng này nếu cần thiết

      const formData = new FormData();
      formData.append("file", file);

      axios
        .post(`${BASE_API_URL}/user/upload-avatar`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getJwtToken()}`,
          },
        })
        .then((response) => {
          setUserAvatarAction(response.data.message);
          toast.success("Upload Image Success!");
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        })
        .finally(() => {
          setLoading(false); // Kết thúc loading
        });
    }
  };
  const handleSave = async () => {
    try {
      setLoading(true); // Bắt đầu loading
      const response = await axios.post(
        `${BASE_API_URL}/user/update-profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${getJwtToken()}`,
          },
        }
      );
      console.log("Update Profile Response:", response.data);
      setProfileData({
        ...profileData,
        dateOfBirth: updateData.dateOfBirth,
        phone: updateData.phone,
        address: updateData.address,
        emergencyPhone: updateData.emergencyPhone,
      });
      setIsEdit(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorCode = error.response.data.errorCode;

        if (errorCode === "ERR058") {
          toast.error("Invalid phone format!");
        } else if (errorCode === "ERR0459") {
          toast.error("Check again you aren't 18+!");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token || token === "null" || token === "undefined") {
      router.push("/authen/login");
      return;
    }

     axios
      .get(`${BASE_API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("API Response:", response.data); // Kiểm tra response
        const { password, ...filteredData } = response.data;
        console.log("Filtered Data:", filteredData); // Kiểm tra dữ liệu được set
        setProfileData(response.data);
        setCurrentUser(filteredData);
        console.log("Current User:", currentUser);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        router.push("/authen/login");
      });
  }, [router]);

  return (
    <div className="flex-1 ml-[228px] bg-[#EFF5EB] p-24 min-h-screen">
      {loading && <SpinnerLoader />} {/* Hiển thị SpinnerLoader khi loading */}
      <div className="bg-white rounded-[40px] p-8 max-w-[1066px] mx-auto">
        <div className="flex gap-8">
          {/* Profile Image Section */}
          <div className="w-[296px] flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-[130px] h-[130px] rounded-full bg-[#E5E5E5] overflow-hidden">
                <img
                  src={currentUser?.imgAva || "/assets/icon/User-Avatar.png"}
                  alt=""
                  className="rounded-full object-cover w-full h-full"
                  onClick={handleAvatarClick}
                />
              </div>
              {/* <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  if (res.length > 0) {
                    setUserAvatarAction(res[0].appUrl);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.log(`ERROR! ${error.message}`);
                }}
              /> */}

              <button
                className="absolute bottom-0 right-0 w-[25px] h-[25px] bg-[#b4b1ac] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#a1e469] transition-colors"
                onClick={handleAvatarClick}
              >
                <span className="text-white text-xm ">📷</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <h3 className="font-bold text-xl mb-1">{profileData.account}</h3>
            <p className="text-[#6C757D]">{profileData.email}</p>
          </div>

          {/* Profile Information Section */}
          <div className="flex-1">
            <div className="border-b mb-8">
              <div className="flex gap-8 mb-[-2px]">
                <button className="px-4 py-2 font-bold text-[#41464B] border-b-4 border-[#6FBC44]">
                  User Profile
                </button>
                <button
                  onClick={() => {
                    router.push("/authen/change-password");
                  }}
                  className="px-4 py-2 font-bold text-[#41464B]"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="px-4">
              {/* <h2 className="text-2xl font-bold mb-8">Profile Information</h2> */}

              <table className="min-w-full ">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-black font-bold">
                      Full name
                    </td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {profileData.fullName}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-black font-bold">
                      Date of Birth
                    </td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {/* {profileData.dateOfBirth} */}
                      {isEdit ? (
                        <input
                          type="date"
                          className="border border-[#41464B] rounded-lg px-2 py-1"
                          value={updateData.dateOfBirth}
                          onChange={(e) =>
                            setUpdateData({
                              ...updateData,
                              dateOfBirth: e.target.value,
                            })
                          }
                        />
                      ) : (
                        profileData.dateOfBirth
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-black font-bold">
                      Phone Number
                    </td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {/* {profileData.phone} */}
                      {isEdit ? (
                        <input
                          type="text"
                          className="border border-[#41464B] rounded-lg px-2 py-1"
                          value={updateData.phone}
                          onChange={(e) =>
                            setUpdateData({
                              ...updateData,
                              phone: e.target.value,
                            })
                          }
                        />
                      ) : (
                        profileData.phone
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-black font-bold">Address</td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {/* {profileData.address} */}
                      {isEdit ? (
                        <input
                          type="text"
                          className="border border-[#41464B] rounded-lg px-2 py-1"
                          value={updateData.address}
                          onChange={(e) =>
                            setUpdateData({
                              ...updateData,
                              address: e.target.value,
                            })
                          }
                        />
                      ) : (
                        profileData.address
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 text-black font-bold">
                      Emergency Number
                    </td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {/* {profileData.emergencyPhone} */}
                      {isEdit ? (
                        <input
                          type="text"
                          className="border border-[#41464B] rounded-lg px-2 py-1"
                          value={updateData.emergencyPhone}
                          onChange={(e) =>
                            setUpdateData({
                              ...updateData,
                              emergencyPhone: e.target.value,
                            })
                          }
                        />
                      ) : (
                        profileData.emergencyPhone
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-black font-bold">Role</td>
                    <td className="px-4 py-2 text-[#41464B]">
                      {profileData.roles}
                    </td>
                  </tr>
                </tbody>
              </table>

              {!isEdit ? (
                <div className="flex justify-end mt-8">
                  <Button
                    className="bg-[#6FBC44] text-white hover:bg-[#5da639] px-8 py-2 rounded-lg font-semibold shadow-md"
                    onClick={() => {
                      setIsEdit(!isEdit);
                      setUpdateData({
                        dateOfBirth: profileData.dateOfBirth,
                        phone: profileData.phone,
                        address: profileData.address,
                        emergencyPhone: profileData.emergencyPhone,
                      });
                    }}
                  >
                    Edit
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end mt-8 gap-4">
                  <Button
                    className="bg-[#bfc7bb] text-white hover:bg-[#c5cfc0] px-8 py-2 rounded-lg font-semibold shadow-md"
                    onClick={() => {
                      setIsEdit(!isEdit);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#6FBC44] text-white hover:bg-[#5da639] px-8 py-2 rounded-lg font-semibold shadow-md"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileForm;
