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
  send,
  content,
}: Props) {
  return (
    <>
      {send ? (
        <div className="ml-auto mr-auto mt-4 w-[80%]" key={createdAt}>
          <div className="w-full rounded-lg bg-gray-400 bg-opacity-20 p-4 text-black">
            <div className="flex flex-col items-start justify-center gap-4 rounded-lg">
              <div>
                <div className="flex flex-col">
                  <p className="text-2xl">알림📢 </p>
                </div>
                <p>{nickname} 님!</p>
                <p>{content}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="ml-auto mr-auto mt-4 w-[80%]" key={createdAt}>
          <div className="w-full rounded-lg bg-gray-400 bg-opacity-20 p-4 text-black">
            <div className="flex flex-col items-start justify-center gap-4 rounded-lg">
              <div>
                <div className="flex flex-col">
                  <p className="text-2xl">알림📢 </p>
                </div>
                <p>{nickname} 님!</p>
                <p>{content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
