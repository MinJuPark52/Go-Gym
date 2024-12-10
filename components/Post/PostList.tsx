"use client";

import { useQuery } from "@tanstack/react-query";
import PostItem from "./PostItem";
import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

interface PostType {
  amount: number;
  authorNickName: string;
  created_at: string;
  gymName: string;
  id: string;
  imageUrl1: string;
  postStatus: string;
  title: string;
  wishCount: number;
}

export default function PostList({
  url,
  style,
}: {
  url?: string;
  style?: string;
}) {
  const { data } = useQuery({
    queryKey: ["post"],
    queryFn: async () =>
      // (await axiosInstance.get('url?page=0&size=10')).data, 백엔드 연동시 사용
      (await axios.get("http://localhost:4000/posts")).data,
    staleTime: 1000 * 10,
  });

  return (
    <div className={`mb-12 flex w-full min-w-[750px] gap-8 ${style}`}>
      {data &&
        data.map((post: PostType) => <PostItem key={post.id} {...post} />)}
    </div>
  );
}
