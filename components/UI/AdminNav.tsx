import Image from "next/image";
import logo from "../../public/logo_transparent.png";
import Link from "next/link";
import useLoginStore from "@/store/useLoginStore";

export default function AdminNav() {
  const { adminLogout } = useLoginStore();
  return (
    <div className="fixed left-0 top-0 z-0 h-[100%] w-60 bg-gray-200">
      <div className="mr-2 mt-24 flex justify-center">
        <Image src={logo} alt="Go GYM Logo" width={120} priority />
      </div>

      <ul className="mr-2 mt-8 flex flex-col items-center justify-center gap-4">
        <Link href={"/admin"}>
          <li className="cursor-pointer font-bold text-gray-500 hover:text-blue-500">
            고객관리
          </li>
        </Link>
        <Link href={"/admin/declaration"}>
          <li className="cursor-pointer font-bold text-gray-500 hover:text-blue-500">
            신고관리
          </li>
        </Link>
        <Link href={"/"}>
          <li
            className="cursor-pointer font-bold text-gray-500 hover:text-blue-500"
            onClick={adminLogout}
          >
            로그아웃
          </li>
        </Link>
      </ul>
    </div>
  );
}
