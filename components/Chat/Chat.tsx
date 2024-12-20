"use client";
import { useEffect, useRef, useState } from "react";
import useWebSocketStore from "@/store/useSocketStore";
import DefaultProfile from "../UI/DefaultProfile";
import axiosInstance from "@/api/axiosInstance";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import ChatPostDetail from "./ChatPostDetail";
import useUserStore from "@/store/useUserStore";
import ProfileImage from "../UI/ProfileImage";
import axios from "axios";

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
  const { connect, messages, setAgoMessage, disconnect, initMessages } =
    useWebSocketStore();
  const { user } = useUserStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["agomessages"],
    queryFn: async ({ pageParam = 0 }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    getPreviousPageParam: (_, pages) => {
      return pages.length === 1 ? undefined : pages.length - 2;
    },
    initialPageParam: 0,
    enabled: !!chatRoomId,
  });

  const chatLeave = async (createdAt: string) => {
    await axiosInstance.post(`/api/chatroom/${chatRoomId}/leave`, {
      leaveAt: createdAt,
    });
  };

  useEffect(() => {
    // 숫자 부분만 chatroomid적어주면 됨
    if (chatRoomId) {
      connect(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/ws",
        chatRoomId,
        (message) => {
          console.log("New message:", message.body);
        },
      );
    }

    return () => {
      if (chatRoomId && messages) {
        console.log(messages);
        (async () => {
          const latestCreatedAt = messages[messages.length - 1].createdAt
            .slice(0, 19)
            .replace("T", " ");
          await chatLeave(latestCreatedAt);
          disconnect();
        })();
      } else {
        disconnect();
      }
    };
  }, [chatRoomId]);

  //무한스크롤 구현

  useEffect(() => {
    if (data && hasPreviousPage) {
      const allMessages = data.pages.flatMap((page) => page.content);
      setAgoMessage(allMessages.reverse()); // Zustand 상태 업데이트
      console.log(data);
    } else if (data && !hasPreviousPage) {
      initMessages();
      const allMessages = data.pages.flatMap((page) => page.content);
      setAgoMessage(allMessages.reverse());
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    setText("");
  };

  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  const { mutate: approve } = useMutation({
    mutationKey: ["approve"],
    mutationFn: async () =>
      await axiosInstance.put(
        `/api/safe-payments/${localStorage.getItem("safePaymentId")}/approve`,
      ),
    onSuccess: () => alert("승인"),
  });
  const { mutate: reject } = useMutation({
    mutationKey: ["reject"],
    mutationFn: async () =>
      await axiosInstance.put(
        `/api/safe-payments/${localStorage.getItem("safePaymentId")}/reject`,
      ),
    onSuccess: () => alert("거절"),
  });
  const { mutate: cancel } = useMutation({
    mutationKey: ["cancel"],
    mutationFn: async () =>
      await axiosInstance.put(
        `/api/safe-payments/${localStorage.getItem("safePaymentId")}/cancel`,
      ),
    onSuccess: () => alert("취소"),
  });
  const { mutate: complete } = useMutation({
    mutationKey: ["complete"],
    mutationFn: async () =>
      await axiosInstance.put(
        `/api/safe-payments/${localStorage.getItem("safePaymentId")}/complete`,
      ),
    onSuccess: () => alert("완료"),
  });
  if (isPending) {
    return (
      <div className="relative flex h-[100%] w-[100%] flex-col border-r-2 bg-blue-200 bg-opacity-40 p-4">
        <div className="flex h-[calc(100%-10rem)] items-center justify-center">
          {/* <span className="loading loading-ring loading-lg"></span> */}
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
      className="relative flex h-[100%] w-[100%] flex-col bg-blue-200 bg-opacity-40 p-4"
    >
      <ChatPostDetail onOpenModal={onOpenModal} chatRoomId={chatRoomId} />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex h-[calc(100%-6rem)] flex-col overflow-y-auto p-2 pt-36 scrollbar-hide sm:pt-32"
      >
        {messages.map((chat) => {
          if (
            chat.MessageType === "USER_SEND" &&
            chat.senderId.toString() === user?.memberId
          ) {
            return (
              <div className="chat chat-end" key={chat.createdAt}>
                <div className="avatar chat-image">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">{user.nickname}</div>
                <div className="chat-bubble bg-blue-500 text-white">
                  {chat.content}
                </div>

                <time className="mt-1 text-xs opacity-50">
                  {extractTime(chat.createdAt)}
                </time>
              </div>
            );
          } else if (
            chat.MessageType === "USER_SEND" &&
            chat.senderId.toString() !== user?.memberId
          ) {
            return (
              <div className="chat chat-start" key={chat.createdAt}>
                <div className="avatar chat-image overflow-hidden rounded-full">
                  {user?.profileImageUrl ? (
                    <ProfileImage src={user?.profileImageUrl} />
                  ) : (
                    <DefaultProfile width="10" />
                  )}
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
            );
          } else if (
            chat.MessageType === "SYSTEM_SAFE_PAYMENT_REQUEST" &&
            chat.senderId.toString() === user?.memberId
          ) {
            return (
              <div className="chat chat-end" key={chat.createdAt}>
                <div className="avatar chat-image">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">{user?.nickname}</div>
                <div className="chat-bubble bg-blue-500 text-white">
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white">
                    <div>
                      <p>
                        <span className="text-2xl">알림📢 </span>
                        {counterpartyNickname} !
                      </p>
                      <p>{user.nickname} 님이 안전결제를 신청했습니다.</p>
                    </div>
                    <div className="flex gap-8">
                      <button className="btn bg-blue-500 text-white">
                        승인
                      </button>
                      <button className="btn bg-blue-500 text-white">
                        거절
                      </button>
                    </div>
                  </div>
                </div>

                <time className="mt-1 text-xs opacity-50">
                  {extractTime(chat.createdAt)}
                </time>
              </div>
            );
          } else if (
            chat.MessageType === "SYSTEM_SAFE_PAYMENT_REQUEST" &&
            chat.senderId.toString() !== user?.memberId
          ) {
            return (
              <div className="chat chat-end" key={chat.createdAt}>
                <div className="avatar chat-image">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">{user?.nickname}</div>
                <div className="chat-bubble bg-blue-500 text-white"></div>
                <div className="chat chat-start" key={chat.createdAt}>
                  <div className="avatar chat-image overflow-hidden rounded-full">
                    {user?.profileImageUrl ? (
                      <ProfileImage src={user?.profileImageUrl} />
                    ) : (
                      <DefaultProfile width="10" />
                    )}
                  </div>
                  <div className="chat-header mb-1 opacity-50">
                    {counterpartyNickname}
                  </div>
                  <div className="chat-bubble bg-white text-gray-600">
                    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white">
                      <div>
                        <p>
                          <span className="text-2xl">알림📢 </span>
                          {user.nickname} !
                        </p>
                        <p>
                          {counterpartyNickname}님이 안전결제를 신청했습니다.
                        </p>
                      </div>
                      <div className="flex gap-8">
                        <button
                          className="btn bg-blue-500 text-white"
                          onClick={() => approve()}
                        >
                          승인
                        </button>
                        <button
                          className="btn bg-blue-500 text-white"
                          onClick={() => reject()}
                        >
                          거절
                        </button>
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <time className="ml-2 mt-1 text-xs opacity-50">
                    {extractTime(chat.createdAt)}
                  </time>
                </div>
                <time className="mt-1 text-xs opacity-50">
                  {extractTime(chat.createdAt)}
                </time>
              </div>
            );
          } else if (
            chat.MessageType === "SYSTEM_SAFE_PAYMENT_APPROVE" &&
            chat.senderId.toString() === user?.memberId
          ) {
            return (
              <div className="chat chat-end" key={chat.createdAt}>
                <div className="avatar chat-image">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">{user?.nickname}</div>
                <div className="chat-bubble bg-blue-500 text-white">
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white">
                    <div>
                      <p>
                        <span className="text-2xl">알림📢 </span>
                        {counterpartyNickname} !
                      </p>
                      <p>{user.nickname} 님이 안전결제를 승인했습니다.</p>
                    </div>
                    <div className="flex gap-8">
                      <button
                        className="btn bg-blue-500 text-white"
                        onClick={() => cancel()}
                      >
                        결제 취소
                      </button>
                    </div>
                  </div>
                </div>

                <time className="mt-1 text-xs opacity-50">
                  {extractTime(chat.createdAt)}
                </time>
              </div>
            );
          } else if (
            chat.MessageType === "SYSTEM_SAFE_PAYMENT_APPROVE" &&
            chat.senderId.toString() !== user?.memberId
          ) {
            return (
              <div className="chat chat-end" key={chat.createdAt}>
                <div className="avatar chat-image">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">{user?.nickname}</div>
                <div className="chat-bubble bg-blue-500 text-white"></div>
                <div className="chat chat-start" key={chat.createdAt}>
                  <div className="avatar chat-image overflow-hidden rounded-full">
                    {user?.profileImageUrl ? (
                      <ProfileImage src={user?.profileImageUrl} />
                    ) : (
                      <DefaultProfile width="10" />
                    )}
                  </div>
                  <div className="chat-header mb-1 opacity-50">
                    {counterpartyNickname}
                  </div>
                  <div className="chat-bubble bg-white text-gray-600">
                    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white">
                      <div>
                        <p>
                          <span className="text-2xl">알림📢 </span>
                          {user.nickname} !
                        </p>
                        <p>
                          {counterpartyNickname}님이 안전결제를 승인했습니다.
                        </p>
                      </div>
                      <div className="flex gap-8">
                        <button
                          className="btn bg-blue-500 text-white"
                          onClick={() => complete()}
                        >
                          구매 확정
                        </button>
                        <button
                          className="btn bg-blue-500 text-white"
                          onClick={() => cancel()}
                        >
                          결제 취소
                        </button>
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <time className="ml-2 mt-1 text-xs opacity-50">
                    {extractTime(chat.createdAt)}
                  </time>
                </div>
                <time className="mt-1 text-xs opacity-50">
                  {extractTime(chat.createdAt)}
                </time>
              </div>
            );
          } else if (chat.senderId.toString() === user?.memberId) {
            return (
              <div className="chat chat-end" key={chat.createdAt}>
                <div className="avatar chat-image">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">{user.nickname}</div>
                <div className="chat-bubble bg-blue-500 text-white">
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white">
                    <div>
                      <p>
                        <span className="text-2xl">알림📢 </span>
                        {counterpartyNickname} !
                      </p>
                      <p>
                        {user.name}님 {chat.content}
                      </p>
                    </div>
                  </div>
                </div>

                <time className="mt-1 text-xs opacity-50">
                  {extractTime(chat.createdAt)}
                </time>
              </div>
            );
          } else if (chat.senderId.toString() !== user?.memberId) {
            return (
              <div className="chat chat-start" key={chat.createdAt}>
                <div className="avatar chat-image overflow-hidden rounded-full">
                  {user?.profileImageUrl ? (
                    <ProfileImage src={user?.profileImageUrl} />
                  ) : (
                    <DefaultProfile width="10" />
                  )}
                </div>
                <div className="chat-header mb-1 opacity-50">
                  {counterpartyNickname}
                </div>
                <div className="chat-bubble bg-white text-gray-600">
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white">
                    <div>
                      <p>
                        <span className="text-2xl">알림📢 </span>
                        {user.nickname} !
                      </p>
                      <p>
                        {counterpartyNickname}님이 {chat.content}
                      </p>
                    </div>
                  </div>
                </div>
                <div></div>
                <time className="ml-2 mt-1 text-xs opacity-50">
                  {extractTime(chat.createdAt)}
                </time>
              </div>
            );
          }
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
