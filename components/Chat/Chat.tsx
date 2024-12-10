'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import profile from '@/public/default_profile.png';
import useWebSocketStore from '@/store/useSocketStore';
import DefaultProfile from '../UI/DefaultProfile';
import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

interface props {
  chatRoomId: string;
  onSendMessage: ({
    chatRoomId,
    senderId,
    content,
  }: {
    chatRoomId: string;
    senderId: string;
    content: string;
  }) => void;
}

export default function Chat({ chatRoomId, onSendMessage }: props) {
  const [text, setText] = useState('');
  const { messages, setAgoMessage } = useWebSocketStore();

  // const { data: agoMessage } = useQuery({
  //   queryKey: ['agoMessage', chatRoomId],
  //   queryFn: async () => await axiosInstance.get(`/api/chatroom/${chatRoomId}`),
  //   staleTime: 10000,
  // });

  // useEffect(() => {
  //   if (agoMessage) {
  //     setAgoMessage(agoMessage.data);
  //   }
  // }, [agoMessage]);

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (text.trim().length === 0) {
      return;
    }
    //senderId랑 chatRoomId 1번 고정
    onSendMessage({ chatRoomId: '1', senderId: '1', content: text });
    setText('');
  };

  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  const buttonStyle = text.trim().length ? 'bg-blue-300' : 'bg-gray-300';

  return (
    <form
      onSubmit={handleSubmitMessage}
      className=" relative flex flex-col w-[70%] h-[100%] p-4 bg-blue-200 bg-opacity-40"
    >
      <div className=" flex flex-col h-[calc(100%-10rem)] p-2 overflow-y-auto scrollbar-hide">
        {/* 상대방 채팅 */}
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <DefaultProfile width="10" />
          </div>
          <div className="chat-header opacity-50">전민혁</div>
          <div className="chat-bubble bg-white text-gray-600">안녕하세요</div>
          <div className="chat-footer opacity-50">Deliverd</div>
        </div>
        {/* 내채팅 */}
        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <div className="chat-header">
            Anakin
            <time className="text-xs opacity-50">12:46</time>
          </div>
          <div className="chat-bubble bg-blue-500 text-white">I hate you!</div>
          <div className="chat-footer opacity-50">Seen at 12:46</div>
        </div>

        {/* 채팅 데이터 받아오면 위에 코드로 교체 예정 */}
        {messages.map((chat) => (
          <div
            className=" flex items-center gap-4 ml-auto"
            key={chat.createdAt}
          >
            <div className=" flex justify-center items-center p-2 rounded-xl bg-blue-200">
              <p className=" text-base">{chat.content}</p>
            </div>
            <Image
              src={profile}
              alt="profile"
              width={40}
              className="cursor-pointer"
              priority
            />
          </div>
        ))}
      </div>
      <div className=" flex absolute bottom-0 left-0 w-full h-40 bg-white p-2">
        <textarea
          className=" flex-[4] focus:outline-none"
          placeholder="메세지를 입력해주세요"
          onChange={handleText}
          onKeyDown={handleKeyDown}
          value={text}
        />
        <div className=" flex flex-[1] justify-center items-center">
          <button
            type="submit"
            className="btn btn-info bg-blue-500 border-blue-500 text-white"
            disabled={text.trim().length === 0}
          >
            전송
          </button>
        </div>
      </div>
    </form>
  );
}
