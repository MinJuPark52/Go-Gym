"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import profile from "@/public/default_profile.png";
import useWebSocketStore from "@/store/useSocketStore";
import DefaultProfile from "../UI/DefaultProfile";
import axiosInstance from "@/api/axiosInstance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ChatPostDetail from "./ChatPostDetail";

interface props {
  chatRoomId: string;
  onSendMessage: ({
    chatRoomId,
    content,
  }: {
    chatRoomId: string;
    content: string;
  }) => void;
  counterpartyNickname: string;
  onOpenModal: () => void;
}

export default function Chat({
  chatRoomId,
  onSendMessage,
  counterpartyNickname,
  onOpenModal,
}: props) {
  const [text, setText] = useState("");
  const { connect, messages, setAgoMessage, disconnect } = useWebSocketStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 숫자 부분만 chatroomid적어주면 됨
    if (chatRoomId) {
      connect("/backend" + "/ws", chatRoomId, (message) => {
        console.log("New message:", message.body);
      });
    }

    // const chatLeave = async () => {
    //   await axiosInstance.post(`/api/chatroom/{chatroom-id}/leave`, {
    //     lastReadMessageId: messages[messages.length - 1]
    //   })

    // }
    return () => {
      // chatLeave();
      disconnect();
    };
  }, [chatRoomId]);

  // const { data: agoMessage, isPending } = useQuery({
  //   queryKey: ["agoMessage", chatRoomId],
  //   queryFn: async () =>
  //     await axiosInstance.get(
  //       `/api/chatroom/${chatRoomId}/messages?page=0&size=20`,
  //     ),
  //   staleTime: 10000,
  //   enabled: chatRoomId !== "",
  // });
  // useEffect(() => {
  //   console.log(agoMessage);
  // }, [agoMessage]);

  //무한스크롤 구현

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["agomessages"],
      queryFn: async ({ pageParam = 0 }) => {
        const res: { messages: any } = await axiosInstance.get(
          `/api/chatroom/${chatRoomId}/messages`,
          {
            params: { page: pageParam, size: 6 },
          },
        );
        return res.messages;
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.last ? undefined : pages.length;
      },
      initialPageParam: 0,
      enabled: !!chatRoomId,
    });

  useEffect(() => {
    if (data) {
      const allMessages = data.pages.flatMap((page) => page.content);
      setAgoMessage(allMessages.reverse()); // Zustand 상태 업데이트
      console.log(data);
    }
  }, [data, setAgoMessage]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop } = scrollRef.current;
      if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage(); // 위로 스크롤 시 다음 페이지 데이터 불러오기
      }
    }
  };

  // scrollTop == 현재위치, 맨밑으로 이동중
  useEffect(() => {
    if (scrollRef.current && scrollRef.current.scrollTop !== 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  //무한 스크롤 함수 끝

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (text.trim().length === 0) {
      return;
    }
    //senderId랑 chatRoomId 1번 고정
    onSendMessage({ chatRoomId, content: text });
    setText("");
  };

  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  if (isPending) {
    return (
      <div className="relative flex h-[100%] w-[100%] flex-col border-r-2 bg-blue-200 bg-opacity-40 p-4">
        <ChatPostDetail onOpenModal={onOpenModal} />
        <div className="flex h-[calc(100%-10rem)] items-center justify-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
        <div className="absolute bottom-0 left-0 flex h-24 w-full bg-white p-2">
          <textarea
            className="flex-[4] focus:outline-none"
            placeholder="메세지를 입력해주세요"
          />
          <div className="flex flex-[1] items-center justify-center">
            <button
              type="submit"
              className="btn btn-info border-blue-500 bg-blue-500 text-white"
              disabled={text.trim().length === 0}
            >
              전송
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmitMessage}
      className="relative flex h-[100%] w-[70%] flex-col bg-blue-200 bg-opacity-40 p-4"
    >
      <ChatPostDetail onOpenModal={onOpenModal} />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex h-[calc(100%-10rem)] flex-col overflow-y-auto p-2 pt-32 scrollbar-hide"
      >
        {/* 채팅 데이터 받아오면 위에 코드로 교체 예정 */}
        {messages.map((chat) => {
          return chat.senderId === 1 ? (
            <div className="chat chat-start" key={chat.createdAt}>
              <div className="avatar chat-image">
                <DefaultProfile width="10" />
              </div>
              <div className="chat-header mb-1 opacity-50">
                {counterpartyNickname}
              </div>
              <div className="chat-bubble bg-white text-gray-600">
                {chat.content}
              </div>
              <div></div>
              <time className="ml-2 mt-1 text-xs opacity-50">
                {extractTime(chat.createdAt)}
              </time>
            </div>
          ) : (
            <div className="chat chat-end" key={chat.createdAt}>
              <div className="avatar chat-image">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">전민혁</div>
              <div className="chat-bubble bg-blue-500 text-white">
                {chat.content}
              </div>

              <time className="mt-1 text-xs opacity-50">
                {extractTime(chat.createdAt)}
              </time>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-0 left-0 flex h-24 w-full bg-white p-2">
        <textarea
          className="flex-[4] focus:outline-none"
          placeholder="메세지를 입력해주세요"
          onChange={handleText}
          onKeyDown={handleKeyDown}
          value={text}
        />
        <div className="flex flex-[1] items-center justify-center">
          <button
            type="submit"
            className="btn btn-info border-blue-500 bg-blue-500 text-white"
            disabled={text.trim().length === 0}
          >
            전송
          </button>
        </div>
      </div>
    </form>
  );
}

const extractTime = (date: string) => {
  const timePart = date.split("T")[1]; // "13:31:47.1590463"
  const [hours, minutes] = timePart.split(":"); // ["13", "31"]
  return `${hours}:${minutes}`;
};
