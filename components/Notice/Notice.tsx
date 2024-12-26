"use client";
import { useEffect, useState } from "react";
import useLoginStore from "@/store/useLoginStore";
import { EventSourcePolyfill } from "event-source-polyfill";
import axiosInstance from "@/api/axiosInstance";
import useUserStore from "@/store/useUserStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
import { FaRegTrashAlt } from "react-icons/fa";

interface content {
  notificationId: number;
  type: string;
  content: string;
  createdAt: string;
}

export default function Notice() {
  const queryClient = useQueryClient();
  const { loginState, token } = useLoginStore();
  const { user } = useUserStore();
  // const router = useRouter();
  const pageSize = 10;
  const [notification, setNotification] = useState<content | null>(null);
  const [animationClass, setAnimationClass] = useState("translate-x-full");

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
      };

      eventSource.addEventListener("dummy", (event) => {
        console.log("1");
        console.log(event);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eventSource.addEventListener("notification", (event: any) => {
        console.log("1");
        console.log(event);

        const newNotification: content = JSON.parse(event.data);
        setNotification(newNotification);

        setAnimationClass("translate-x-0");

        setTimeout(() => {
          setAnimationClass("translate-x-full");
          setTimeout(() => {
            setNotification(null);
          }, 500);
        }, 5000);
      });

      eventSource.onerror = () => {
        console.error("SSE connection error");

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
  }, [loginState, token, user, notification]);

  // 1. 전체 알림 목록 조회
  const { data } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      const response: { content: content[] } = await axiosInstance.get(
        `https://go-gym.site/api/notifications?page=0&size=${pageSize}`,
      );
      return response.content;
    },
    staleTime: 0,
  });

  // 알림 목록
  const handleDeleteNotification = (notificationId: number) => {
    mutate(notificationId);
  };

  const { mutate } = useMutation({
    mutationKey: ["delete"],
    mutationFn: async (notificationId: number) =>
      await axiosInstance.put(`/api/notifications/${notificationId}/read`),

    onSuccess: () => {
      queryClient.invalidateQueries<any>(["notification"]);
    },
  });

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
                <FaRegTrashAlt
                  className="ml-auto cursor-pointer text-xl text-red-400"
                  onClick={() =>
                    handleDeleteNotification(notification.notificationId)
                  }
                />
                <p className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      )}

      {notification && (
        <div
          className={`fixed bottom-10 right-10 z-20 mb-2 transform border border-blue-400 bg-white p-4 transition-transform duration-500 ease-in-out ${animationClass}`}
        >
          <p>{notification.content}</p>
          <p className="text-sm text-gray-500">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
