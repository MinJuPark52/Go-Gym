'use client';

import { CgCloseO } from 'react-icons/cg';
import PostList from './PostList';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import profile from '../../public/default_profile.png';
import Image from 'next/image';

export default function PostUserDetail({
  onUserClick,
}: {
  onUserClick: () => void;
}) {
  const { data, isPending } = useQuery({
    queryKey: ['postDetailUser'],
    queryFn: async () =>
      (await axios.get('http://localhost:4000/userDetail/1')).data,
    staleTime: 100000,
  });

  if (isPending) {
    return <p>데이터 로딩중...</p>;
  }

  return (
    <div className=" flex flex-col justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-gray-600 bg-opacity-30">
      <div className=" flex justify-end items-center max-w-[1100px] ] w-[70%] animate-slide-down">
        <CgCloseO
          size={48}
          color="#545454"
          className=" translate-x-12 cursor-pointer"
          onClick={onUserClick}
        />
      </div>
      <div className=" relative bg-white max-w-[1100px]  min-w-[900px] w-[70%] h-[60%] rounded-lg overflow-hidden animate-slide-down overflow-y-auto">
        <div className=" flex items-center gap-4 m-8">
          <Image
            src={profile}
            alt="profile"
            width={80}
            className=" cursor-pointer"
            priority
          />
          <p className=" text-2xl text-gray-600">
            {data.nickname}님의 다른 게시글
          </p>
        </div>
        <div className="m-4 overflow-x-auto">
          <PostList />
        </div>
      </div>
    </div>
  );
}
