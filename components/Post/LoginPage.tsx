// /components/loginpage.tsx
"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Reusable Login Input Component
const Input = ({ type, placeholder, value, onChange }: InputProps) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-2 rounded-md border border-gray-300 mb-3"
  />
);

// Login form and logic
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const client_id = "your_kakao_client_id_here";
  const redirect_uri = "http://localhost:3000/oauth";
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;

  // Handle login with Kakao
  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    // Add your authentication logic here (e.g., calling an API)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white p-8 space-y-3"
    >
      <h2 className="text-2xl font-semibold text-center">로그인</h2>
      <Input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none mt-4"
      >
        로그인
      </button>
      <div className="flex justify-center mt-4">
        <Image
          src="/kakao_login.png"
          alt="카카오 로그인"
          width={200}
          height={50}
          onClick={handleLogin}
        />
      </div>
      <div>
        <Link href="/signup">회원가입</Link>
      </div>
    </form>
  );
}
