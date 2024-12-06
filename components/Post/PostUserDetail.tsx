import { CgCloseO } from 'react-icons/cg';
import PostList from './PostList';

export default function PostUserDetail({
  onUserClick,
}: {
  onUserClick: () => void;
}) {
  return (
    <div className=" flex flex-col justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-gray-600 bg-opacity-30">
      <div className=" flex justify-end items-center max-w-[1100px] w-[70%] animate-slide-down">
        <CgCloseO
          size={48}
          color="#545454"
          className=" translate-x-12 cursor-pointer"
          onClick={onUserClick}
        />
      </div>
      <div className=" relative bg-white max-w-[1100px] w-[70%] h-[60%] rounded-lg overflow-hidden animate-slide-down overflow-y-auto">
        <p>헬린이</p>
        <p>작성한 게시글</p>
        <div className=" overflow-x-auto">
          <PostList />
        </div>
      </div>
    </div>
  );
}
