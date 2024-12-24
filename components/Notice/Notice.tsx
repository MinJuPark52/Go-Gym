"use client";
import { useEffect, useState } from "react";
import useLoginStore from "@/store/useLoginStore";
import { EventSourcePolyfill } from "event-source-polyfill";
import axiosInstance from "@/api/axiosInstance";
import useUserStore from "@/store/useUserStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { IoTrashBinOutline } from "react-icons/io5";

interface content {
  notificationId: number;
  type: string;
  content: string;
  createdAt: string;
}

export default function Notice() {
  const { loginState, token } = useLoginStore();
  const { user } = useUserStore();
  const router = useRouter();

  const pageSize = 10;

  const [toast, setToast] = useState<string | null>(null);

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

      eventSource.addEventListener("notification", (event) => {
        console.log("1");
        console.log(event);

        try {
          const notificationData = JSON.parse(event.data);
          console.log("Notification received:", notificationData);

          setToast(notificationData.content);

          setTimeout(() => {
            setToast(null);
          }, 5000);
        } catch (error) {
          console.error("Error parsing notification data:", error);
        }
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
  }, [loginState, token, user]);

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
  const handleRead = () => {
    mutate();
  };

  const { mutate } = useMutation({
    mutationKey: ["chatList"],
    mutationFn: async () =>
      await axiosInstance.put(
        `https://go-gym.site/api/notifications/{notification-id}/read`,
      ),
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div>
      {/*
      {toast && (
        <div>
        <p>{toast}</p>
        </div>
      )}
      */}
      <p>{toast}</p>
      <div
        className="absolute right-[-120px] z-10 h-72 w-80 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg scrollbar-hide"
        role="menu"
      >
        <div className="flex items-center justify-between p-2">
          <strong className="text-md font-medium uppercase text-gray-700">
            알림📢
          </strong>
          <div className="flex h-[20%] flex-col justify-center pl-2 pr-2 transition-all hover:bg-gray-200">
            <IoTrashBinOutline
              className="ml-auto cursor-pointer text-xl text-red-400 transition-all hover:text-3xl"
              onClick={handleRead}
            />
          </div>
        </div>
        <hr />
        {data && data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="mb-10 text-sm text-gray-700">
              새로운 알림이 없습니다.
            </p>
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
      </div>
    </div>
  );
}
