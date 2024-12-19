import Link from "next/link";

export default function MobileMenu({
  onToggleMenuModal,
}: {
  onToggleMenuModal: () => void;
}) {
  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 top-0 z-40 bg-gray-400 bg-opacity-70"
        onClick={onToggleMenuModal}
      ></div>
      <div className="fixed bottom-0 left-0 top-0 z-50 flex w-48 flex-col items-center gap-4 bg-white pt-24">
        <Link
          href={"/community"}
          className="font-semibold text-gray-700 transition-all hover:text-blue-500"
          onClick={onToggleMenuModal}
        >
          양도 게시판
        </Link>
        <Link
          href={"/chat"}
          className="font-semibold text-gray-700 transition-all hover:text-blue-500"
          onClick={onToggleMenuModal}
        >
          채팅방
        </Link>
      </div>
    </>
  );
}
