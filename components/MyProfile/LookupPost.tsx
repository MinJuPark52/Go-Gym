"use client";

import { useParams } from "next/navigation";
import PostList from "../Post/PostList";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "@/store/useUserStore";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import PostItemSkeleton from "../SkeletonUI/PostItemSkeleton";
import Pagenation from "../UI/Pagination";

export default function LookupPost() {
  const { category } = useParams();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { user } = useUserStore();

  useEffect(() => {
    if (category === "my-posts") {
      setTitle("내가 작성한 게시글");
      setUrl(`/api/members/me/posts`);
    } else if (category === "wishlist") {
      setTitle("내가 찜한 게시글");
      setUrl(`/api/members/me/wishlist`);
    } else if (category === "recent-view") {
      setTitle("최근 본 게시글");
      setUrl(`/api/members/me/recent-views`);
    } else if (category === "purchaselist") {
      setTitle("구매 목록");
      setUrl(`/api/members/me/transactions/buy`);
    } else if (category === "salelist") {
      setTitle("판매 목록");
      setUrl(`/api/members/me/transactions/sell`);
    }
  }, [category]);

  useEffect(() => {
    setCurrentPage(0);
  }, [category]);

  const { data, isPending } = useQuery({
    queryKey: ["post", user, url, currentPage],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axiosInstance.get(
        `${url}?page=${currentPage}&size=5`,
      );
      return response;
    },
    enabled: !!url,
  });

  if (isPending) {
    <div className="mt-8 flex flex-col gap-16">
      <h1 className="text-3xl">{title}</h1>
      <div className="mb-20 mt-8 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
        {[...Array(6).keys()].map((idx) => (
          <PostItemSkeleton key={idx} />
        ))}
      </div>
    </div>;
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(+event.target.value); // 상태 업데이트

    console.log(currentPage);
  };

  return (
    <div className="mt-8 flex flex-col gap-16">
      <h1 className="text-3xl">{title}</h1>
      <div className="mb-20 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
        {data && <PostList data={data.content} />}
      </div>
      {data && (
        <Pagenation
          size={3}
          page={currentPage}
          onRadioChange={handleRadioChange}
          totalPage={+data.totalPages}
        />
      )}
    </div>
  );
}
