import KakaoSignup from "@/components/User/KakaoSignup";
import { Suspense } from "react";

export default function KaKaoSignupPage() {
  return (
    <div>
      <Suspense fallback={<div>로딩중...</div>}>
        <KakaoSignup />
      </Suspense>
    </div>
  );
}
