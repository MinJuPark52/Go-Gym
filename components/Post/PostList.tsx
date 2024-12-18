"use client";

import { useQuery } from "@tanstack/react-query";
import PostItem from "./PostItem";
import axiosInstance from "@/api/axiosInstance";
import axios from "axios";
import PostItemSkeleton from "../SkeletonUI/PostItemSkeleton";

interface PostType {
  amount: number;
  authorNickname: string;
  createdAt: string;
  gymName: string;
  postId: string;
  imageUrl1: string;
  status: string;
  title: string;
  wishCount: number;
}

export default function PostList({
  data,
  style,
}: {
  data?: PostType[];
  style?: string;
}) {
  // const { data: defaultData, isPending } = useQuery({
  //   queryKey: ["default"],
  //   queryFn: async () => (await axios.get("http://localhost:4000/posts")).data,
  //   staleTime: 10000,
  // });

  // console.log(defaultData);

  // if (!data && isPending) {
  //   return <p>데이터 로딩중...</p>;
  // }

  return (
    <div className="mb-20 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
      {data &&
        data.map((post: PostType) => <PostItem key={post.postId} {...post} />)}
    </div>
  );
}
