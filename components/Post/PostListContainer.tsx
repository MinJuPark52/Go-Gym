"use client";

import Link from "next/link";
import Filter from "./Filter";
import PostList from "./PostList";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import { useRouter, useSearchParams } from "next/navigation";
import useLoginStore from "@/store/useLoginStore";

interface categoryStateType {
  ["post-type"]: "default" | "SELL" | "BUY";
  status:
    | "default"
    | "POSTING"
    | "SALE_COMPLETED"
    | "PURCHASE_COMPLETED"
    | "HIDDEN";
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
  const { token } = useLoginStore();

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
    queryFn: async () => await axiosInstance.get(`/api/posts/filters?${query}`),
    staleTime: 10000,
    enabled: !!query,
  });

  const { data: defaultData, isLoading: isDefaultLoading } = useQuery({
    queryKey: ["defaultPost"],
    queryFn: async () =>
      await axiosInstance.get("/api/posts/views?page=0&size=10"),
    staleTime: 10000,
    enabled: !query, // query가 없을 때만 실행
  });

  useEffect(() => {
    console.log(defaultData);
    console.log(data);
  }, [data, defaultData]);

  return (
    <div className="mt-12 flex w-[70%] flex-col">
      <div className="flex items-center justify-between">
        <p className="mb-12 text-2xl font-bold">양도 회원권</p>
        <Link href={"/community/editpost"}>
          <button className="btn-inf0 btn bg-blue-300 text-white hover:bg-blue-500">
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
