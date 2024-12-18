import { useEffect, useState } from "react";
import useLoginStore from "@/store/useLoginStore";
import { EventSourcePolyfill } from "event-source-polyfill";
import axios from "axios";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  type: "POST_ADD_WISH" | "REPORT" | string;
  timestamp: string;
}

export default function Notice() {
  const { loginState, token } = useLoginStore();
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  // 3. 구독 SSE
  useEffect(() => {
    if (loginState && token) {
      const EventSource = EventSourcePolyfill;
      const connectToSSE = () => {
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
          console.log("SSE connected");
          setError(null);
        });

        eventSource.addEventListener("message", (event) => {
          const data = JSON.parse(event.data);
          if (data.event === "dummy") {
            console.log("Dummy data:", event.data);
          } else if (data.event === "notification") {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                id: data.id,
                message: data.message,
                isRead: false,
                type: data.type,
                timestamp: data.timestamp,
              },
            ]);
          }
        });

        eventSource.addEventListener("error", () => {
          setError("SSE connection error");
          eventSource.close();
        });
        return eventSource;
      };

      let eventSource = connectToSSE();

      const reconnectInterval = setInterval(() => {
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log("Reconnecting SSE...");
          eventSource.close();
          eventSource = connectToSSE();
        }
      }, 60000);

      return () => {
        clearInterval(reconnectInterval);
        eventSource.close();
      };
    }
  }, [loginState, token]);

  // 2. 알림 읽음 상태 변경
  const notificationsRead = async (notificationId: number) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prevNotifications) =>
        prevNotifications
          .map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification,
          )
          .filter((notification) => notification.id !== notificationId),
      );
    } catch (error) {
      console.log("Error marking notification as read", error);
    }
  };

  // 1. 전체 알림 목록 조회
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/backend/api/notifications?page=${page}&size=${pageSize}`,
        );
        console.log("Fetched notifications:", response.data);
        const { content, hasNext } = response.data;

        const unreadNotifications = content.filter(
          (notification: Notification) => !notification.isRead,
        );

        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...unreadNotifications,
        ]);
        setHasNext(hasNext);
      } catch (error) {
        console.error("알림을 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page]);

  const loadMoreNotifications = () => {
    if (hasNext && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

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
      {notifications.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="mb-10 text-sm text-gray-700">새로운 알림이 없습니다.</p>
        </div>
      ) : (
        <div className="h-48 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => notificationsRead(notification.id)}
              className={`mb-2 cursor-pointer border p-2 ${
                notification.isRead
                  ? "translate-x-full bg-gray-200 opacity-0"
                  : "bg-white"
              }`}
            >
              <p>{notification.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      {error && <div className="ml-2 mt-2 text-sm text-red-500">{error}</div>}
      {hasNext && !loading && (
        <div className="text-center">
          <button
            onClick={loadMoreNotifications}
            className="text-sm text-blue-500"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}
