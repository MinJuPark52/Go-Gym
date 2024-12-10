"use client";

import { useParams } from "next/navigation";
import PostList from "../Post/PostList";
import useLoginStore from "@/store/useLoginStore";
import { useEffect } from "react";

export default function ManageUserDetail() {
  const { adminLogin } = useLoginStore();
  const params = useParams();

  const userId = params?.userId as string;

  useEffect(() => {
    adminLogin();
  }, []);

  return (
    <div className="ml-72 mt-12 flex flex-col items-center justify-center">
      <h2 className="mb-12 text-3xl font-bold">
        {decodeURIComponent(userId)}의 게시글
      </h2>
      <div className="overflow-x-auto">
        <PostList />
      </div>
    </div>
  );
}
