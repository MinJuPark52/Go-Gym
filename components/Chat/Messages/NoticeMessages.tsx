import DefaultProfile from "@/components/UI/DefaultProfile";
import ProfileImage from "@/components/UI/ProfileImage";

interface Props {
  createdAt: string;
  nickname: string;
  content: string;
  send: boolean;
  profileImageUrl?: string;
  counterpartyNickname: string;
  counterpartyProfileImageUrl: string;
}

export default function NoticeMessages({
  createdAt,
  nickname,
  counterpartyNickname,
  counterpartyProfileImageUrl,
  profileImageUrl,
  send,
  content,
}: Props) {
  return (
    <>
      {send ? (
        <div className="chat chat-end" key={createdAt}>
          <div className="avatar chat-image overflow-hidden rounded-full">
            {profileImageUrl ? (
              <ProfileImage src={profileImageUrl} />
            ) : (
              <DefaultProfile width="10" />
            )}
          </div>

          <div className="chat-header mb-1">{nickname}</div>
          <div className="chat-bubble bg-white text-black">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white">
              <div>
                <p>
                  <span className="text-2xl">알림📢 </span>
                  {counterpartyNickname} 님!
                </p>
                <p>
                  {nickname}님 {content}
                </p>
              </div>
            </div>
          </div>

          <time className="mt-1 text-xs opacity-50">
            {extractTime(createdAt)}
          </time>
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
          <div className="chat-header mb-1 opacity-50">
            {counterpartyNickname}
          </div>
          <div className="chat-bubble bg-white text-gray-600">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white">
              <div>
                <p>
                  <span className="text-2xl">알림📢 </span>
                  {nickname} !
                </p>
                <p>
                  {counterpartyNickname}님이 {content}
                </p>
              </div>
            </div>
          </div>
          <div></div>
          <time className="ml-2 mt-1 text-xs opacity-50">
            {extractTime(createdAt)}
          </time>
        </div>
      )}
    </>
  );
}

const extractTime = (date: string) => {
  const timePart = date.split("T")[1]; // "13:31:47.1590463"
  const [hours, minutes] = timePart.split(":"); // ["13", "31"]
  return `${hours}:${minutes}`;
};
