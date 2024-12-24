interface Props {
  createdAt: string;
  nickname: string;
  content: string;
  send: boolean;
  profileImageUrl?: string;
  counterpartyNickname: string;
  counterpartyProfileImageUrl: string;
  safePaymentId: string;
  approve: (safePaymentId: string) => void;
  reject: (safePaymentId: string) => void;
}

export default function RequestMessages({
  createdAt,
  nickname,
  counterpartyNickname,
  safePaymentId,
  send,
  approve,
  reject,
}: Props) {
  return (
    <>
      {send ? (
        <div className="ml-auto mr-auto mt-4 w-[80%]" key={createdAt}>
          <div className="w-full rounded-lg bg-gray-400 bg-opacity-20 p-4 text-black">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg">
              <div>
                <div>
                  <p className="text-2xl">알림📢 </p>
                  <p>{counterpartyNickname} 님!</p>
                </div>
                <p>{nickname} 님에게 안전결제를 신청했습니다.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="ml-auto mr-auto mt-4 w-[80%]" key={createdAt}>
          <div className="w-full rounded-lg bg-gray-400 bg-opacity-20 p-4 text-black">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg">
              <div>
                <div>
                  <div className="text-2xl">알림📢 </div>
                  <p>{nickname} 님!</p>
                </div>
                <p>{counterpartyNickname}님이 안전결제를 신청했습니다.</p>
                <p>승인을 누르기 전 짐페이가 충분한지 확인해주세요 !</p>
              </div>
              <div className="flex gap-8">
                <button
                  className="btn bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => approve(safePaymentId)}
                >
                  승인
                </button>
                <button
                  className="btn bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => reject(safePaymentId)}
                >
                  거절
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
