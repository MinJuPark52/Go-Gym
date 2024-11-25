import { FaHeart } from 'react-icons/fa';
import { IoChatbubblesOutline } from 'react-icons/io5';

interface PostType {
  authorNickName: string;
  created_at: string;
  gymName: string;
  imageUrl1: string;
  postStatus: string;
  title: string;
  wishCount: number;
}

export default function PostItem({
  authorNickName,
  created_at,
  gymName,
  imageUrl1,
  postStatus,
  title,
  wishCount,
}: PostType) {
  let postStatusKo = postStatus === 'PENDING' && '판매중';

  return (
    <div className=" w-80 h-48 rounded-lg border-2 border-[#65A3FF]">
      <div>
        <div className=" flex justify-between m-2">
          <p className=" text-gray-500 text-sm font-bold">{postStatusKo}</p>
          <p className=" text-gray-500 text-xs">{created_at}</p>
        </div>
        <div className=" flex justify-between ml-2 mr-2 h-28 border-b border-[#65A3FF]">
          <div>이미지</div>
          <div className=" flex flex-col justify-between items-end">
            <p>{title}</p>
            <p className=" text-gray-500 text-sm font-bold">{authorNickName}</p>
          </div>
        </div>
      </div>
      <div className=" flex justify-between mt-2 ml-2 mr-2">
        <div className=" flex items-center gap-4  ">
          <div className=" flex items-center">
            <FaHeart color="#DC7D7D" /> {wishCount}
          </div>
          <div className=" flex items-center">
            <IoChatbubblesOutline size={24} /> 100
          </div>
        </div>
        <p>{gymName}</p>
      </div>
    </div>
  );
}
