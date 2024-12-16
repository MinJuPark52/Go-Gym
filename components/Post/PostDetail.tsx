"use client";
import { FaHeart } from "react-icons/fa";
import DOMpurify from "dompurify";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import PostDetailImage from "./PostDetailImage";
import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/api/axiosInstance";

interface PostType {
  postId: string;
  authorNickname: string;
  authorId: number;
  amount: string;
  createdAt: string;
  gymName: string;
  imageUrl1: string;
  postType: string;
  expirationDate: string;
  status: string;
  title: string;
  wishCount: number;
  content: string;
  imageUrl: string;
}

export default function PostDetail() {
  const [visibleModal, setVisibleModal] = useState({
    image: false,
    user: false,
  });
  const { id } = useParams();
  const router = useRouter();

  const { data: detail } = useQuery({
    queryKey: ["postDetail", id],
    queryFn: async () => {
      const response: PostType = await axiosInstance.get(
        `/api/posts/details/${id}`,
      );
      return response;
    },
    staleTime: 1000,
  });

  useEffect(() => {
    console.log(detail);
  }, [detail]);

  const { mutate } = useMutation({
    mutationKey: ["AddChatRoom"],
    mutationFn: async () => await axiosInstance.post(`/api/chatroom/${id}`),
    onSuccess: () => router.push("/chat"),
    onError: () => alert("채팅방 생성이 실패했습니다."),
  });

  let statusBox = "게시중";
  if (detail && detail.status === "POSTING") {
    statusBox = "게시중";
  } else if (detail && detail.status === "SALE_COMPLETED") {
    statusBox = "판매 완료";
  } else if (detail && detail.status === "PURCHASE_COMPLETED") {
    statusBox = "구매 완료";
  }

  return (
    <>
      {detail && (
        <div className="flex w-[70%] flex-col">
          <div className="mb-6 border-b border-gray-400">
            <div className="mb-2 ml-2 mr-2 mt-12">
              <div className="flex justify-between">
                <p className="text-2xl font-bold">{detail.title}</p>
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
                작성일 : {detail.createdAt}
              </p>
            </div>
          </div>
          <div className="mb-4 flex flex-col gap-4 border-b border-gray-400 p-4 pt-0">
            <div className="flex justify-between">
              <p className="font-bold">
                <span className="text-gray-500">게시글 종류 : </span>
                {detail.postType === "SELL" ? "팝니다" : "삽니다"}
              </p>
              <p className="font-bold">
                <span className="text-gray-500">작성자 : </span>

                <Link href={`/community/${id}/userdetail`}>
                  <button className="btn btn-active p-2">
                    {detail.authorNickname}
                  </button>
                </Link>
              </p>
            </div>
            <p className="font-bold">
              <span className="text-gray-500">헬스장 : </span>
              {detail.gymName}
            </p>
            <div className="flex justify-between">
              <p className="font-bold">
                <span className="text-gray-500">회원권 마감일 : </span>
                {detail.expirationDate}
              </p>
              <p className="font-bold">
                <span className="text-gray-500">가격 : </span>
                {formatNumber(detail.amount)} {"원"}
              </p>
            </div>
          </div>
          <div className="relative min-h-[360px] border-b border-gray-400 p-4">
            <div
              className="overflow-hidden whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: DOMpurify.sanitize(detail.content),
              }}
            />
            <div className="absolute bottom-2 right-2 flex cursor-pointer items-center gap-1">
              <span className="text-sm font-bold text-gray-400">찜</span>
              <FaHeart color="#DC7D7D" size={24} />
            </div>
          </div>

          <div className="relative flex min-h-40 p-4">
            <Link
              href={{
                pathname: `/community/${id}/imagedetail`,
                query: { imageUrl: detail.imageUrl },
              }}
            >
              <PostDetailImage imageUrl={detail.imageUrl1} />
            </Link>
            <button
              onClick={() => mutate()}
              className="btn absolute bottom-4 right-4 bg-blue-300 p-1 pl-2 pr-2 text-white transition-all hover:bg-blue-500"
            >
              채팅하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const formatNumber = (input: string) => {
  const numericValue = input.replace(/,/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
