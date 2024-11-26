import Filter from './Filter';
import PostList from './PostList';

export default function PostListContainer() {
  return (
    <div className=" flex flex-col mt-12 w-[70%]">
      <p className=" mb-12 text-2xl font-bold">양도 회원권</p>
      <div className=" mb-12">
        <Filter />
      </div>
      <PostList />
    </div>
  );
}
