import { useEffect, useState } from "react";
import useLoginStore from "@/store/useLoginStore";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
// import axios from "axios";

export default function Notice() {
  const { loginState, token } = useLoginStore();
  const [error, setError] = useState<string | null>(null);

  // 3. 구독 SSE
  // 알림 띄우는거 notification
  // 연결유지되고 있는지 30초 확인 heartbeat
  // 구독 요청 일치하는지 확인 if문
  // 구독이 됐는지 확인하기 어려움 -> 데이터 쏴주기
  // 더미로 받음. 연결 요청 -> 한번만 console.log
  // heartbeat -> 30초 이벤트 안오면 다시 재연결, 확인 로직 필요
  // 알수없는 데이터 -> error
  useEffect(() => {
    if (loginState && token) {
      const EventSource = EventSourcePolyfill || NativeEventSource;
      const eventSource = new EventSource(
        "/backend/api/notifications/subscribe",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Connection: "keep-alive",
            Accept: "text/event-stream",
          },
        },
      );

      eventSource.addEventListener("open", () => {
        console.log("connect");
      });

      eventSource.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (data.event === "dummy") {
          console.log("Dummy data:", event.data);
        } else if (data.event === "notification") {
          console.log("Notification:", event.data);
        } else if (data.event === "heartbeat") {
          console.log("Heartbeat:", event.data);
        }
      });

      eventSource.onerror = () => {
        setError("SSE connection error");
        eventSource.close();
      };

      return () => {
        console.log("Closing connection.");
        eventSource.close();
      };
    }
  }, [loginState, token, error]);

  // 2. 알림 읽음 상태 변경

  // 1. 전체 알림 목록 조회 -> 종 아이콘 눌러서 조회 -> 읽지 않은 알림만 저장
  /*
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.get("/backend/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };
  });
  */

  return (
    <div
      className="fixed right-[130px] top-[55px] z-10 h-72 w-80 rounded-md border border-gray-300 bg-white shadow-lg"
      role="menu"
    >
      <div className="flex items-center justify-between p-2">
        <strong className="text-md font-medium uppercase text-gray-700">
          알림📢
        </strong>
      </div>
      <hr />
      <div className="flex h-full items-center justify-center">
        <p className="mb-10 text-sm text-gray-700">새로운 알림이 없습니다.</p>
      </div>
      <div className="h-48 overflow-y-auto"></div>
      {/*
      <div className="ml-2 mt-2 text-sm text-red-500">
        서버 연결에 문제가 발생했습니다.
      </div>
      */}
    </div>
  );
}
