import Image from "next/image";
import profile from "@/public/default_profile.png";
import useTimeAgo from "@/hooks/useTimeAgo";

interface chatListProps {
  counterpartyNickname: string;
  lastMessage: string;
  lastMessageAt: string;
}

export default function ChatList({
  counterpartyNickname,
  lastMessage,
  lastMessageAt,
}: chatListProps) {
  const timeago = useTimeAgo(lastMessageAt);

  return (
    <div className="flex flex-col justify-center h-[20%] pl-2 pr-2 hover:bg-gray-200 transition-all cursor-pointer">
      <div className="flex flex-col gap-2">
        <p className="text-bold text-gray-400 text-sm font-bold">
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
        <p className="text-bold text-gray-400 text-sm font-bold">{timeago}</p>
      </div>
    </div>
  );
}
