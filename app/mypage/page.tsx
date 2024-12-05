import ChangeProfile from '@/components/MyProfile/Profile';
import GympayBox from '@/components/MyProfile/GympayBox';

export default function MyPage() {
  return (
    <div className=" flex justify-center min-w-[700px]">
      <div className=" flex flex-col gap-12">
        <ChangeProfile />
        <GympayBox />
      </div>
    </div>
  );
}
