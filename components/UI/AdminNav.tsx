import Image from 'next/image';
import logo from '../../public/logo_transparent.png';
import Link from 'next/link';
import useLoginStore from '@/store/useLoginStore';

export default function AdminNav() {
  const { adminLogout } = useLoginStore();
  return (
    <div className="fixed top-0 left-0 h-[100%] z-0 w-60 bg-gray-200">
      <div className="flex justify-center mt-24 mr-2">
        <Image src={logo} alt="Go GYM Logo" width={120} priority />
      </div>

      <ul className="flex flex-col items-center justify-center gap-4 mt-8 mr-2">
        <Link href={'/admin'}>
          <li className="font-bold text-gray-500 cursor-pointer hover:text-blue-500">
            고객관리
          </li>
        </Link>
        <Link href={'/admin/declaration'}>
          <li className="font-bold text-gray-500 cursor-pointer hover:text-blue-500">
            신고관리
          </li>
        </Link>
        <Link href={'/'}>
          <li
            className="font-bold text-gray-500 cursor-pointer hover:text-blue-500"
            onClick={adminLogout}
          >
            로그아웃
          </li>
        </Link>
      </ul>
    </div>
  );
}
