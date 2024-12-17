"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ChatList from "./ChatList";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import useWebSocketStore from "@/store/useSocketStore";
import axiosInstance from "@/api/axiosInstance";

interface ChatItem {
  chatRoomId: string;
  createdAt: string;
  postId: string;
  counterpartyId: string;
  counterpartyNickname: string;
  unreadMessageCount: string;
  lastMessage: string;
  lastMessageAt: string;
  postAuthorActive: boolean;
  requestorActive: boolean;
}

export default function ChatRoom() {
  const [currentChatRoom, setCurrentChatRoom] = useState("");
  const { messages, sendMessage } = useWebSocketStore();
  //채팅방 목록 가져오기
  const { data: chatList, isSuccess: listSuccess } = useQuery<ChatItem[]>({
    queryKey: ["chatroom"],
    queryFn: async () => {
      const response: { content: ChatItem[] } = await axiosInstance.get(
        "/api/chatroom?page=0&size=5",
      );
      return response.content;
    },
    staleTime: 0,
    placeholderData: [],
  });

  useEffect(() => {
    console.log(chatList);
  }, [chatList]);

  const sortedData =
    listSuccess && chatList?.length
      ? [...chatList].sort((a, b) => {
          const dateA = new Date(a.lastMessageAt).getTime();
          const dateB = new Date(b.lastMessageAt).getTime();
          return dateB - dateA;
        })
      : [];

  const handleClickChatRoom = (chatRoomId: string) => {
    setCurrentChatRoom(chatRoomId);
    console.log(currentChatRoom);
  };

  const handleSendMessage = ({
    chatRoomId,
    content,
  }: {
    chatRoomId: string;
    content: string;
  }) => {
    //송신 경로 등록
    sendMessage(
      "/app/chatroom/message",
      JSON.stringify({
        chatRoomId,
        content,
      }),
    );
    console.log(messages);
  };

  return (
    <div className="flex h-[100%] w-[75%] border-l border-gray-400">
      <div className="flex h-[100%] w-[30%] flex-col border-r border-gray-400">
        {sortedData.map((list) => (
          <ChatList
            key={list.chatRoomId}
            chatRoomId={list.chatRoomId}
            counterpartyNickname={list.counterpartyNickname}
            lastMessage={list.lastMessage}
            lastMessageAt={list.lastMessageAt}
            onClickChatRoom={handleClickChatRoom}
          />
        ))}
      </div>
      <Chat chatRoomId={currentChatRoom} onSendMessage={handleSendMessage} />
    </div>
  );
}
