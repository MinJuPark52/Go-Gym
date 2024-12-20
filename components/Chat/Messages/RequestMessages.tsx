import DefaultProfile from "@/components/UI/DefaultProfile";
import ProfileImage from "@/components/UI/ProfileImage";

interface Props {
  createdAt: string;
  nickname: string;
  content: string;
  send: boolean;
  profileImageUrl?: string;
  counterpartyNickname: string;
  approve: () => void;
  reject: () => void;
}

export default function RequestMessages({
  createdAt,
  nickname,
  counterpartyNickname,
  profileImageUrl,
  send,
  approve,
  reject,
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
          <div className="chat-bubble bg-blue-500 text-white">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white">
              <div>
                <p>
                  <span className="text-2xl">알림📢 </span>
                  {counterpartyNickname} !
                </p>
                <p>{nickname} 님이 안전결제를 신청했습니다.</p>
              </div>
              <div className="flex gap-8">
                <button className="btn bg-blue-500 text-white">승인</button>
                <button className="btn bg-blue-500 text-white">거절</button>
              </div>
            </div>
          </div>

          <time className="mt-1 text-xs opacity-50">
            {extractTime(createdAt)}
          </time>
        </div>
      ) : (
        <div className="chat chat-start" key={createdAt}>
          <div className="avatar chat-image">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
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
                <p>{counterpartyNickname}님이 안전결제를 신청했습니다.</p>
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
