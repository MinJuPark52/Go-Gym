"use client";

import Image from "next/image";
import profile from "../../public/default_profile.png";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Link from "next/link";

export default function ChangeProfile() {
  // const {} = useQuery({
  //   queryKey: ['user'],
  //   queryFn: async () => await axiosInstance.get('/api/members/me'),
  //   staleTime: 100000,
  // });

  return (
    <div className="mt-4 flex min-w-[640px] items-center rounded-md border-2 border-gray-400 p-8">
      <Image
        src={profile}
        alt="profile"
        width={120}
        height={120}
        className="cursor-pointer"
        priority
      />
      <div className="ml-8 flex flex-col gap-2">
        <p className="text-sm font-bold text-gray-600">이름: 전민혁</p>
        <p className="text-sm font-bold text-gray-600">닉네임: 헬린이</p>
        <p className="text-sm font-bold text-gray-600">
          이메일: example@example.com
        </p>
        <div className="flex items-center gap-4">
          <div className="flex w-fit rounded-lg bg-[#5AC800] bg-opacity-60 pb-1 pl-2 pr-2 pt-1">
            <p className="text-[11px] font-bold text-[#377008]">서울</p>
          </div>
        </div>
      </div>
      <Link href={"/mypage/changeProfile"} className="ml-auto">
        <button className="btn btn-info border-none bg-blue-300 text-white hover:bg-blue-500">
          프로필 수정
        </button>
      </Link>
    </div>
  );
}
