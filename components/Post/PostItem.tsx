import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import { IoChatbubblesOutline } from 'react-icons/io5';
import profile from '../../public/default_profile.png';
import Link from 'next/link';
import useTimeAgo from '@/hooks/useTimeAgo';
import DefaultProfile from '../UI/defaultProfile';

interface PostType {
  id: string;
  authorNickName: string;
  created_at: string;
  gymName: string;
  imageUrl1: string;
  postStatus: string;
  title: string;
  wishCount: number;
}

export default function PostItem({
  id,
  authorNickName,
  created_at,
  gymName,
  imageUrl1,
  postStatus,
  title,
  wishCount,
}: PostType) {
  const postStatusKo = postStatus === 'PENDING' && '판매중';

  const timeago = useTimeAgo(created_at);

  return (
    <Link href={`/community/${id}`}>
      <div className=" w-80 h-48 rounded-lg border border-[#ccc] shadow cursor-pointer">
        <div>
          <div className=" flex justify-between m-2">
            <p className=" text-gray-500 text-sm font-bold">{postStatusKo}</p>
            <p className=" text-gray-500 text-xs">{timeago}</p>
          </div>
          <div className=" flex justify-between ml-1 pb-1 mr-2 h-28 border-b border-[#ccc]">
            {imageUrl1 ? (
              <Image
                src={imageUrl1}
                alt="헬스장 사진"
                width={200}
                height={64}
                className=" rounded-md"
                priority
              />
            ) : (
              <div className=" flex justify-center items-center w-[200px] h-[100px] rounded-lg bg-gray-400 bg-opacity-50">
                기본 이미지
              </div>
            )}

            <div className=" flex flex-col justify-between items-end">
              <p>{title}</p>
              <div className=" flex gap-2 items-center text-gray-500 text-sm font-bold">
                <DefaultProfile width="8" />
                {authorNickName}
              </div>
            </div>
          </div>
        </div>
        <div className=" flex justify-between mt-2 ml-2 mr-2">
          <div className=" flex items-center gap-4  ">
            <div className=" flex items-center">
              <FaHeart color="#DC7D7D" />{' '}
              <span className=" ml-1 text-gray-500 text-sm font-normal">
                {wishCount}
              </span>
            </div>
            <div className=" flex items-center">
              <IoChatbubblesOutline size={24} />{' '}
              <span className=" ml-1 text-gray-500 text-sm font-normal">
                100
              </span>
            </div>
          </div>
          <p>{gymName}</p>
        </div>
      </div>
    </Link>
  );
}
