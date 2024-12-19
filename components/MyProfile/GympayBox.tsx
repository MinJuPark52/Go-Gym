"use client";
import axiosInstance from "@/api/axiosInstance";
import useUserStore from "@/store/useUserStore";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

export default function GympayBox() {
  const { user } = useUserStore();

  const { mutate } = useMutation({
    mutationKey: ["createGymPay"],
    mutationFn: async () => await axiosInstance.post("/api/gym-pays"),
    onSuccess: () => alert("짐페이가 개설되었습니다."),
  });
  return (
    <>
      {user?.gymPayBalance ? (
        <div className="flex min-h-24 max-w-[660px] flex-col rounded-md bg-blue-500 p-4 text-white">
          <div className="flex justify-between">
            <p>Gym Pay</p>
            <p>{user.gymPayBalance}</p>
          </div>
          <Link href={"/mypage/addGymPay"} className="ml-auto">
            <button>충전</button>
          </Link>
        </div>
      ) : (
        <div className="flex min-h-24 max-w-[660px] flex-col rounded-md bg-gray-300 p-4 text-white">
          <p>짐페이가 개설되지않았습니다. 버튼을 눌러 개설해주세요</p>
          <div className="flex justify-end">
            <button
              onClick={() => mutate()}
              className="btn btn-active bg-blue-500 text-white hover:bg-blue-600"
            >
              개설하기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
