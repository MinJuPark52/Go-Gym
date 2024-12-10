"use client";
import Link from "next/link";

export default function GympayBox() {
  return (
    <div className="flex max-w-[660px] flex-col rounded-md bg-blue-300 p-4 text-white">
      <div className="flex justify-between">
        <p>Gym Pay</p>
        <p>10,000원</p>
      </div>
      <Link href={"/mypage/addGymPay"} className="ml-auto">
        <button>충전</button>
      </Link>
    </div>
  );
}
