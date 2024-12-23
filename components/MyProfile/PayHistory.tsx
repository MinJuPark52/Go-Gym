"use client";

import axiosInstance from "@/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Pagenation from "../UI/Pagination";
import PayHistoryEl from "./PayHistoryEl";

interface historyType {
  amount: string;
  balance: string;
  createdAt: string;
  historyId: string;
  transferType:
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "CHARGE"
    | "CANCEL_DEPOSIT"
    | "CANCEL_WITHDRAWAL"
    | "CANCEL_CHARGE";
}

export default function PayHistory() {
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isSuccess } = useQuery({
    queryKey: ["history", currentPage],
    queryFn: async () => {
      const res: { content: historyType[]; totalPages: string } =
        await axiosInstance.get(
          `/api/gym-pays/histories?startDate=2024-12-10 00:00:00&endDate=${getCurrentTime()}&page=${currentPage}&size=5`,
        );
      return res;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
    }
  }, [data]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(+event.target.value); // 상태 업데이트

    console.log(currentPage);
  };

  return (
    <>
      {data &&
        data.content.map((history) => (
          <PayHistoryEl
            historyId={history.historyId}
            transferType={history.transferType}
            amount={history.amount}
            createdAt={history.createdAt}
          />
        ))}
      <Pagenation
        size={3}
        page={currentPage}
        onRadioChange={handleRadioChange}
        totalPage={data ? +data.totalPages : 1}
      />
    </>
  );
}

const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};
