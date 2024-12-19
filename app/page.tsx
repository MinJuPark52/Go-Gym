"use client";
import MainPagePostContainer from "@/components/Post/MainPagePostContainer";
import Slider from "@/components/UI/Slider";

export default function HomePage() {
  return (
    <>
      <Slider />
      <div className="m-auto w-[80%]">
        <p className="ml-8 mt-20 text-4xl">가장 인기있는 게시물</p>

        <MainPagePostContainer />
      </div>
    </>
  );
}
