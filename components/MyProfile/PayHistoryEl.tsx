interface propsType {
  historyId: string;
  createdAt: string;
  amount: string;
  transferType: string;
}

export default function PayHistoryEl({
  historyId,
  createdAt,
  amount,
  transferType,
}: propsType) {
  let content = "짐페이 충전";

  if ((transferType = "DEPOSIT")) {
    content = "안전결제 입금";
  } else if ((transferType = "WITHDRAWAL")) {
    content = "안전결제 출금";
  } else if ((transferType = "CHARGE")) {
    content = "짐페이 충전";
  } else if ((transferType = "CANCEL_DEPOSIT")) {
    content = "안전결제 입금 취소";
  } else if ((transferType = "CANCEL_WITHDRAWAL")) {
    content = "안전결제 출금 취소";
  } else if ((transferType = "CANCEL_CHARGE")) {
    content = "짐페이 충전 취소";
  }

  return (
    <div
      key={historyId}
      className="flex justify-between border-b-2 border-gray-400 p-4"
    >
      <div>
        <p>{content}</p>
        <p>{createdAt.slice(0, 16).replace("T", " ")}</p>
      </div>
      <p>{formatNumber(amount.toString())} 원</p>
    </div>
  );
}
const formatNumber = (input: string) => {
  const numericValue = input.replace(/,/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
