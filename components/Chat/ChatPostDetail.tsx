"use client";

import axiosInstance from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function ChatPostDetail({
  onOpenModal,
  chatRoomId,
}: {
  onOpenModal: () => void;
  chatRoomId: string;
}) {
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [status, setStatus] = useState("PEDING");
  const [transactionDate, setTransactionDate] = useState({
    date: "",
    time: "",
  });

  const { mutate: paystart } = useMutation({
    mutationKey: ["payStart"],
    mutationFn: async () =>
      await axiosInstance.post(`/api/safe-payments/${chatRoomId}`, {
        responderId: "1",
        amount: 10000,
      }),
    onSuccess: () => alert("결제를 요청했습니다."),
  });

  const { mutate: tdStart } = useMutation({
    mutationKey: ["tdStart"],
    mutationFn: async () =>
      await axiosInstance.put(`/api/safe-payments/${chatRoomId}`, {
        dateTIme: `${transactionDate.date} ${transactionDate.time}`,
      }),
    onSuccess: () => console.log("거래 일정을 잡았습니다."),
  });

  const { mutate: changeStatus } = useMutation({
    mutationKey: ["changeStatus"],
    mutationFn: async (status: string) =>
      await axiosInstance.patch(
        `/api/posts/postId/change?chat-room-id=${chatRoomId}&status=${status}`,
      ),
    onSuccess: () => console.log("상태변경"),
  });

  const handleClick = () => {
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionDate({
      ...transactionDate,
      date: e.target.value,
    });
  };
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionDate({
      ...transactionDate,
      time: e.target.value,
    });
  };

  const handlerChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    if (status === "PENDING" && e.target.value === "COMPLETED") {
      alert("거래중일때만 거래완료로 변경이 가능합니다.");
      return;
    }
    setStatus(e.target.value);
    changeStatus(e.target.value);
    console.log(status);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const realAmount = +amount.replace(/,/g, "");

    tdStart();
    console.log(transactionDate);
    setModal(false);
  };

  return (
    <div className="absolute left-0 right-0 top-0 z-30 flex min-h-32 flex-col gap-2 border-b-2 bg-white p-4 pb-1">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <button className="btn w-full sm:hidden" onClick={onOpenModal}>
            채팅방
          </button>
          <div className="flex gap-4">
            <select
              className="font-semibold focus:outline-none"
              onChange={handlerChangeStatus}
              value={status}
            >
              <option value="PENDING">게시중</option>
              <option value="IN_PROGRESS">거래중</option>
              <option value="COMPLETED">거래완료</option>
            </select>
            <p className="text-sm font-bold text-gray-500">제목이요</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">{formatNumber("10000")}원</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AiOutlineExclamationCircle
            size={18}
            color="#999999"
            onMouseOver={() => setModal1(true)}
            onMouseOut={() => setModal1(false)}
          />
          {modal1 && (
            <div className="absolute translate-x-0 translate-y-10 rounded-xl bg-gray-100 p-2 text-xs font-bold text-gray-500 shadow-lg">
              <p>거래 일정을 등록하면 </p>
              <p>예상 출발시간에 채팅을 보내드려요!</p>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleClick}
              className="btn btn-active border-blue-500 bg-white hover:bg-blue-500 hover:text-white"
            >
              거래 일정 잡기
            </button>
            <button
              onClick={() => paystart()}
              className="btn btn-active border-blue-500 bg-white hover:bg-blue-500 hover:text-white"
            >
              안전결제 요청
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <div className="animate-slide-down">
          <form onSubmit={handleSubmit} className="mt-8 flex">
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor={"transactionDate"}
                className="text-sm text-gray-500"
              >
                거래일정
              </label>
              <div className="flex w-full justify-between gap-2">
                <input
                  type="date"
                  className="h-12 w-48 cursor-pointer rounded-md border border-gray-400 pl-2 text-gray-600 focus:outline-blue-400"
                  name={"transactionDate"}
                  id={"transactionDate"}
                  onChange={handleDateChange}
                  value={transactionDate.date}
                  placeholder="ex) 2025/02/24"
                />
                <input
                  type="time"
                  className="h-12 w-48 cursor-pointer rounded-md border border-gray-400 pl-2 text-gray-600 focus:outline-blue-400"
                  name={"transactionDate"}
                  id={"transactionDate"}
                  onChange={handleTimeChange}
                  value={transactionDate.time}
                  placeholder="ex) 2025/02/24"
                />
                <button className="btn" type="submit">
                  요청
                </button>
              </div>
            </div>
          </form>
          <div className="flex w-full justify-center">
            <button>
              <kbd
                onClick={handleClose}
                className="kbd border-none bg-white text-gray-500"
              >
                ▲
              </kbd>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const formatNumber = (input: string) => {
  const numericValue = input.replace(/,/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
