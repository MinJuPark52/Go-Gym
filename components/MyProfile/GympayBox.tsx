"use client";
import axiosInstance from "@/api/axiosInstance";
import useUserStore from "@/store/useUserStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GympayBox() {
  const { user, InitUser } = useUserStore();
  const router = useRouter();
  const [createGympay, setCreateGympay] = useState(0);

  const { mutate } = useMutation({
    mutationKey: ["createGymPay"],
    mutationFn: async () => await axiosInstance.post("/api/gym-pays"),
    onSuccess: () => {
      alert("짐페이가 개설되었습니다.");
      setCreateGympay((prev) => prev + 1);
    },
  });

  const { data: userData, isSuccess } = useQuery({
    queryKey: ["user", createGympay],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axiosInstance.get("/api/members/me/profile");
      return response;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (isSuccess) {
      InitUser(userData);
    }
  }, [createGympay, isSuccess]);

  return (
    <>
      {user ? (
        <div className="flex min-h-24 max-w-[660px] flex-col rounded-md bg-blue-500 p-4 text-white">
          <div className="flex justify-between">
            <p className="text-2xl font-bold">Gym Pay</p>
            <p className="text-xl">
              {user.gymPayBalance
                ? formatNumber(user.gymPayBalance.toString())
                : 0}{" "}
              {"(원)"}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <Link href={"/mypage/addGymPay"}>
              <button className="btn border-none bg-blue-500 text-white hover:bg-blue-600">
                페이 충전
              </button>
            </Link>
            <Link href={"/mypage/payhistory"}>
              <button className="btn border-none bg-blue-500 text-white hover:bg-blue-600">
                거래내역
              </button>
            </Link>
          </div>
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
const formatNumber = (input: string) => {
  const numericValue = input.replace(/,/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
