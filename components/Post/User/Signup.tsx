"use client";

import { ChangeEvent, useState } from "react";
import axios, { AxiosError } from "axios";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

interface SignupErrors {
  [key: string]: string;
  name: string;
  email: string;
  nickname: string;
  phone: string;
  password: string;
  area: string;
  area2: string;
  profileImageUrl: string;
}

const SignupInput: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  errorMessage,
}) => (
  <div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 rounded-md border border-gray-300"
    />

    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </div>
);

// 관심지역
const areas = ["서울"];
const areas2 = ["부산"];

export default function SignupPage() {
  const [signupFormData, setsignupFormData] = useState({
    name: "",
    email: "",
    nickname: "",
    phone: "",
    password: "",
    area: "none",
    area2: "none",
    profileImageUrl: "",
    role: "",
  });

  const [availability, setAvailability] = useState({
    email: null as boolean | null,
    nickname: null as boolean | null,
  });
  const [loading, setLoading] = useState({
    email: false,
    nickname: false,
  });

  const [signupErrors, setsignupErrors] = useState({
    name: "",
    email: "",
    nickname: "",
    phone: "",
    password: "",
    area: "",
    area2: "",
    profileImageUrl: "",
  });

  const handleSignupChange =
    (field: keyof typeof signupFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setsignupFormData({ ...signupFormData, [field]: e.target.value });
    };

  const validateForm = () => {
    let valid = true;
    const newErrors: SignupErrors = { ...signupErrors };

    const fields = [
      {
        name: "name",
        message: "이름을 입력하세요",
        condition: !signupFormData.name,
      },
      {
        name: "nickname",
        message: "닉네임을 입력해주세요.",
        condition: !signupFormData.nickname,
      },
      {
        name: "area",
        message: "관심지역을 선택해주세요.",
        condition: signupFormData.area === "none",
      },
      {
        name: "area2",
        message: "관심지역을 선택해주세요.",
        condition: signupFormData.area2 === "none",
      },
      {
        name: "phone",
        message: "핸드폰 번호를 입력해주세요.",
        condition: !signupFormData.phone,
      },
    ];

    fields.forEach((field) => {
      newErrors[field.name] = field.condition ? field.message : "";
      valid = field.condition ? false : valid;
    });

    if (!signupFormData.email) {
      newErrors.email = "이메일을 입력해주세요.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(signupFormData.email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
      valid = false;
    } else {
      newErrors.email = "";
    }

    if (!signupFormData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
      valid = false;
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(
        signupFormData.password
      )
    ) {
      newErrors.password =
        "비밀번호는 특수문자, 대소문자, 숫자를 포함해야 합니다.";
      valid = false;
    } else {
      newErrors.password = "";
    }

    setsignupErrors(newErrors);
    return valid;
  };

  const checkAvailability = async (
    type: "email" | "nickname",
    value: string
  ) => {
    if (loading[type]) return;
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const api =
        type === "email" ? "/api/auth/check-email" : "/api/auth/check-nickname";
      const response = await axios.get(api, {
        params: { [type]: value },
      });

      const data = response.data;
      setAvailability((prev) => ({
        ...prev,
        [type]: data.result === "true",
      }));
      alert(
        data.message ||
          `${type === "nickname" ? "닉네임" : "이메일"} ${
            data.data === true ? "사용 가능합니다." : "이미 존재합니다."
          }`
      );
    } catch (error) {
      console.error(`Error checking availability: ${type}:`, error);

      if ((error as AxiosError).response) {
        const responseMessage = (error as AxiosError).response?.data;

        if ((error as AxiosError).response?.status === 400) {
          alert(
            responseMessage ||
              `${
                type === "nickname" ? "닉네임" : "이메일"
              } 형식이 올바르지 않습니다.`
          );
        }
        if ((error as AxiosError).response?.status === 500) {
          alert(responseMessage || "서버 내부 오류입니다.");
        }
      }
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios({
          method: "post",
          url: "/api/auth/sign-up",
          data: {
            name: signupFormData.name,
            email: signupFormData.email,
            nickname: signupFormData.nickname,
            phone: signupFormData.phone,
            password: signupFormData.password,
            areas: signupFormData.area,
            areas2: null,
            profileImageUrl: signupFormData.profileImageUrl,
            // role: "User",
          },
        });
        console.log(response.data);
        alert("회원가입이 완료되었습니다.");

        // 이메일 인증 요청
        try {
          const emailResponse = await axios({
            method: "post",
            url: "/api/auth/verify-email",
            data: {
              email: signupFormData.email,
            },
          });
          console.log(emailResponse.data);
          alert("이메일 인증 링크가 전송되었습니다.");
        } catch (error) {
          console.error("Error:", error);
          alert("이메일 인증을 요청하는데 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.log("회원가입 오류:", error);
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 border-r-gray-300 w-full h-[40rem]">
      <form
        onSubmit={handleSignupSubmit}
        className="w-full h-[35rem] max-w-md bg-white p-8 space-y-3 overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold text-center">회원가입</h2>

        <div>
          <SignupInput
            type="text"
            placeholder="프로필 이미지 URL"
            value={signupFormData.profileImageUrl}
            onChange={handleSignupChange("profileImageUrl")}
            errorMessage={signupErrors.profileImageUrl}
          />
        </div>

        <div>
          <SignupInput
            type="text"
            placeholder="이름"
            value={signupFormData.name}
            onChange={handleSignupChange("name")}
            errorMessage={signupErrors.name}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <SignupInput
              type="text"
              placeholder="이메일"
              value={signupFormData.email}
              onChange={handleSignupChange("email")}
              errorMessage={signupErrors.email}
            />
          </div>
          <button
            type="button"
            onClick={() => checkAvailability("email", signupFormData.email)}
            disabled={loading.email}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {loading.email ? "확인 중" : "중복확인"}
          </button>
        </div>

        <div className="mt-2">
          {availability.email === false && <p>이미 사용중인 이메일입니다.</p>}
          {availability.email === true && <p>사용 가능한 이메일입니다.</p>}
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <SignupInput
              type="text"
              placeholder="닉네임"
              value={signupFormData.nickname}
              onChange={handleSignupChange("nickname")}
              errorMessage={signupErrors.nickname}
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() =>
                checkAvailability("nickname", signupFormData.nickname)
              }
              disabled={loading.nickname}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {loading.nickname ? "확인 중" : "중복확인"}
            </button>
            {availability.nickname === false && (
              <p>이미 사용중인 닉네임입니다.</p>
            )}
            {availability.nickname === true && <p>사용 가능한 닉네임입니다.</p>}
          </div>
        </div>

        <div>
          <SignupInput
            type="text"
            placeholder="핸드폰 번호"
            value={signupFormData.phone}
            onChange={handleSignupChange("phone")}
            errorMessage={signupErrors.phone}
          />
        </div>

        <div>
          <SignupInput
            type="password"
            placeholder="비밀번호"
            value={signupFormData.password}
            onChange={handleSignupChange("password")}
            errorMessage={signupErrors.password}
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-full">
            <select
              value={signupFormData.area}
              onChange={handleSignupChange("area")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="none">관심지역</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {signupErrors.area && (
              <p className="text-red-500 text-sm">{signupErrors.area}</p>
            )}
          </div>

          <div className="w-full">
            <select
              value={signupFormData.area2}
              onChange={handleSignupChange("area2")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none mb-3"
            >
              <option value="none">관심지역2</option>
              {areas2.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {signupErrors.area2 && (
              <p className="text-red-500 text-sm">{signupErrors.area2}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
  );
}
