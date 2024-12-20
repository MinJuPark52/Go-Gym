import Profile from "@/components/MyProfile/Profile";
import GympayBox from "@/components/MyProfile/GympayBox";

export default function MyPage() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-12">
        <Profile />
        <GympayBox />
      </div>
    </div>
  );
}
