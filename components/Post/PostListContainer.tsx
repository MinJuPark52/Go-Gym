"use client";

import Link from "next/link";
import Filter from "./Filter";
import PostList from "./PostList";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { useRouter, useSearchParams } from "next/navigation";
import useLoginStore from "@/store/useLoginStore";
import PostItemSkeleton from "../SkeletonUI/PostItemSkeleton";
import Pagenation from "../UI/Pagination";
import useUserStore from "@/store/useUserStore";

interface categoryStateType {
  ["post-type"]: "default" | "SELL" | "BUY";
  status: "default" | "PENDING" | "IN_PROGRESS" | "COMPLETED" | "HIDDEN";
  ["membership-type"]:
    | "default"
    | "MEMBERSHIP_ONLY"
    | "MEMBERSHIP_WITH_PT"
    | "PT_ONLY";
  ["month-type"]: "default" | "MONTHS_0_3" | "MONTHS_3_6" | "MONTHS_6_PLUS";
  ["pt-type"]: "default" | "PT_0_10" | "PT_10_25" | "PT_25_PLUS";
}

export default function PostListContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, loginState } = useLoginStore();
  const { user } = useUserStore();

  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<categoryStateType>({
    ["post-type"]:
      (searchParams.get("post-type") as categoryStateType["post-type"]) ||
      "default",
    status:
      (searchParams.get("status") as categoryStateType["status"]) || "default",
    ["membership-type"]:
      (searchParams.get(
        "membership-type",
      ) as categoryStateType["membership-type"]) || "default",
    ["month-type"]:
      (searchParams.get("month-type") as categoryStateType["month-type"]) ||
      "default",
    ["pt-type"]:
      (searchParams.get("pt-type") as categoryStateType["pt-type"]) ||
      "default",
  });
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(createQuery(filter));
  }, [filter]);

  const handleFilterUrl = (obj: categoryStateType) => {
    setFilter(obj);
  };

  const createQuery = (filter: categoryStateType) => {
    const params = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== "default") {
        params.append(key, value);
      }
    });

    router.push(`/community?${params.toString()}`);
    return params.toString();
  };

  //tanstack-query에서 캐싱해서 처리
  const { data } = useQuery({
    queryKey: ["filterPost", query, token],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axiosInstance.get(
        `/api/posts/filters?${query}?page=${page}&size=6`,
      );
      return response;
    },
    staleTime: 10000,
    enabled: !!query,
  });

  const {
    data: defaultData,
    error,
    isPending: defaultDataPending,
  } = useQuery({
    queryKey: ["defaultPost", page, loginState],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axiosInstance.get(
        `api/posts/views?page=${page}&size=6`,
      );
      return response;
    },
    staleTime: 0,
    enabled: !query, // query가 없을 때만 실행
  });

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(Number(event.target.value)); // 상태 업데이트
  };

  let content = <div></div>;

  if (defaultDataPending) {
    content = (
      <>
        <div className="mb-20 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
          {[...Array(6).keys()].map((idx) => (
            <PostItemSkeleton key={idx} />
          ))}
        </div>
      </>
    );
  }

  if (query !== "" && data) {
    content = (
      <>
        <div className="mb-20 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
          <PostList data={data.content} />
        </div>
        {data && (
          <Pagenation
            size={3}
            page={page}
            onRadioChange={handleRadioChange}
            totalPage={+data.totalPages}
          />
        )}
      </>
    );
  } else if (query === "" && defaultData) {
    content = (
      <>
        <div className="mb-20 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
          <PostList data={defaultData.content} />
        </div>
        {data && (
          <Pagenation
            size={3}
            page={page}
            onRadioChange={handleRadioChange}
            totalPage={+defaultData.totalPages}
          />
        )}
      </>
    );
  }

  if (error) {
    content = <p>게시물 없습니다.</p>;
  }

  return (
    <div className="mt-12 flex w-[70%] flex-col">
      <div className="flex items-center justify-between">
        <div className="mb-12 flex flex-col gap-4">
          <p className="text-2xl font-bold">양도 회원권</p>
          <div className="flex gap-4">
            {user.regionName1 && (
              <div className="badge border-none bg-blue-500 pb-3 pt-3 text-sm font-bold text-white">
                {user.regionName1}
              </div>
            )}
            {user.regionName2 && (
              <div className="badge border-none bg-blue-500 pb-3 pt-3 text-sm font-bold text-white">
                {user.regionName2}
              </div>
            )}
          </div>
        </div>
        {loginState && (
          <Link href={"/community/editpost"}>
            <button className="btn-inf0 btn bg-blue-500 text-white hover:bg-blue-700">
              글쓰기
            </button>
          </Link>
        )}
      </div>
      <div className="mb-12">
        <Filter onChangeFilter={handleFilterUrl} filter={filter} />
      </div>

      {content}
    </div>
  );
}
