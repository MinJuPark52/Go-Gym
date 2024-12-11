import Image from "next/image";
import profile from "@/public/default_profile.png";
import useTimeAgo from "@/hooks/useTimeAgo";

interface chatListProps {
  counterpartyNickname: string;
  lastMessage: string;
  chatRoomId: string;
  lastMessageAt: string;
  onClickChatRoom: (chatRoomId: string) => void;
}

export default function ChatList({
  counterpartyNickname,
  chatRoomId,
  onClickChatRoom,
  lastMessage,
  lastMessageAt,
}: chatListProps) {
  const timeago = useTimeAgo(lastMessageAt);

  return (
    <div
      onClick={() => onClickChatRoom(chatRoomId)}
      className="flex h-[20%] cursor-pointer flex-col justify-center pl-2 pr-2 transition-all hover:bg-gray-200"
    >
      <div className="flex flex-col gap-2">
        <p className="text-bold text-sm font-bold text-gray-400">
          {counterpartyNickname}
        </p>
        <div className="flex items-center gap-4">
          <Image
            src={profile}
            alt="profile"
            width={40}
            className="cursor-pointer"
            priority
          />

          <p className="text-xl">{lastMessage}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-bold text-sm font-bold text-gray-400">{timeago}</p>
      </div>
    </div>
  );
}
