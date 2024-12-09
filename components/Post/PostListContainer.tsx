'use client';

import Link from 'next/link';
import Filter from './Filter';
import PostList from './PostList';
import { useState } from 'react';

interface categoryStateType {
  postType: 'default' | 'SELL' | 'BUY';
  postStatus:
    | 'default'
    | 'POSTING'
    | 'SALE_COMPLETED'
    | 'PURCHASE_COMPLETED'
    | 'HIDDEN';
  membershipType:
    | 'default'
    | 'MEMBERSHIP_ONLY'
    | 'MEMBERSHIP_WITH_PT'
    | 'PT_ONLY';
  membershipDuration: 'default' | 'months_0_3' | 'months_3_6' | 'months_6_plus';
  PTCount: 'default' | 'PT_0_10' | 'PT_10_25' | 'PT_25_plus';
}

export default function PostListContainer() {
  const [filter, setFilter] = useState<categoryStateType>({
    postType: 'default',
    postStatus: 'default',
    membershipType: 'default',
    membershipDuration: 'default',
    PTCount: 'default',
  });

  const handleFilterUrl = (obj: categoryStateType) => {
    setFilter(obj);
    console.log(filter);
  };

  //삼항연산자 -> 객체로 연결
  //prettier-ignore
  let query = `${filter.postType !== 'default' ? '' : 'postType=' + filter.postType}&${filter.postStatus !== 'default' ? '' : 'postStatus=' + filter.postStatus}&${filter.membershipType !== 'default' ? '' : 'membershipType=' + filter.membershipType}&${filter.membershipDuration !== 'default' ? '' : 'membershipDuration=' + filter.membershipDuration}&${filter.PTCount !== 'default' ? '' : 'PTCount=' + filter.PTCount}&`
  let url = `/backend/api/filter?${query}`;

  //tanstack-query에서 캐싱해서 처리

  return (
    <div className=" flex flex-col mt-12 w-[70%]">
      <div className=" flex justify-between items-center">
        <p className=" mb-12 text-2xl font-bold">양도 회원권</p>
        <Link href={'/community/editpost'}>
          <button className="btn btn-inf0 bg-blue-300 hover:bg-blue-500 text-white">
            글쓰기
          </button>
        </Link>
      </div>
      <div className=" mb-12">
        <Filter onChangeFilter={handleFilterUrl} filter={filter} />
      </div>
      <PostList />
    </div>
  );
}
