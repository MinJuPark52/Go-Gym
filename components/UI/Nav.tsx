'use client';

import Image from 'next/image';
import logo from '../../public/logo_transparent.png';
import profile from '../../public/default_profile.png';
import Link from 'next/link';
import useLoginStore from '@/store/useLoginStore';
import { FaBell } from 'react-icons/fa';
import DefaultProfile from './DefaultProfile';

export default function Nav() {
  const { loginState, logout } = useLoginStore();

  return (
    <div className=" flex justify-center border-b border-[#ccc] h-18 shadow-md">
      <div className=" flex justify-between items-center  w-[80%]">
        <Link href={'/'}>
          <Image
            src={logo}
            alt="Go GYM Logo"
            width={120}
            className="m-2 ml-8 cursor-pointer"
            priority
          />
        </Link>
        <div className=" flex gap-4 items-center mr-8">
          <Link
            href={'/community'}
            className="font-semibold hover:text-blue-400 transition-all"
          >
            양도 게시판
          </Link>
          <Link
            href={'/chat'}
            className="font-semibold hover:text-blue-400 transition-all"
          >
            채팅방
          </Link>

          <FaBell className="w-10 h-6 text-blue-400" />

          {loginState ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <DefaultProfile width="10" />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link href={'/mypage'} className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <p onClick={logout}>Logout</p>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              href={'/login'}
              className="font-semibold hover:text-blue-400 transition-all"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
