"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";
import { useEffect } from "react";
import useUserStore from "@/store/useUserStore";
import axiosInstance from "@/api/axiosInstance";
import useLoginStore from "@/store/useLoginStore";
import ProfileImage from "../UI/ProfileImage";
import DefaultProfile from "../UI/DefaultProfile";

export default function Profile() {
  const { InitUser, user } = useUserStore();
  const { logout } = useLoginStore();
  const { data: userData, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axiosInstance.get("/api/members/me/profile");
      return response;
    },
    staleTime: 0,
  });

  const { mutate: deleteUser } = useMutation({
    mutationKey: ["deleteuser"],
    mutationFn: async () => await axiosInstance.put(`/api/members/me/withdraw`),
    onSuccess: () => {
      alert("탈퇴되었습니다.");
      logout();
    },
  });

  useEffect(() => {
    if (isSuccess && userData) {
      InitUser(userData);
    }
  }, [isSuccess, user, InitUser]);

  return (
    <div className="mt-4 flex flex-col items-center gap-8 rounded-md border-2 border-gray-400 p-8 md:flex-row md:gap-4">
      <div className="avatar h-32 w-32 overflow-hidden rounded-full">
        {user?.profileImageUrl ? (
          <ProfileImage src={user?.profileImageUrl} />
        ) : (
          <DefaultProfile width="120" />
        )}
      </div>
      <div className="ml-8 mr-auto flex flex-col gap-2 md:mr-12">
        <p className="text-sm font-bold text-gray-600">이름: {user?.name}</p>
        <p className="text-sm font-bold text-gray-600">
          닉네임: {user?.nickname}
        </p>
        <p className="text-sm font-bold text-gray-600">이메일: {user?.email}</p>
        <div className="flex items-center gap-4">
          {/* <div className="flex w-fit rounded-lg bg-[#5AC800] bg-opacity-60 pb-1 pl-2 pr-2 pt-1">
            <p className="text-[11px] font-bold text-[#377008]">
              {user?.interestArea1}
            </p>
          </div> */}
        </div>
      </div>
      <div className="ml-auto flex flex-col gap-2">
        <Link href={"/mypage/changeProfile"} className="ml-auto">
          <button className="btn btn-info border-none bg-blue-500 text-white hover:bg-blue-700">
            프로필 수정
          </button>
        </Link>
        <button
          onClick={() => deleteUser()}
          className="btn btn-active bg-red-500 text-white hover:bg-red-600"
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
}
