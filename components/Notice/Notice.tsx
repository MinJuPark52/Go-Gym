"use client";
import { useEffect, useState } from "react";
import useLoginStore from "@/store/useLoginStore";
import { EventSourcePolyfill } from "event-source-polyfill";
import axiosInstance from "@/api/axiosInstance";
import useUserStore from "@/store/useUserStore";
import { useQuery } from "@tanstack/react-query";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  type: "POST_ADD_WISH" | "REPORT" | string;
  timestamp: string;
}

interface content {
  notificationId: number;
  type: string;
  content: string;
  createdAt: string;
}

export default function Notice() {
  const { loginState, token } = useLoginStore();
  const { user } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const pageSize = 10;

  // 3. 구독 SSE
  useEffect(() => {
    let eventSource: EventSourcePolyfill | null = null;

    const connectToSSE = () => {
      if (!loginState || !token || !user) {
        return;
      }

      const url = `https://go-gym.site/api/notifications/subscribe?id=${user.memberId}`;
      eventSource = new EventSourcePolyfill(url);

      eventSource.onopen = () => {
        console.log("SSE connected");
        setError(null);
      };

      eventSource.addEventListener("dummy", (event) => {
        console.log("1");
        console.log(event);
      });

      eventSource.addEventListener("notification", (event) => {
        console.log("1");
        console.log(event);
      });

      eventSource.onerror = () => {
        console.error("SSE connection error");
        setError("SSE connection error");

        if (eventSource) {
          eventSource.close();
        }

        setTimeout(() => {
          console.log("Reconnecting SSE...");
          connectToSSE();
        }, 60000);
      };
    };

    connectToSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [loginState, token, user]);

  // 1. 전체 알림 목록 조회
  const { data, isSuccess } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      const response: { content: content[] } = await axiosInstance.get(
        `/api/notifications?page=${page}&size=${pageSize}`,
      );
      return response.content;
    },
    staleTime: 0,
  });

  useEffect(() => {
    // const fetchNotifications = async () => {
    //   setLoading(true);
    //   try {
    //     const response: { content: content[] } = await axiosInstance.get(
    //       `/api/notifications?page=${page}&size=${pageSize}`,
    //     );
    //     console.log("Fetched notifications:", response);
    //     const { content } = response;
    //   } catch (error) {
    //     console.error("알림을 불러오는 중 오류 발생:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchNotifications();
  }, [page]);

  // const loadMoreNotifications = () => {
  //   if (hasNext && !loading) {
  //     setPage((prevPage) => prevPage + 1);
  //   }
  // };
  return (
    <div
      className="absolute right-[-120px] z-10 h-72 w-80 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg scrollbar-hide"
      role="menu"
    >
      <div className="flex items-center justify-between p-2">
        <strong className="text-md font-medium uppercase text-gray-700">
          알림📢
        </strong>
      </div>
      <hr />
      {data && data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="mb-10 text-sm text-gray-700">새로운 알림이 없습니다.</p>
        </div>
      ) : (
        <div className="h-48 overflow-y-auto">
          {data &&
            data.map((notification) => (
              <div
                key={notification.notificationId}
                className={`mb-2 cursor-pointer border bg-white p-2`}
              >
                <p>{notification.content}</p>
                <p className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      )}
      {/* {hasNext && !loading && (
        <div className="text-center">
          <button
            onClick={loadMoreNotifications}
            className="text-sm text-blue-500"
          >
            더보기
          </button>
        </div>
      )} */}
    </div>
  );
}
