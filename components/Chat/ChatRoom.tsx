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
  postId: number;
  counterpartyId: number;
  counterpartyNickname: string;
  unreadMessageCount: number;
  lastMessage: string;
  lastMessageAt: string;
}

export default function ChatRoom() {
  const [currentChatRoom, setCurrentChatRoom] = useState("");
  const { connect, messages, sendMessage, disconnect } = useWebSocketStore();
  //채팅방 목록 가져오기
  const { data: chatList, isSuccess: listSuccess } = useQuery<ChatItem[]>({
    queryKey: ["chatroom"],
    queryFn: async () =>
      (await axios.get("http://localhost:4000/chatList")).data,
    staleTime: 100000,
  });

  // useEffect(() => {
  //   // 숫자 부분만 chatroomid적어주면 됨
  //   connect('/chat' + '/ws', '1', (message) => {
  //     console.log('New message:', message.body);
  //   });

  //   return () => {
  //     disconnect();
  //   };
  // }, [connect, disconnect]);

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
    senderId,
    content,
  }: {
    chatRoomId: string;
    senderId: string;
    content: string;
  }) => {
    //송신 경로 등록
    sendMessage(
      "/app/chatroom/message",
      JSON.stringify({
        chatRoomId,
        senderId,
        content,
      }),
    );
    console.log(messages);
  };

  //게시물 상세보기에 채팅하기
  async function buttonClick() {
    const response = await axios.post("/chat/api/chatroom/2");
    console.log(response);
  }

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
        <div></div>
      </div>
      <Chat chatRoomId={currentChatRoom} onSendMessage={handleSendMessage} />
    </div>
  );
}
