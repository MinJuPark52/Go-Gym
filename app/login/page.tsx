"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

const Rest_api_key = "5210bb9949fa1d15f1590799fc571710"; // REST API KEY
const redirect_uri = "http://localhost:3000/oauth"; // Redirect URI
// oauth 요청 URL
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

const handleLogin = () => {
  window.location.href = kakaoURL;
};

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }

  const Input = ({ type, placeholder, value, onChange }: InputProps) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border-2 border-gray-300 px-4 py-2 rounded w-full m-2"
    />
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Login submitted with", { email, password });
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="flex flex-col space-y-7 border-2 border-gray-300 p-6 w-[400px] h-[350px] rounded-lg">
        <form onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="border-2 border-blue-400 hover:border-blue-500 px-20 py-2 mt-5 ml-2 rounded w-full"
            >
              로그인
            </button>
          </div>
        </form>
        <button
          onClick={handleLogin}
          style={{ border: "none", backgroundColor: "transparent" }}
        >
          <Image
            src="/kakao_login.png"
            alt="kakao_login"
            width={200}
            height={0}
            className="ml-20"
          />
        </button>

        <div>
          <p className="text-gray-800">회원탈퇴</p>
        </div>
      </div>
    </div>
  );
}
