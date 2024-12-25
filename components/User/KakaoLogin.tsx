"use client";

import axiosInstance from "@/api/axiosInstance";
import useLoginStore from "@/store/useLoginStore";
import useUserStore from "@/store/useUserStore";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface UserType {
  memberId: string;
  name: string;
  email: string;
  nickname: string;
  phone: string;
  profileImageUrl: string | null;
  gymPayBalance: string | null;
  gymPayId: string;
  regionId1: string;
  regionId2: string;
  regionName1: string;
  regionName2: string;
}

export default function KakaoLogin() {
  const query = useSearchParams();
  const router = useRouter();
  const { InitUser } = useUserStore();
  const { login } = useLoginStore();

  useEffect(() => {
    console.log(query.get("code"));
  }, [query]);

  useEffect(() => {
    const code = query.get("code");

    if (code) {
      const processKakaoLogin = async () => {
        try {
          const response = await axios.get(
            `https://go-gym.site/api/kakao/sign-in?code=${code}`,
          );
          if (response) {
            console.log(response);
            console.log(response.data);
          }

          if (response.data.existingUser === false) {
            alert("회원 등록이 필요합니다. 회원가입 페이지로 이동합니다.");
            router.push("/kakaoSignup"); // 회원가입 페이지로 리다이렉트
          } else {
            const authHeader = response.headers["authorization"];
            if (authHeader) {
              const token = authHeader.split(" ")[1];
              sessionStorage.setItem("token", token);

              // 사용자 정보 가져오기
              const userData: UserType = await axiosInstance.get(
                "/api/members/me/profile",
              );
              InitUser(userData); // 상태 저장
              login(token);
              router.push("/"); // 메인 페이지로 리다이렉트
            }
          }
        } catch (error) {
          console.error("카카오 로그인 처리 중 오류:", error);
          alert("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
        }
      };

      processKakaoLogin();
    }
  }, [router, query]);

  return <div>카카오 로그인중</div>;
}
