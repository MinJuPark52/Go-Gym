"use client";
import PostList from "@/components/Post/PostList";
import Slider from "@/components/UI/Slider";

export default function HomePage() {
  return (
    <>
      <Slider />
      <div className="m-auto w-[80%]">
        <p className="ml-8 mt-20 text-4xl">가장 인기있는 게시물</p>
        <div className="mb-20 mt-8 flex min-h-96 w-[100%] overflow-x-auto p-12">
          <PostList />
        </div>
      </div>
    </>
  );
}
