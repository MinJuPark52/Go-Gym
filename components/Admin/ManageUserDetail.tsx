'use client';

import { useParams } from 'next/navigation';
import PostList from '../Post/PostList';
import useLoginStore from '@/store/useLoginStore';
import { useEffect } from 'react';

interface Params {
  userId: string;
}

export default function ManageUserDetail() {
  const { adminLogin } = useLoginStore();
  const params = useParams();

  const userId = params?.userId as string;

  useEffect(() => {
    adminLogin();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center ml-72 mt-12">
      <h2 className="text-3xl font-bold mb-12">
        {decodeURIComponent(userId)}의 게시글
      </h2>
      <div className="overflow-x-auto">
        <PostList />
      </div>
    </div>
  );
}
