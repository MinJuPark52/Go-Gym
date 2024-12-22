import GympayBox from "@/components/MyProfile/GympayBox";
import PayHistory from "@/components/MyProfile/PayHistory";

export default function PayHistoryPage() {
  return (
    <div className="flex justify-center">
      <div className="ml-auto mr-auto flex w-[660px] flex-col gap-12">
        <GympayBox />
        <PayHistory />
      </div>
    </div>
  );
}
