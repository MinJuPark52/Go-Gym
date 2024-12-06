'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyPageNav() {
  const params = useParams();
  const [visible, setVisible] = useState({
    post: false,
    trans: false,
  });

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
    if (params.category) {
      setVisible({ ...visible, post: true });
    } else {
      setVisible({ post: false, trans: false });
    }
  }, [params]);

  return (
    <div className=" flex flex-col mt-16 min-w-48">
      <h2 className=" p-2 border-b-2 border-b-gray-600 text-xl text-gray-600 font-bold ">
        마이페이지
      </h2>
      <div className=" flex flex-col items-start p-3 gap-2">
        <Link href={'/mypage'}>
          <button className=" text-sm text-gray-600 font-bold hover:text-blue-400 cursor-pointer">
            프로필
          </button>
        </Link>
        <button
          onClick={handlePostVisible}
          className=" text-sm text-gray-600 font-bold hover:text-blue-400 cursor-pointer"
        >
          게시글
        </button>
        {visible.post && (
          <div className=" flex flex-col p-2 gap-2 items-start animate-slide-down">
            <Link href={'/mypage/postLook/my-posts'}>
              <button
                className={`text-sm text-gray-600 font-bold hover:text-blue-400 cursor-pointer ${
                  params.category === 'my-posts' ? 'text-blue-400' : ''
                }`}
              >
                작성한 게시글
              </button>
            </Link>
            <Link href={'/mypage/postLook/wishlist'}>
              <button
                className={`text-sm text-gray-600 font-bold hover:text-blue-400 cursor-pointer ${
                  params.category === 'wishlist' ? 'text-blue-400' : ''
                }`}
              >
                찜한 게시글
              </button>
            </Link>
            <Link href={'/mypage/postLook/recent-view'}>
              <button
                className={`text-sm text-gray-600 font-bold hover:text-blue-400 cursor-pointer ${
                  params.category === 'recent-view' ? 'text-blue-400' : ''
                }`}
              >
                최근 본 게시글
              </button>
            </Link>
          </div>
        )}
        <button
          onClick={handleTransVisible}
          className=" text-sm text-gray-600 font-bold hover:text-blue-400 cursor-pointer"
        >
          거래내역
        </button>
        {visible.trans && (
          <div className=" flex flex-col p-2 gap-2 items-start animate-slide-down">
            <button
              className={`text-sm text-gray-600 font-bold hover:text-blue-400 cursor-pointer `}
            >
              구매 목록
            </button>
            <button
              className={`text-sm text-gray-600 font-bold hover:text-blue-400 cursor-pointer `}
            >
              판매 목록
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
