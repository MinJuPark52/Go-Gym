"use client";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import thirdImg from "../../public/slider_5.jpg";
import secondImg from "../../public/slider_3.jpg";
import firstImg from "../../public/slider_1.jpg";

import Link from "next/link";
import Image from "next/image";

const Slider = () => {
  const items = [
    {
      name: "workout",
      title: "최고의 헬스장 멤버십 중고거래",
      text: "저렴한 가격으로 다양한 헬스장 멤버십을 거래하고, 더 나은 건강을 시작하세요.",
      img: firstImg,
    },
    {
      name: "workout",
      title: "다양한 선택지, 나에게 맞는 헬스장",
      text: "여러 헬스장 회원권을 비교하고, 나에게 가장 적합한 헬스장을 찾으세요.",
      img: secondImg,
    },
    {
      name: "workout",
      title: "디지털 시대의 스마트한 거래",
      text: "온라인에서 간편하고 안전하게 거래 할 수 있고, 언제 어디서나 쉽고 빠르게!",
      img: thirdImg,
    },
  ];
  interface ISliderItem {
    readonly name: string;
    readonly title: string;
    readonly text: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly img: any;
  }

  const CustomPrevArrow = (onClickHandler: () => void) => (
    <button
      type="button"
      onClick={onClickHandler}
      className="absolute left-2 top-1/2 z-10"
    >
      <kbd className="kbd translate-x-4 translate-y-8 border-white bg-transparent text-white md:translate-y-0">
        ◀︎
      </kbd>
    </button>
  );

  const CustomNextArrow = (onClickHandler: () => void) => (
    <button
      type="button"
      onClick={onClickHandler}
      className="absolute right-8 top-1/2 z-10"
    >
      <kbd className="kbd translate-y-8 border-white bg-transparent text-white md:translate-y-0">
        ▶︎
      </kbd>
    </button>
  );

  return (
    <Carousel
      autoPlay
      showThumbs={false}
      interval={6000}
      showStatus={false}
      infiniteLoop={true}
      renderArrowPrev={(onClickHandler) => CustomPrevArrow(onClickHandler)}
      renderArrowNext={(onClickHandler) => CustomNextArrow(onClickHandler)}
      className="carousel-container"
    >
      {items.map((item: ISliderItem) => {
        return (
          <div key={item.name} className="carousel-slide h-60 sm:h-96">
            <div className="carousel-description absolute bottom-1/3 left-auto right-auto z-50 mb-10 w-full translate-x-8 translate-y-6 px-4 text-left lg:container sm:translate-y-0 md:px-10">
              <h2 className="text-base font-bold text-white sm:text-xl lg:text-4xl">
                {item.title}
              </h2>
              <div className="my-2 text-sm text-white sm:text-base">
                {item.text.split(",").map((line, idx) => (
                  <p key={idx}>{line.trim()}</p>
                ))}
              </div>
              <Link
                href={`/`}
                className="btn btn-info border-none bg-blue-500 text-white hover:bg-blue-700"
              >
                바로가기
              </Link>
            </div>
            <Image src={item.img} alt={item.name} priority />
          </div>
        );
      })}
    </Carousel>
  );
};

export default Slider;
