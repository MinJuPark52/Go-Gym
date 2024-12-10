"use client";

import Link from "next/link";
import Filter from "./Filter";
import PostList from "./PostList";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { useRouter, useSearchParams } from "next/navigation";

interface categoryStateType {
  postType: "default" | "SELL" | "BUY";
  postStatus:
    | "default"
    | "POSTING"
    | "SALE_COMPLETED"
    | "PURCHASE_COMPLETED"
    | "HIDDEN";
  membershipType:
    | "default"
    | "MEMBERSHIP_ONLY"
    | "MEMBERSHIP_WITH_PT"
    | "PT_ONLY";
  membershipDuration: "default" | "months_0_3" | "months_3_6" | "months_6_plus";
  PTCount: "default" | "PT_0_10" | "PT_10_25" | "PT_25_plus";
}

export default function PostListContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filter, setFilter] = useState<categoryStateType>({
    postType:
      (searchParams.get("postType") as categoryStateType["postType"]) ||
      "default",
    postStatus:
      (searchParams.get("postStatus") as categoryStateType["postStatus"]) ||
      "default",
    membershipType:
      (searchParams.get(
        "membershipType"
      ) as categoryStateType["membershipType"]) || "default",
    membershipDuration:
      (searchParams.get(
        "membershipDuration"
      ) as categoryStateType["membershipDuration"]) || "default",
    PTCount:
      (searchParams.get("PTCount") as categoryStateType["PTCount"]) ||
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
  // useQuery({
  //   queryKey: ['filterPost', url],
  //   queryFn: async() => (await axiosInstance.get(`/backend/api/filter?${query}`)).data,
  //   staleTime: 10000,
  // })

  return (
    <div className="flex flex-col mt-12 w-[70%]">
      <div className="flex justify-between items-center">
        <p className="mb-12 text-2xl font-bold">양도 회원권</p>
        <Link href={"/community/editpost"}>
          <button className="btn btn-inf0 bg-blue-300 hover:bg-blue-500 text-white">
            글쓰기
          </button>
        </Link>
      </div>
      <div className="mb-12">
        <Filter onChangeFilter={handleFilterUrl} filter={filter} />
      </div>
      <PostList style="w-[100%] flex-wrap justify-center" />
    </div>
  );
}
