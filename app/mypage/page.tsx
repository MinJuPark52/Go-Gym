import ChangeProfile from '@/components/MyProfile/Profile';
import GympayBox from '@/components/MyProfile/GympayBox';

export default function MyPage() {
  return (
    <div className=" flex justify-center">
      <div className=" flex flex-col w-[75%] gap-12">
        <ChangeProfile />
        <GympayBox />
        <div>내가 작성한 게시글</div>
        <div>내가 찜한 게시글</div>
        <div>최근 본 게시글</div>
        <div>구매 목록 조회</div>
        <div>판매 목록 조회</div>
      </div>
    </div>
  );
}
