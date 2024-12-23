import MyPageNav from "@/components/MyProfile/MyPageNav";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex justify-center">
      <div className="mb-12 flex w-[90%] flex-col justify-center gap-12 lg:flex-row">
        <MyPageNav />
        {children}
      </div>
    </div>
  );
}
