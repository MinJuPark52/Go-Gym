import PostList from '@/components/Post/PostList';
import Slider from '@/components/Post/Slider';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Slider />
      <div className=" w-[80%] m-auto">
        <p className="mt-20 ml-8 text-4xl">가장 인기있는 게시물</p>
        <div className=" flex w-100 h-96 mt-8">
          <PostList />
        </div>
      </div>
    </>
  );
}
