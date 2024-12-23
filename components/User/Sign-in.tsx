/*
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import Login 

export default function KakaoSignin {

  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { code } = req.query; // 카카오에서 넘겨준 인증 코드 받기

  if (!code) {
    return res.status(400).json({ error: "Code is missing" });
  }

  try {
    // 카카오 인증 코드로 액세스 토큰 요청
    const { KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI } =
      process.env;
    const response = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KAKAO_CLIENT_ID!,
        client_secret: KAKAO_CLIENT_SECRET!,
        redirect_uri: KAKAO_REDIRECT_URI!,
        code: code as string,
      }),
    );

    const { access_token } = response.data;

    if (access_token) {
      // 토큰 반환
      return res.status(200).json({ token: access_token });
    } else {
      return res.status(400).json({ error: "Failed to get access token" });
    }
  } catch (error) {
    console.error("Error fetching Kakao token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  return()
}
*/