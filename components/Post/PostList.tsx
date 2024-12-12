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
  data,
  style,
}: {
  data: PostType[];
  style?: string;
}) {
  return (
    <div className={`mb-12 flex w-full min-w-[750px] gap-8 ${style}`}>
      {data &&
        data.map((post: PostType) => <PostItem key={post.id} {...post} />)}
    </div>
  );
}
