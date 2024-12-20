"use client";

import PostItem from "./PostItem";

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

export default function PostList({ data }: { data?: PostType[] }) {
  return (
    data &&
    data.map((post: PostType) => <PostItem key={post.postId} {...post} />)
  );
}
