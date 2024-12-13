import { useEffect, useState } from "react";
import useLoginStore from "@/store/useLoginStore";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";

export default function Notice() {
  const { loginState, token } = useLoginStore();
  const [error, setError] = useState<string | null>(null);
  // 구독 SSE
  // 알림 띄우는거 notification
  // 연결유지되고 있는지 30초 확인 heartbeat

  useEffect(() => {
    if (loginState && token) {
      const EventSource = EventSourcePolyfill || NativeEventSource;
      const eventSource = new EventSource(
        "/backend/api/notification/subscribe",
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

  return <div>1</div>;

  // eventSource.onopen
  // eventSoure.onerror

  //      eventSource.onerror = (error) => {
  //        console.error('EventSource failed:', error);
  //        eventSource.close();
  //      };

  // 알림 읽음 상태 변경

  // 전체 알림 목록 조회 -> 종 아이콘 눌러서 조회 -> 읽지 않은 알림만 저장
  // const response = await axios.get(
  // "/backend/api/notifications?page={page}&size={size}"

  // SSE 구독 요청
  // 구독 요청 일치하는지 확인 if문
  // 구독이 됐는지 확인하기 어려움 -> 데이터 쏴주기
  // 더미로 받음. 연결 요청 -> 한번만 console.log
  // heartbeat -> 30초 이벤트 안오면 다시 재연결, 확인 로직 필요
  // 알수없는 데이터 -> error

  /*
  return (
    <div
      className="absolute end-0 z-10 w-80 h-72 rounded-md border border-gray-300 bg-white shadow-lg"
      role="menu"
    >
      <div className="p-2 flex justify-between items-center">
        <strong className="text-md font-medium uppercase text-gray-700">
          알림📢
        </strong>
      )
      </div>
        {!isViewingAll && (
          <button
            className="text-sm text-gray-700 mr-1"
            onClick={handleAllNotifications}
          >
            목록
          </button>
        )}
      </div>
      <hr />
      {msg.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-sm text-gray-700 mb-10">새로운 알림이 없습니다.</p>
        </div>
      ) : (
        <div className="h-48 overflow-y-auto">
          {msg.map((notification) => (
            <a
              key={notification.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleMarkAsRead(notification.id);
              }}
              className={`block rounded-lg px-4 py-2 text-sm ${
                notification.read
                  ? "text-gray-400"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-700"
              }`}
              role="menuitem"
            >
              {notification.message}
            </a>
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-2 ml-2">
          서버 연결에 문제가 발생했습니다.
        </div>
      )}
    </div>
    */
}
