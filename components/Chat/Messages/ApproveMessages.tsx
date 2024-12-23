interface Props {
  createdAt: string;
  nickname: string;
  content: string;
  send: boolean;
  profileImageUrl?: string;
  counterpartyNickname: string;
  safePaymentId: string;
  counterpartyProfileImageUrl: string;
  complete: (safePaymentId: string) => void;
  cancel: (safePaymentId: string) => void;
}

export default function ApprovetMessages({
  createdAt,
  nickname,
  counterpartyNickname,
  safePaymentId,
  send,
  complete,
  cancel,
}: Props) {
  return (
    <>
      {send ? (
        <div className="mb-2 ml-auto mr-auto mt-4 w-[80%]" key={createdAt}>
          <div className="w-full rounded-lg bg-gray-400 bg-opacity-20 p-4 text-black">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg">
              <div>
                <div>
                  <p className="text-2xl">알림📢 </p>
                  <p>{counterpartyNickname} 님!</p>
                </div>
                <p>
                  안전결제를 승인했습니다. 구매확정 혹은 결제취소를 해주세요.
                </p>
              </div>
              <div className="flex gap-8">
                <button
                  className="btn bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => complete(safePaymentId)}
                >
                  구매 확정
                </button>
                <button
                  className="btn bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => cancel(safePaymentId)}
                >
                  결제 취소
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-2 ml-auto mr-auto mt-4 w-[80%]">
          <div className="w-full rounded-lg bg-gray-400 bg-opacity-20 p-4 text-gray-600">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg">
              <div>
                <div>
                  <p className="text-2xl">알림📢 </p>
                  <p>{nickname} 님!</p>
                </div>
                <p>{counterpartyNickname}님이 안전결제를 승인했습니다.</p>
              </div>
              <div className="flex gap-8">
                <button
                  className="btn bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => cancel(safePaymentId)}
                >
                  결제 취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
