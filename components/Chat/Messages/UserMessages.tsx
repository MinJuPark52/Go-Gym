import DefaultProfile from "@/components/UI/DefaultProfile";
import ProfileImage from "@/components/UI/ProfileImage";

interface Props {
  createdAt: string;
  nickname: string;
  counterpartyNickname: string;
  content: string;
  send: boolean;
  profileImageUrl?: string;
  counterpartyProfileImageUrl: string;
}

export default function UserMessages({
  createdAt,
  nickname,
  counterpartyNickname,
  content,
  send,
  profileImageUrl,
  counterpartyProfileImageUrl,
}: Props) {
  return send ? (
    <div className="chat chat-end" key={createdAt}>
      <div className="avatar chat-image overflow-hidden rounded-full">
        {profileImageUrl ? (
          <ProfileImage src={profileImageUrl} />
        ) : (
          <DefaultProfile width="10" />
        )}
      </div>

      <div className="chat-header mb-1">{nickname}</div>
      <div className="chat-bubble bg-blue-500 text-white">{content}</div>

      <time className="mt-1 text-xs opacity-50">{extractTime(createdAt)}</time>
    </div>
  ) : (
    <div className="chat chat-start" key={createdAt}>
      <div className="avatar chat-image overflow-hidden rounded-full">
        {counterpartyProfileImageUrl ? (
          <ProfileImage src={counterpartyProfileImageUrl} />
        ) : (
          <DefaultProfile width="10" />
        )}
      </div>
      <div className="chat-header mb-1 opacity-50">{counterpartyNickname}</div>
      <div className="chat-bubble bg-white text-gray-600">{content}</div>
      <div></div>
      <time className="ml-2 mt-1 text-xs opacity-50">
        {extractTime(createdAt)}
      </time>
    </div>
  );
}

const extractTime = (date: string) => {
  const timePart = date.split("T")[1]; // "13:31:47.1590463"
  const [hours, minutes] = timePart.split(":"); // ["13", "31"]
  return `${hours}:${minutes}`;
};
