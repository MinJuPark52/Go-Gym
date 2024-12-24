"use client";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import DOMpurify from "dompurify";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import PostDetailImage from "./PostDetailImage";
import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/api/axiosInstance";
import useLoginStore from "@/store/useLoginStore";
import useUserStore from "@/store/useUserStore";

interface PostType {
  postId: string;
  authorNickname: string;
  authorId: number;
  amount: string;
  createdAt: string;
  gymName: string;
  postType: string;
  expirationDate: string;
  status: string;
  remainingSessions: string;
  title: string;
  wishCount: number;
  isWished: boolean;
  content: string;
  imageUrl1: string;
  imageUrl2: string;
  imageUrl3: string;
  membershipType: string;
}

export default function PostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const { loginState } = useLoginStore();

  //queryKey 상태 관리
  const [queryKeySuffix, setQueryKeySuffix] = useState(0);

  const { data: detail } = useQuery({
    queryKey: ["postDetail", id, queryKeySuffix],
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

  const { mutate: wish } = useMutation({
    mutationKey: ["wish"],
    mutationFn: async () => await axiosInstance.post(`/api/posts/${id}/wishes`),
    onSuccess: () => setQueryKeySuffix((prev) => prev + 1),
    onError: () => alert("찜 실패."),
  });

  const { mutate: deletePost } = useMutation({
    mutationKey: ["delete"],
    mutationFn: async () =>
      await axiosInstance.put(`/api/posts/${id}`, {
        title: detail?.title,
        content: detail?.content,
        expirationDate: detail?.expirationDate,
        remainingSessions: detail?.remainingSessions,
        amount: detail?.amount,
        imageUrl1: detail?.imageUrl1,
        imageUrl2: detail?.imageUrl2,
        imageUrl3: detail?.imageUrl3,
        postType: detail?.postType,
        status: "HIDDEN",
        membershipType: detail?.membershipType,
      }),
    onSuccess: () => router.push("/community"),
    onError: () => alert("삭제 실패."),
  });

  const handleWishClick = () => {
    if (loginState) {
      try {
        wish();
      } catch (e) {
        console.log(e);
      }
    } else {
      const wishConfirm = confirm(
        "로그인을 해야합니다. 로그인 페이지로 이동하시겠습니까?",
      );
      if (wishConfirm) {
        router.push("/login");
      }
    }
  };

  let statusBox = "게시중";
  if (detail && detail.status === "PENDING") {
    statusBox = "게시중";
  } else if (detail && detail.status === "IN_PROGRESS") {
    statusBox = "거래중";
  } else if (detail && detail.status === "COMPLETED") {
    statusBox = "거래완료";
  }

  let postType = "팝니다";
  if (detail && detail.postType === "SELL") {
    postType = "팝니다";
  } else if (detail && detail.postType === "BUY") {
    postType = "삽니다";
  }

  return (
    <>
      {detail && (
        <div className="flex w-[70%] flex-col">
          <div className="mb-6 border-b border-gray-400">
            <div className="mb-2 ml-2 mr-2 mt-12">
              <div className="flex justify-between">
                <p className="text-2xl font-bold">{detail.title}</p>
                {user?.nickname === detail.authorNickname && (
                  <div className="flex flex-col gap-2">
                    <Link href={`/community/modifiedpost/${id}`}>
                      <button className="btn w-full bg-blue-500 text-white hover:bg-blue-600">
                        수정
                      </button>
                    </Link>
                    <button
                      onClick={() => deletePost()}
                      className="btn bg-red-500 text-white hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <div className="badge border-none bg-blue-500 pb-3 pt-3 text-sm font-bold text-white">
                {statusBox}
              </div>
              <div className="badge ml-2 border-none bg-green-500 pb-3 pt-3 text-sm font-bold text-white">
                {postType}
              </div>
              <p className="text-right text-sm font-bold text-gray-500">
                작성일 : {detail.createdAt.slice(0, 16).replace("T", " ")}
              </p>
            </div>
          </div>
          <div className="mb-4 flex flex-col gap-4 border-b border-gray-400 p-4 pt-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold sm:text-base">
                <span className="text-gray-500">게시글 종류 : </span>
                {detail.postType === "SELL" ? "팝니다" : "삽니다"}
              </p>
              <p className="text-xs font-bold sm:text-base">
                <span className="text-gray-500">작성자 : </span>

                {/* <Link href={`/community/${id}/userdetail`}> */}
                <span className="h-2 p-2 text-xs sm:text-base">
                  {detail.authorNickname}
                </span>
              </p>
            </div>
            <p className="text-xs font-bold sm:text-base">
              <span className="text-gray-500">헬스장 : </span>
              {detail.gymName}
            </p>
            <div className="flex justify-between">
              <p className="text-xs font-bold sm:text-base">
                <span className="text-gray-500">회원권 마감일 : </span>
                {detail.expirationDate}
              </p>
              <p className="text-xs font-bold sm:text-base">
                <span className="text-gray-500">가격 : </span>
                {formatNumber(detail.amount.toString())} {"원"}
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
              <button onClick={handleWishClick}>
                {detail.isWished ? (
                  <FaHeart color="#DC7D7D" size={24} />
                ) : (
                  <FaRegHeart color="#DC7D7D" size={24} />
                )}
              </button>
              <span className="text-sm font-bold text-gray-400">
                {detail.wishCount}
              </span>
            </div>
          </div>

          <div className="relative flex min-h-40 gap-4 p-4">
            {detail.imageUrl1 && (
              <Link
                href={{
                  pathname: `/community/${id}/imagedetail`,
                  query: { imageUrl: detail.imageUrl1 },
                }}
              >
                <PostDetailImage imageUrl={detail.imageUrl1} />
              </Link>
            )}
            {detail.imageUrl2 && (
              <Link
                href={{
                  pathname: `/community/${id}/imagedetail`,
                  query: { imageUrl: detail.imageUrl3 },
                }}
              >
                <PostDetailImage imageUrl={detail.imageUrl2} />
              </Link>
            )}
            {detail.imageUrl3 && (
              <Link
                href={{
                  pathname: `/community/${id}/imagedetail`,
                  query: { imageUrl: detail.imageUrl3 },
                }}
              >
                <PostDetailImage imageUrl={detail.imageUrl3} />
              </Link>
            )}
            {loginState && user?.nickname !== detail.authorNickname && (
              <button
                onClick={() => mutate()}
                className="btn absolute bottom-4 right-4 bg-blue-500 p-1 pl-2 pr-2 text-white transition-all hover:bg-blue-600"
              >
                채팅하기
              </button>
            )}
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
