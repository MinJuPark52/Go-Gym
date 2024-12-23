"use client";

import useLoginStore from "@/store/useLoginStore";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPageNav() {
  const params = useParams();
  const router = useRouter();
  const { loginState } = useLoginStore();
  const [visible, setVisible] = useState({
    post: false,
    trans: false,
  });
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (isLogin && !loginState) {
      router.push("/login");
    }
    setIsLogin(true);
  }, [loginState, isLogin]);

  const handlePostVisible = () => {
    setVisible({
      ...visible,
      post: !visible.post,
    });
  };

  const handleTransVisible = () => {
    setVisible({
      ...visible,
      trans: !visible.trans,
    });
  };

  useEffect(() => {
    if (params.category === "recent-view" || "my-posts" || "wishlist") {
      setVisible({ ...visible, post: true });
    } else if (params.category === "purchaselist" || "salelist") {
      setVisible({ ...visible, trans: true });
    }

    console.log(params);
  }, [params.category]);

  return (
    <div className="mt-16 flex min-w-48 flex-col lg:max-w-24">
      <h2 className="border-b-2 border-b-gray-600 p-2 text-xl font-bold text-gray-600">
        마이페이지
      </h2>
      <div className="flex gap-8 p-3 lg:flex-col lg:gap-2">
        <Link href={"/mypage"}>
          <button
            className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
              !params.category ? "text-blue-500" : "text-gray-600"
            }`}
          >
            프로필
          </button>
        </Link>
        <div className="min-w-[85px]">
          <button
            onClick={handlePostVisible}
            className="cursor-pointer text-sm font-bold text-gray-600 hover:text-blue-500"
          >
            게시글
          </button>
          {visible.post && (
            <div className="mt-2 flex animate-slide-down flex-col items-start gap-2 lg:p-2">
              <Link href={"/mypage/postLook/my-posts"}>
                <button
                  className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
                    params.category === "my-posts"
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  작성한 게시글
                </button>
              </Link>
              <Link href={"/mypage/postLook/wishlist"}>
                <button
                  className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
                    params.category === "wishlist"
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  찜한 게시글
                </button>
              </Link>
              <Link href={"/mypage/postLook/recent-view"}>
                <button
                  className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
                    params.category === "recent-view"
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  최근 본 게시글
                </button>
              </Link>
            </div>
          )}
        </div>
        <div>
          <button
            onClick={handleTransVisible}
            className="cursor-pointer text-sm font-bold text-gray-600 hover:text-blue-500"
          >
            거래내역
          </button>
          {visible.trans && (
            <div className="mt-2 flex animate-slide-down flex-col items-start gap-2 lg:p-2">
              <Link href={"/mypage/postLook/purchaselist"}>
                <button
                  className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
                    params.category === "purchaselist"
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  구매 목록
                </button>
              </Link>
              <Link href={"/mypage/postLook/salelist"}>
                <button
                  className={`cursor-pointer text-sm font-bold hover:text-blue-500 ${
                    params.category === "salelist"
                      ? "text-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  판매 목록
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
