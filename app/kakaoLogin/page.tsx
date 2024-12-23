import KakaoLogin from "@/components/User/KakaoLogin";
import { Suspense } from "react";

export default function KakaoLoginPage() {
  return (
    <div>
      <Suspense fallback={<div>로딩중...</div>}>
        <KakaoLogin />
      </Suspense>
    </div>
  );
}
