export default function useTimeAgo(pastDate: string) {
  const now = new Date(); // 현재 시간
  const past = new Date(pastDate); // 주어진 날짜

  const diffInMilliseconds = now.getTime() - past.getTime(); // 두 날짜의 차이 (밀리초)
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000); // 차이를 분으로 변환
  const diffInHours = Math.floor(diffInMilliseconds / 3600000); // 차이를 시간으로 변환

  if (diffInMinutes < 60) {
    // 분 단위로 표현
    if (diffInMinutes < 1) {
      return '방금 전';
    }
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    // 시간 단위로 표현
    return `${diffInHours}시간 전`;
  } else {
    // 하루 이상 차이 나는 경우, 날짜로 표시
    const diffInDays = Math.floor(diffInMilliseconds / 86400000); // 차이를 일로 변환
    return `${diffInDays}일 전`;
  }
}
