"use client";
import MainPagePostContainer from "@/components/Post/MainPagePostContainer";
import Slider from "@/components/UI/Slider";

export default function HomePage() {
  return (
    <>
      <Slider />
      <div className="m-auto w-[80%]">
        <p className="ml-8 mt-20 text-4xl">가장 인기있는 게시물</p>
        <div className="mb-20 mt-8 flex min-h-96 w-[100%] gap-4 overflow-x-auto p-12 lg:grid lg:grid-cols-2 lg:justify-items-center 2xl:grid-cols-3">
          <MainPagePostContainer />
        </div>
      </div>
    </>
  );
}
