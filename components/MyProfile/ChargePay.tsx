"use client";

import { useEffect, useState } from "react";
import PortOne from "@portone/browser-sdk/v2";
import axiosInstance from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import useLoginStore from "@/store/useLoginStore";
import { EventSourcePolyfill } from "event-source-polyfill";

interface PreRegisterResponse {
  paymentId: string; // 서버 응답에서 paymentId의 타입을 확인 후 정의
}

export default function ChargePay() {
  const { token } = useLoginStore();

  const [data, setData] = useState<any>({
    storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
    orderName: "짐페이 충전",
    totalAmount: 0,
    currency: "KRW",
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNAL_KEY,
    payMethod: "CARD",
    //customer는 동적으로 받을 예정
    customer: {
      fullName: "전민혁",
      phoneNumber: "010-7634-7212",
      email: "mari394337@gmail.com",
    },
  });

  async function requestPayment(paymentId: string) {
    if (data) {
      const response = await PortOne.requestPayment({ ...data, paymentId });

      //백엔드 엔드포인트
      // const validation = await axiosInstance.post('/api/payments/webhook', {
      //   txId: response?.txId,
      //   paymentId: response?.paymentId,
      // });
      console.log(response);
      // console.log(validation);
    }
  }

  const { mutate } = useMutation({
    mutationKey: ["pre-register"],
    mutationFn: async () => {
      const response: { paymentId: string } = await axiosInstance.post(
        "/api/payments/pre-register",
        {
          amount: data.totalAmount,
        },
      );
      return response;
    },
    onSuccess: (response) => {
      const eventSource = new EventSource(
        `http://localhost:3000/backend/api/payments/sse/subscribe/${response.paymentId}`,
      );

      
      eventSource.addEventListener("Transaction Paid", (event) => {
        console.log(event);
      });
      eventSource.addEventListener("Transaction Failed", (event) => {
        console.log(event);
      });

      eventSource.onerror = () => {
        //에러 발생시 할 동작
        eventSource.close(); //연결 끊기
      };

      requestPayment(response.paymentId);
    },
  });

  //사전등록시 금액보내고, 주문번호(paymentId) 받고,결제 진행
  //주문번호 받았을때 sse구독요청

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    setData({
      ...data,
      totalAmount: data.totalAmount + +target.value,
    });
  };

  const handleChangeMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      totalAmount: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.totalAmount < 1000) {
      alert("1000원 이상 입력해주세요");
      return;
    }

    mutate();

    // const response: { paymentId: string } = await axiosInstance.post(
    //   '/api/payments/pre-register',
    //   {
    //     amount: data.totalAmount,
    //   }
    // );

    // if (response) {
    //   setData({
    //     ...data,
    //     paymentId: response.paymentId,
    //   });
    // }

    // if (data.paymentId) {
    //   if (data.paymentId) {
    //     const eventSource = new EventSource(
    //       `https://ac8c-175-195-104-144.ngrok-free.app/api/payments/sse/subscribe/${data.paymentId}`
    //     );

    //     eventSource.addEventListener('Transaction Paid', (event) => {
    //       console.log(event);
    //     });
    //     eventSource.addEventListener('Transaction Failed', (event) => {
    //       console.log(event);
    //     });

    //     eventSource.onerror = () => {
    //       //에러 발생시 할 동작
    //       eventSource.close(); //연결 끊기
    //     };
    //   }
    //   requestPayment();
    // }
  };

  return (
    <div className="flex w-[75%] justify-center">
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-[480px] flex-col gap-12 rounded-lg border-2 border-blue-300 p-4"
      >
        <p className="font-bold">Gym Pay 충전하기</p>
        <div className="flex flex-col items-center">
          <input
            type="number"
            placeholder="충전할 금액을 입력해주세요"
            className="w-96 border border-gray-300 p-2 focus:outline-none"
            onChange={handleChangeMoney}
            value={data.totalAmount}
          />
          <div className="mb-8 mt-8 flex w-[75%] justify-between">
            <button
              type="button"
              className="rounded-lg bg-blue-300 p-1 text-sm font-bold text-white"
              onClick={handleButtonClick}
              value={1000}
            >
              +1000원
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-300 p-1 text-sm font-bold text-white"
              onClick={handleButtonClick}
              value={5000}
            >
              +5000원
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-300 p-1 text-sm font-bold text-white"
              onClick={handleButtonClick}
              value={10000}
            >
              +10000원
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-400 p-1 text-sm font-bold text-white transition-all hover:bg-blue-500"
        >
          충전하기
        </button>
      </form>
    </div>
  );
}
