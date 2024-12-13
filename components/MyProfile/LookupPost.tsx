"use client";

import { useParams } from "next/navigation";
import PostList from "../Post/PostList";

export default function LookupPost() {
  const { category } = useParams();

  const url = `/api/members/${category}`;
  let content = "";

  if (category === "my-posts") {
    content = "내가 작성한 게시글";
  } else if (category === "wishlist") {
    content = "내가 찜한 게시글";
  } else {
    content = "최근 본 게시글";
  }

  return (
    <div className="mt-8 flex flex-col gap-16">
      <h1 className="text-3xl">{content}</h1>
      <PostList style="flex-wrap" />
    </div>
  );
}
