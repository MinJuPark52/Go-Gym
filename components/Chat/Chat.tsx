"use client";
import { useEffect, useRef, useState } from "react";
import useWebSocketStore from "@/store/useSocketStore";
import axiosInstance from "@/api/axiosInstance";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import ChatPostDetail from "./ChatPostDetail";
import useUserStore from "@/store/useUserStore";
import UserMessages from "./Messages/UserMessages";
import RequestMessages from "./Messages/RequestMessages";
import ApprovetMessages from "./Messages/ApproveMessages";
import NoticeMessages from "./Messages/NoticeMessages";

interface PostType {
  postId: string;
  authorNickname: string;
  authorId: number;
  amount: string;
  createdAt: string;
  gymName: string;
  imageUrl1: string;
  postType: string;
  expirationDate: string;
  status: string;
  title: string;
  wishCount: number;
  isWished: boolean;
  content: string;
  imageUrl: string;
}

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
  counterpartyProfileImageUrl: string;
  counterpartyId: string;
  onOpenModal: () => void;
}

export default function Chat({
  chatRoomId,
  onSendMessage,
  counterpartyNickname,
  counterpartyProfileImageUrl,
  onOpenModal,
}: props) {
  const [text, setText] = useState("");
  const [postValue, setPostValue] = useState({
    postId: "",
    title: "",
    amount: "",
    status: "",
  });
  const [memberId, setMemberId] = useState("");
  const { connect, messages, setAgoMessage, disconnect, initMessages } =
    useWebSocketStore();
  const { user } = useUserStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  //과거 메세지 무한스크롤
  const {
    data,
    fetchNextPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ["agomessages", chatRoomId],
    queryFn: async ({ pageParam = 0 }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: { messages: any; postStatus: string } =
        await axiosInstance.get(`/api/chatroom/${chatRoomId}/messages`, {
          params: { page: pageParam, size: 6 },
        });

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

  //게시글 정보, 게시글 상태반환
  const { data: extraData } = useQuery({
    queryKey: ["extraData", chatRoomId],
    queryFn: async () => {
      const res: { posts: PostType } = await axiosInstance.get(
        `/api/chatroom/${chatRoomId}/messages`,
        {
          params: { page: 0, size: 6 }, // 첫 번째 페이지 데이터 요청
        },
      );
      return res.posts; // 필요한 데이터만 반환
    },
    enabled: !!chatRoomId,
  });

  // const chatLeave = async (createdAt: string) => {
  //   await axiosInstance.post(`/api/chatroom/${chatRoomId}/leave`, {
  //     leaveAt: createdAt,
  //   });
  // };

  useEffect(() => {
    console.log(extraData);
    if (extraData) {
      setPostValue({
        postId: extraData.postId,
        title: extraData.title,
        status: extraData.status,
        amount: extraData.amount,
      });
    }
  }, [extraData]);

  useEffect(() => {
    if (user?.memberId) {
      setMemberId(user.memberId); // 상태를 안전하게 설정
    }
  }, [user]);

  useEffect(() => {
    // 숫자 부분만 chatroomid적어주면 됨
    if (chatRoomId) {
      connect("/backend" + "/ws", chatRoomId, (message) => {
        console.log("New message:", message.body);
      });
    }

    return () => disconnect();
    // if (chatRoomId && messages) {
    //   console.log(messages);
    //   (async () => {
    //     const latestCreatedAt = messages[messages.length - 1].createdAt
    //       .slice(0, 19)
    //       .replace("T", " ");
    //     await chatLeave(latestCreatedAt);
    //     disconnect();
    //   })();
    // } else {

    // }
  }, [chatRoomId]);

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
        scrollRef.current.scrollTop = 400; // 400픽셀 정도 밑으로 이동
      }
    }
  };

  // scrollTop == 현재위치, 맨밑으로 이동중
  useEffect(() => {
    if (scrollRef.current && scrollRef.current.scrollTop !== 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    console.log(messages);
  }, [messages]);

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

  //safe-payments-Id를 따로 받아서 처리
  const { mutate: approve } = useMutation({
    mutationKey: ["approve"],
    mutationFn: async () =>
      await axiosInstance.put(
        `/api/chat-rooms/${chatRoomId}/safe-payments/3/approve`,
      ),
    onSuccess: () => alert("승인"),
  });
  const { mutate: reject } = useMutation({
    mutationKey: ["reject"],
    mutationFn: async () =>
      await axiosInstance.put(
        `/api/chat-rooms/${chatRoomId}/safe-payments/3/reject`,
      ),
    onSuccess: () => alert("거절"),
  });
  const { mutate: cancel } = useMutation({
    mutationKey: ["cancel"],
    mutationFn: async () =>
      await axiosInstance.put(
        `/api/chat-rooms/${chatRoomId}/safe-payments/4/cancel`,
      ),
    onSuccess: () => alert("취소"),
  });
  const { mutate: complete } = useMutation({
    mutationKey: ["complete"],
    mutationFn: async () =>
      await axiosInstance.put(
        `/api/chat-rooms/${chatRoomId}/safe-payments/4/complete`,
      ),
    onSuccess: () => alert("완료"),
  });
  if (isPending) {
    return (
      <div className="relative flex h-[100%] w-[100%] flex-col border-r-2 bg-blue-200 bg-opacity-40 p-4">
        <button className="btn btn-active sm:hidden" onClick={onOpenModal}>
          채팅방 목록
        </button>
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
      className="relative flex h-[100%] w-[100%] flex-col bg-blue-200 bg-opacity-40 p-4"
    >
      <ChatPostDetail
        postId={postValue.postId}
        title={postValue.title}
        amount={postValue.amount}
        postStatus={postValue.status || "PENDING"}
        onOpenModal={onOpenModal}
        chatRoomId={chatRoomId}
      />
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex h-[calc(100%-6rem)] flex-col overflow-y-auto p-2 pt-36 scrollbar-hide sm:pt-32"
      >
        {messages &&
          messages.map((chat) => {
            if (
              chat.messageType === "TEXT_ONLY" &&
              chat.senderId.toString() === memberId.toString()
            ) {
              return (
                <UserMessages
                  key={chat.createdAt}
                  createdAt={chat.createdAt}
                  nickname={user.nickname}
                  counterpartyNickname={counterpartyNickname}
                  counterpartyProfileImageUrl={counterpartyProfileImageUrl}
                  content={chat.content}
                  send={true}
                />
              );
            } else if (
              chat.messageType === "TEXT_ONLY" &&
              chat.senderId.toString() !== memberId.toString()
            ) {
              return (
                <UserMessages
                  key={chat.createdAt}
                  createdAt={chat.createdAt}
                  profileImageUrl={user.profileImageUrl || ""}
                  nickname={user.nickname}
                  counterpartyNickname={counterpartyNickname}
                  counterpartyProfileImageUrl={counterpartyProfileImageUrl}
                  content={chat.content}
                  send={false}
                />
              );
            } else if (
              chat.messageType === "SYSTEM_SAFE_PAYMENT_REQUEST" &&
              chat.senderId.toString() === memberId.toString()
            ) {
              return (
                <RequestMessages
                  key={chat.createdAt}
                  createdAt={chat.createdAt}
                  nickname={user.nickname}
                  counterpartyNickname={counterpartyNickname}
                  counterpartyProfileImageUrl={counterpartyProfileImageUrl}
                  content={chat.content}
                  approve={approve}
                  reject={reject}
                  send={true}
                />
              );
            } else if (
              chat.messageType === "SYSTEM_SAFE_PAYMENT_REQUEST" &&
              chat.senderId.toString() !== memberId.toString()
            ) {
              return (
                <RequestMessages
                  key={chat.createdAt}
                  createdAt={chat.createdAt}
                  nickname={user.nickname}
                  counterpartyNickname={counterpartyNickname}
                  counterpartyProfileImageUrl={counterpartyProfileImageUrl}
                  content={chat.content}
                  approve={approve}
                  reject={reject}
                  send={false}
                />
              );
            } else if (
              chat.messageType === "SYSTEM_SAFE_PAYMENT_APPROVAL" &&
              chat.senderId.toString() === memberId.toString()
            ) {
              return (
                <ApprovetMessages
                  key={chat.createdAt}
                  createdAt={chat.createdAt}
                  nickname={user.nickname}
                  counterpartyNickname={counterpartyNickname}
                  counterpartyProfileImageUrl={counterpartyProfileImageUrl}
                  content={chat.content}
                  complete={complete}
                  cancel={cancel}
                  send={true}
                />
              );
            } else if (
              chat.messageType === "SYSTEM_SAFE_PAYMENT_APPROVAL" &&
              chat.senderId.toString() !== memberId.toString()
            ) {
              return (
                <ApprovetMessages
                  key={chat.createdAt}
                  createdAt={chat.createdAt}
                  nickname={user.nickname}
                  counterpartyNickname={counterpartyNickname}
                  counterpartyProfileImageUrl={counterpartyProfileImageUrl}
                  content={chat.content}
                  complete={complete}
                  cancel={cancel}
                  send={false}
                />
              );
            } else if (chat.senderId.toString() === memberId.toString()) {
              return (
                <NoticeMessages
                  key={chat.createdAt}
                  createdAt={chat.createdAt}
                  nickname={user.nickname}
                  counterpartyNickname={counterpartyNickname}
                  counterpartyProfileImageUrl={counterpartyProfileImageUrl}
                  content={chat.content}
                  send={true}
                />
              );
            } else if (chat.senderId.toString() !== memberId.toString()) {
              return (
                <NoticeMessages
                  key={chat.createdAt}
                  createdAt={chat.createdAt}
                  nickname={user.nickname}
                  counterpartyNickname={counterpartyNickname}
                  counterpartyProfileImageUrl={counterpartyProfileImageUrl}
                  content={chat.content}
                  send={false}
                />
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
