"use client";

import useTimeAgo from "@/hooks/useTimeAgo";
import { IoTrashBinOutline } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import useUserStore from "@/store/useUserStore";
import ProfileImage from "../UI/ProfileImage";
import DefaultProfile from "../UI/DefaultProfile";

interface chatListProps {
  counterpartyNickname: string;
  lastMessage: string;
  chatRoomId: string;
  lastMessageAt: string;
  counterpartyId: string;
  counterpartyProfileImageUrl: string;
  onClickChatRoom: (
    chatRoomId: string,
    counterpartyNickname: string,
    counterpartyId: string,
    counterpartyProfileImageUrl: string,
  ) => void;
  onCloseModal: () => void;
}

export default function ChatList({
  counterpartyId,
  counterpartyNickname,
  chatRoomId,
  onClickChatRoom,
  lastMessage,
  lastMessageAt,
  counterpartyProfileImageUrl,

  onCloseModal,
}: chatListProps) {
  const { user } = useUserStore();
  const timeago = useTimeAgo(lastMessageAt);

  const handleDelete = () => {
    const ans = confirm("이 채팅방을 삭제하시겠습니까?");
    if (ans) {
      mutate();
    }
  };

  //채팅방 삭제하기
  const { mutate } = useMutation({
    mutationKey: ["chatList", chatRoomId],
    mutationFn: async () =>
      await axiosInstance.delete(`/api/chatroom/${chatRoomId}`),
    onSuccess: () => {
      alert("채팅방을 삭제했습니다.");
    },
  });

  return (
    <div className="flex h-[20%] flex-col justify-center pl-2 pr-2 transition-all hover:bg-gray-200">
      <IoTrashBinOutline
        className="ml-auto cursor-pointer text-xl text-red-400 transition-all hover:text-3xl"
        onClick={handleDelete}
      />
      <div
        onClick={() => {
          onClickChatRoom(
            chatRoomId,
            counterpartyNickname,
            counterpartyId,
            counterpartyProfileImageUrl,
          );
          onCloseModal();
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="text-bold text-sm font-bold text-gray-400">
              {counterpartyNickname}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="avatar h-10 w-10 overflow-hidden rounded-full">
              {user?.profileImageUrl ? (
                <ProfileImage src={counterpartyProfileImageUrl} />
              ) : (
                <DefaultProfile width="120" />
              )}
            </div>

            {lastMessage && (
              <p className="text-sm font-bold text-gray-600">
                {lastMessage.slice(0, 9) +
                  `${lastMessage.length > 9 ? "..." : ""}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-bold text-sm font-bold text-gray-400">{timeago}</p>
        </div>
      </div>
    </div>
  );
}
