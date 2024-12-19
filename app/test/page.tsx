"use client";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useState } from "react";

export default function TestPage() {
  const [click, setClick] = useState(true);
  const [click1, setClick1] = useState(true);

  return (
    <>
      <button
        onClick={() => {
          const eventSource = new EventSourcePolyfill(
            "https://36d6-211-202-41-148.ngrok-free.app/api/notifications/subscribe?id=1",
            {
              headers: {
                Connection: "keep-alive",
                Accept: "text/event-stream",
              },
            },
          );
          eventSource.addEventListener("open", () => {
            console.log("connect");
          });

          eventSource.onmessage = (event) => {
            console.log("Default message event received");
            console.log("Event:", event);
            console.log("Event Data:", event.data);
          };

          eventSource.addEventListener("message", (event: any) => {
            console.log("1");
            console.log("event" + event);
            console.log("eventData" + event.data);
          });
          eventSource.addEventListener("dummy", (event: any) => {
            console.log("1");
            console.log("event" + event);
            console.log("eventData" + event.data);
          });
          setClick(false);
          if (!click) {
            eventSource.close();
            setClick(true);
          }
        }}
      >
        구독
      </button>
      <button
        onClick={() => {
          const eventSource = new EventSourcePolyfill(
            "https://go-gym.site/api/notifications/subscribe?id=1",
            {
              headers: {
                Connection: "keep-alive",
                Accept: "text/event-stream",
              },
            },
          );
          eventSource.addEventListener("open", () => {
            console.log("connect");
          });

          eventSource.onmessage = (event) => {
            console.log("Default message event received");
            console.log("Event:", event);
            console.log("Event Data:", event.data);
          };

          eventSource.addEventListener("message", (event: any) => {
            console.log("1");
            console.log("event" + event);
            console.log("eventData" + event.data);
          });
          eventSource.addEventListener("dummy", (event: any) => {
            console.log("1");
            console.log("event" + event);
            console.log("eventData" + event.data);
          });
          setClick1(false);
          if (!click1) {
            eventSource.close();
            setClick1(true);
          }
        }}
      >
        구독2
      </button>
    </>
  );
}
