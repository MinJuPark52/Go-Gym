import MyPageNav from "@/components/MyProfile/MyPageNav";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex justify-center">
      <div className="flex justify-center w-[75%] gap-12">
        <MyPageNav />
        {children}
      </div>
    </div>
  );
}
