"use client";
import { FaHeart } from "react-icons/fa";
import { CgCloseO } from "react-icons/cg";
import DOMpurify from "dompurify";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import PostDetailImage from "./PostDetailImage";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PostList from "./PostList";
import PostUserDetail from "./PostUserDetail";
import axiosInstance from "@/api/axiosInstance";

export default function PostDetail() {
  const [visibleModal, setVisibleModal] = useState({
    image: false,
    user: false,
  });
  const { id } = useParams();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["postDetail"],
    queryFn: async () =>
      (await axios.get(`http://localhost:4000/postDetails/${id}`)).data,
    staleTime: 1000,
  });

  const { mutate } = useMutation({
    mutationKey: ["AddChatRoom"],
    mutationFn: async () => await axiosInstance.post(`/api/chatroom/${id}`),
    onSuccess: () => router.push("/chat"),
    onError: () => alert("채팅방 생성이 실패했습니다."),
  });

  const handleImageClick = () => {
    setVisibleModal({
      ...visibleModal,
      image: !visibleModal.image,
    });
  };

  const handleUserClick = () => {
    setVisibleModal({
      ...visibleModal,
      user: !visibleModal.user,
    });
  };

  let statusBox = "게시중";

  if (data && data.postStatus === "PENDING") {
    statusBox = "게시중";
  } else if (data && data.postStatus === "IN_PROGRESS") {
    statusBox = "거래 중";
  } else if (data && data.postStatus === "COMPLETED") {
    statusBox = "거래 완료";
  }

  return (
    <>
      {data && (
        <div className="flex w-[70%] flex-col">
          <div className="mb-6 border-b border-gray-400">
            <div className="mb-2 ml-2 mr-2 mt-12">
              <div className="flex justify-between">
                <p className="text-2xl font-bold">{data.title}</p>
                <Link href={`/community/modifiedpost/${id}`}>
                  <button className="btn bg-blue-300 text-white hover:bg-blue-500">
                    수정하기
                  </button>
                </Link>
              </div>
              <div className="badge border-none bg-blue-300 pb-3 pt-3 text-sm font-bold text-white">
                {statusBox}
              </div>
              <p className="text-right text-sm font-bold text-gray-500">
                작성일 : {data.createdAt}
              </p>
            </div>
          </div>
          <div className="mb-4 flex flex-col gap-4 border-b border-gray-400 p-4 pt-0">
            <div className="flex justify-between">
              <p className="font-bold">
                <span className="text-gray-500">게시글 종류 : </span>
                {data.postType === "SELL" ? "팝니다" : "삽니다"}
              </p>
              <p className="font-bold">
                <span className="text-gray-500">작성자 : </span>

                <button
                  className="btn btn-active p-2"
                  onClick={handleUserClick}
                >
                  {data.authorNickname}
                </button>
              </p>
            </div>
            <p className="font-bold">
              <span className="text-gray-500">헬스장 : </span>
              {data.gymName}
            </p>
            <div className="flex justify-between">
              <p className="font-bold">
                <span className="text-gray-500">회원권 마감일 : </span>
                {data.expirationDate}
              </p>
              <p className="font-bold">
                <span className="text-gray-500">가격 : </span>
                {data.amount} {"원"}
              </p>
            </div>
          </div>
          <div className="relative min-h-[360px] border-b border-gray-400 p-4">
            <div
              className="overflow-hidden whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: DOMpurify.sanitize(data.content),
              }}
            />
            <div className="absolute bottom-2 right-2 flex cursor-pointer items-center gap-1">
              <span className="text-sm font-bold text-gray-400">찜</span>
              <FaHeart color="#DC7D7D" size={24} />
            </div>
          </div>

          <div className="relative flex min-h-40 p-4">
            <PostDetailImage
              imageUrl={data.imageUrl1}
              onClick={handleImageClick}
            />
            <button
              onClick={() => mutate()}
              className="btn absolute bottom-4 right-4 bg-blue-300 p-1 pl-2 pr-2 text-white transition-all hover:bg-blue-500"
            >
              채팅하기
            </button>
          </div>
        </div>
      )}
      {visibleModal.user && <PostUserDetail onUserClick={handleUserClick} />}
      {data && visibleModal.image && (
        <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center bg-gray-600 bg-opacity-30">
          <div className="flex w-[70%] max-w-[1100px] animate-slide-down items-center justify-between">
            <p className="text-xl font-bold text-white">사진 크게보기</p>
            <CgCloseO
              size={48}
              color="#545454"
              className="translate-x-12 cursor-pointer"
              onClick={handleImageClick}
            />
          </div>
          <div className="relative h-[60%] w-[70%] max-w-[1100px] animate-slide-down overflow-hidden rounded-lg bg-white">
            <Image src={data.imageUrl1} alt="이미지" layout="fill" />
          </div>
        </div>
      )}
    </>
  );
}
