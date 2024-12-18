"use client";

import axios from "axios";
import { EventSourcePolyfill } from "event-source-polyfill";

export default function Test() {
  const handlerClick = () => {
    const eventSource = new EventSourcePolyfill(
      `http://localhost:3000/backend/api/notifications/subscribe`,
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwb3N0QHRlc3QuY29tIiwiaWQiOjEsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNzM0MjYyMzcwLCJleHAiOjE3MzQyNjU5NzB9.rc1BhNb0HYJN6-Zf0UqRxsRscP2VpGyExJ5C96jmLlE",
        },
      },
    );

    eventSource.onmessage = (event) => {
      console.log("Default message event:", event.data);
    };

    eventSource.addEventListener("open", (event: any) => {
      console.log(event.data);
      console.log("연결");
    });

    eventSource.addEventListener("dummy", (event: any) => {
      console.log(event.data);
      console.log("11");
    });

    eventSource.addEventListener("notification", (event: any) => {
      console.log(event.data);
      console.log("11");
    });

    eventSource.onerror = () => {
      //에러 발생시 할 동작
      eventSource.close(); //연결 끊기
    };
  };

  return (
    <button onClick={handlerClick} className="btn btn-active">
      구독
    </button>
  );
}
