// import { FaBell } from "react-icons/fa";

// 전체 알림 목록 조회

import { useState, useEffect } from "react";
import axios from "axios";

interface Notification {
  name: string;
  data: number;
  read: boolean;
}

export default function Notice() {
  const [msg, setMsg] = useState<Notification[]>([]);
  const [sseUrl, setSseUrl] = useState<string | null>(null);

  // 알림 읽음 상태 변경
  const handleMarkAsRead = (name: string) => {
    setMsg((prev) =>
      prev.map((notification) =>
        notification.name === name
          ? { ...notification, read: true }
          : notification
      )
    );

    axios
      // id ? name ?
      .put(`/backend/api/notification/{notification-id}/read`, { name })
      .then((response) => {
        console.log("Notification read:", response.data);
      })
      .catch((error) => {
        console.error("Error updating read status:", error);
      });
  };

  // SSE 구독 요청
  useEffect(() => {
    const fetchSseUrl = async () => {
      try {
        const response = await axios.get("/backend/api/notification/subscribe");
        setSseUrl(response.data.sseUrl);
      } catch (error) {
        console.error("Failed to fetch SSE URL:", error);
      }
    };

    fetchSseUrl();
  }, []);

  useEffect(() => {
    if (sseUrl) {
      const eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data) as Notification;
          setMsg((prev) => [data, ...prev].slice(0, 50));
        } catch (error) {
          console.error("Failed to parse notification data:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
      };

      return () => eventSource.close();
    }
  }, [sseUrl]);

  return (
    <div>
      {msg.length > 0 ? (
        msg.map((notification) => (
          <div key={notification.name}>
            <p>{notification.data}</p>
            {notification.read ? (
              <span>Read</span>
            ) : (
              <button
                onClick={() => handleMarkAsRead(notification.name)}
              ></button>
            )}
          </div>
        ))
      ) : (
        <p>No notifications available</p>
      )}
    </div>
  );
}
