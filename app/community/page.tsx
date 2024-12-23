import PostListContainer from "@/components/Post/PostListContainer";
import { Suspense } from "react";

export default function CommunityPage() {
  return (
    <div className="flex justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <PostListContainer />
      </Suspense>
    </div>
  );
}
