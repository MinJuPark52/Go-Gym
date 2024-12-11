"use client";

import Image from "next/image";
import logo from "../../public/logo_transparent.png";
import Link from "next/link";
import useLoginStore from "@/store/useLoginStore";
import { FaBell } from "react-icons/fa";
import DefaultProfile from "./DefaultProfile";
import AdminNav from "./AdminNav";

export default function Nav() {
  const { loginState, adminLoginState, logout } = useLoginStore();

  if (adminLoginState) {
    return <AdminNav />;
  }

  return (
    <div className="h-18 flex justify-center border-b border-[#ccc] shadow-md">
      <div className="flex w-[80%] items-center justify-between">
        <Link href={"/"}>
          <Image
            src={logo}
            alt="Go GYM Logo"
            width={120}
            className="m-2 ml-8 cursor-pointer"
            priority
          />
        </Link>
        <div className="mr-8 flex items-center gap-4">
          <Link
            href={"/community"}
            className="font-semibold transition-all hover:text-blue-400"
          >
            양도 게시판
          </Link>
          <Link
            href={"/chat"}
            className="font-semibold transition-all hover:text-blue-400"
          >
            채팅방
          </Link>

          <FaBell className="h-6 w-10 text-blue-400" />

          {loginState ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar btn btn-circle btn-ghost"
              >
                <DefaultProfile width="10" />
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
              >
                <li>
                  <Link href={"/mypage"} className="justify-between">
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
              href={"/login"}
              className="font-semibold transition-all hover:text-blue-400"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
