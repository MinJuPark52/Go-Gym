"use client";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";

import Link from "next/link";
import useTimeAgo from "@/hooks/useTimeAgo";
import DefaultProfile from "../UI/DefaultProfile";
import ProfileImage from "../UI/ProfileImage";
import useUserStore from "@/store/useUserStore";

interface PostType {
  postId: string;
  authorNickname: string;
  createdAt: string;
  gymName: string;
  imageUrl1: string;
  status: string;
  title: string;
  wishCount: number;
}

export default function PostItem({
  postId,
  authorNickname,
  createdAt,
  gymName,
  imageUrl1,
  status,
  title,
  wishCount,
}: PostType) {
  const postStatusKo = status === "PENDING" && "게시중";
  const { user } = useUserStore();
  const timeago = useTimeAgo(createdAt);

  return (
    <Link href={`/community/${postId}`}>
      <div className="h-80 w-80 cursor-pointer rounded-lg border border-[#ccc] shadow">
        <div>
          <div className="m-2 flex justify-between">
            <div className="badge border-none bg-blue-500 pb-3 pt-3 text-sm font-bold text-white">
              {postStatusKo}
            </div>
            <p className="text-xs text-gray-500">{timeago}</p>
          </div>
          <div className="flex h-56 flex-col justify-between border-b border-[#ccc] pb-1">
            {imageUrl1 ? (
              <div className="relative flex h-[140px] items-center justify-center bg-gray-400 bg-opacity-50">
                <Image src={imageUrl1} alt="헬스장 사진" fill priority />
              </div>
            ) : (
              <div className="flex h-[140px] items-center justify-center bg-gray-400 bg-opacity-50">
                기본 이미지
              </div>
            )}

            <p className="ml-2">{title}</p>
            <div className="mr-2 flex flex-col items-end">
              <p className="text-sm font-bold text-gray-500">{gymName}</p>
            </div>
          </div>
        </div>
        <div className="ml-2 mr-2 mt-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <FaHeart color="#DC7D7D" />{" "}
              <span className="ml-1 text-sm font-normal text-gray-500">
                {wishCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
            <div className="avatar overflow-hidden rounded-full">
              {user?.profileImageUrl ? (
                <ProfileImage src={user?.profileImageUrl} />
              ) : (
                <DefaultProfile width="10" />
              )}
            </div>
            {authorNickname}
          </div>
        </div>
      </div>
    </Link>
  );
}
