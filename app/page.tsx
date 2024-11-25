import PostList from '@/components/Post/PostList';

export default function Home() {
  return (
    <div className=" w-[80%] m-auto">
      <p>캐러셀</p>
      <div className=" flex w-100 h-96">
        <PostList />
      </div>
    </div>
  );
}
