'use client';

import { useState } from 'react';
import PortOne from '@portone/browser-sdk/v2';
import axios from 'axios';
import axiosInstance from '@/api/axiosInstance';

export default function ChargePay() {
  const [money, setMoney] = useState(0);
  const [paymentId, setPaymentId] = useState('');

  //사전등록시 금액보내고, 주문번호(paymentId) 받고,결제 진행
  //주문번호 받았을때 sse구독요청

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
    paymentId,
    orderName: '짐페이 충전',
    totalAmount: money,
    currency: 'KRW',
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNAL_KEY,
    payMethod: 'CARD',
    //customer는 동적으로 받을 예정
    customer: {
      fullName: '전민혁',
      phoneNumber: '010-7634-7212',
      email: 'mari394337@gmail.com',
    },
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    setMoney((prevMoney) => (prevMoney || 0) + +target.value);
  };

  const handleChangeMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoney(+e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (money < 1000) {
      alert('1000원 이상 입력해주세요');
      return;
    }

    //사전 정보
    const response = await axiosInstance.post('/api/payments/pre-register', {
      amount: money,
    });

    if (response) {
      setPaymentId(response.data.merchantId);
    }

    //sse구독
    const eventSource = new EventSource(
      `/api/payments/sse/subscribe/${paymentId}`
    );

    eventSource.addEventListener('new_thread', () => {
      //'new_thread' 이벤트가 오면 할 동작
    });

    eventSource.onerror = () => {
      //에러 발생시 할 동작
      eventSource.close(); //연결 끊기
    };

    async function requestPayment() {
      if (data) {
        const response = await PortOne.requestPayment(data);

        //백엔드 엔드포인트
        const validation = await axios.post('url', {
          txId: response?.txId,
          paymentId: response?.paymentId,
        });
        console.log(response);
        console.log(validation);
      }
    }

    requestPayment();
  };

  return (
    <div className=" flex justify-center w-[75%]">
      <form
        onSubmit={handleSubmit}
        className=" flex flex-col gap-12 mt-8 p-4 w-[480px] border-2 border-blue-300 rounded-lg"
      >
        <p className=" font-bold">Gym Pay 충전하기</p>
        <div className=" flex flex-col items-center">
          <input
            type="number"
            placeholder="충전할 금액을 입력해주세요"
            className=" p-2 w-96 border border-gray-300 focus:outline-none"
            onChange={handleChangeMoney}
            value={money}
          />
          <div className=" flex justify-between w-[75%] mt-8 mb-8">
            <button
              type="button"
              className=" p-1 bg-blue-300 rounded-lg text-white text-sm font-bold"
              onClick={handleButtonClick}
              value={1000}
            >
              +1000원
            </button>
            <button
              type="button"
              className=" p-1 bg-blue-300 rounded-lg text-white text-sm font-bold"
              onClick={handleButtonClick}
              value={5000}
            >
              +5000원
            </button>
            <button
              type="button"
              className=" p-1 bg-blue-300 rounded-lg text-white text-sm font-bold"
              onClick={handleButtonClick}
              value={10000}
            >
              +10000원
            </button>
          </div>
        </div>
        <button
          type="submit"
          className=" p-1 bg-blue-400 rounded-lg text-white text-sm font-bold hover:bg-blue-500 transition-all"
        >
          충전하기
        </button>
      </form>
    </div>
  );
}
