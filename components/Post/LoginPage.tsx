'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

const LoginInput = ({
  type,
  placeholder,
  value,
  onChange,
  errorMessage,
}: InputProps) => (
  <div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 rounded-md border border-gray-300 mb-3"
    />
    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </div>
);

export default function LoginForm() {
  const [loginFormData, setloginFormData] = useState({
    email: '',
    password: '',
  });

  const [loginErrors, setloginErrors] = useState({
    email: '',
    password: '',
  });

  const handleLoginChange =
    (field: keyof typeof loginFormData) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setloginFormData({ ...loginFormData, [field]: e.target.value });
    };

  const client_id = 'your_kakao_client_id_here';
  const redirect_uri = 'http://localhost:3000/oauth';
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  const validateForm = () => {
    let emailErr = '';
    let passwordErr = '';
    let valid = true;

    if (!loginFormData.email) {
      emailErr = '이메일을 @포함해서 입력해주세요.';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginFormData.email)) {
      emailErr = '유효한 이메일 주소를 입력해주세요.';
      valid = false;
    }

    if (!loginFormData.password) {
      passwordErr = '비밀번호를 입력해주세요.';
      valid = false;
    }

    setloginErrors({ email: emailErr, password: passwordErr });

    return valid;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // If validation fails, do not submit
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginFormData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('로그인이 완료되었습니다!');
        console.log('Submitted:', loginFormData);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        alert(data.message || '로그인에 실패했습니다');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('다시 시도해주세요.');
    }
  };

  return (
    <form
      onSubmit={handleLoginSubmit}
      className="w-full max-w-md bg-white p-8 space-y-3"
    >
      <h2 className="text-2xl font-semibold text-center">로그인</h2>

      <LoginInput
        type="email"
        placeholder="이메일"
        value={loginFormData.email}
        onChange={handleLoginChange('email')}
        errorMessage={loginErrors.email}
      />

      <LoginInput
        type="password"
        placeholder="비밀번호"
        value={loginFormData.password}
        onChange={handleLoginChange('password')}
        errorMessage={loginErrors.password}
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
          height={30}
          onClick={handleLogin}
          className="cursor-pointer"
        />
      </div>

      <div>
        <Link href="/signup">회원가입</Link>
      </div>
    </form>
  );
}
