"use client";

import { useState } from "react";

export default function ChatPostDetail() {
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState("");

  const handleClick = () => {
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
  };

  const handleChangeMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const realAmount = +amount.replace(/,/g, "");

    if (Number.isNaN(realAmount)) {
      alert("숫자만 입력해주세요");
      return;
    }
    console.log(realAmount);
    setModal(false);
  };

  return (
    <div className="absolute left-0 right-0 top-0 z-40 flex min-h-32 flex-col gap-2 border-b-2 bg-white p-4 pb-1">
      <div className="flex gap-4">
        <select className="font-semibold focus:outline-none">
          <option>게시중</option>
          <option>구매완료</option>
          <option>판매완료</option>
        </select>
        <p className="text-sm font-bold text-gray-500">제목이요</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-semibold">10,000원</p>
        <div>
          <button
            onClick={handleClick}
            className="btn btn-active border-blue-500 bg-white hover:bg-blue-500 hover:text-white"
          >
            거래 신청
          </button>
        </div>
      </div>
      {modal && (
        <div className="animate-slide-down">
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-4 rounded-lg border-2 border-blue-300 p-4"
          >
            <p className="font-bold">거래신청</p>
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  placeholder="거래할 금액을 입력해주세요"
                  className="flex h-12 min-w-64 rounded-lg border border-gray-300 p-2 focus:outline-none"
                  onChange={handleChangeMoney}
                  value={formatNumber(amount)}
                />
              </div>
              <button
                type="submit"
                className="btn rounded-lg bg-blue-400 p-1 text-sm font-bold text-white transition-all hover:bg-blue-500"
              >
                거래하기
              </button>
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
