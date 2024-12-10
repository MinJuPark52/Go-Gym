"use client";

import { CgCloseO } from "react-icons/cg";
import PostList from "./PostList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import profile from "../../public/default_profile.png";
import Image from "next/image";

export default function PostUserDetail({
  onUserClick,
}: {
  onUserClick: () => void;
}) {
  const { data, isPending } = useQuery({
    queryKey: ["postDetailUser"],
    queryFn: async () =>
      (await axios.get("http://localhost:4000/userDetail/1")).data,
    staleTime: 100000,
  });

  if (isPending) {
    return <p>데이터 로딩중...</p>;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center bg-gray-600 bg-opacity-30">
      <div className="] flex w-[70%] max-w-[1100px] animate-slide-down items-center justify-end">
        <CgCloseO
          size={48}
          color="#545454"
          className="translate-x-12 cursor-pointer"
          onClick={onUserClick}
        />
      </div>
      <div className="relative h-[60%] w-[70%] min-w-[900px] max-w-[1100px] animate-slide-down overflow-hidden overflow-y-auto rounded-lg bg-white">
        <div className="m-8 flex items-center gap-4">
          <Image
            src={profile}
            alt="profile"
            width={80}
            className="cursor-pointer"
            priority
          />
          <p className="text-2xl text-gray-600">
            {data.nickname}님의 다른 게시글
          </p>
        </div>
        <div className="m-4 overflow-x-auto">
          <PostList />
        </div>
      </div>
    </div>
  );
}
