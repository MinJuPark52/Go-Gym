"use client";

import { useQuery } from "@tanstack/react-query";
import PostItem from "./PostItem";
import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

interface PostType {
  amount: number;
  authorNickname: string;
  createdAt: string;
  gymName: string;
  id: string;
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
    <div className={`mb-12 flex w-full min-w-[750px] gap-8 ${style}`}>
      {
        data
          ? data.map((post: PostType) => <PostItem key={post.id} {...post} />)
          : ""
        // : defaultData.map((post: PostType) => (
        //     <PostItem key={post.id} {...post} />
        //   ))}
      }
    </div>
  );
}
