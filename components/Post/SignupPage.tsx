"use client";

import { ChangeEvent, useState } from "react";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
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
  });

  const handleSignupChange =
    (field: keyof typeof signupFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setsignupFormData({ ...signupFormData, [field]: e.target.value });
    };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...signupErrors };

    if (!signupFormData.name) {
      newErrors.name = "이름을 입력해주세요.";
      valid = false;
    } else {
      newErrors.name = "";
    }

    if (!signupFormData.email) {
      newErrors.email = "이메일을 입력해주세요.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(signupFormData.email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
      valid = false;
    } else {
      newErrors.email = "";
    }

    if (!signupFormData.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요.";
      valid = false;
    } else {
      newErrors.nickname = "";
    }

    if (!signupFormData.phone) {
      newErrors.phone = "핸드폰 번호를 입력해주세요.";
      valid = false;
    } else {
      newErrors.phone = "";
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

    if (signupFormData.area === "none") {
      newErrors.area = "관심지역을 선택해주세요.";
      valid = false;
    } else {
      newErrors.area = "";
    }

    if (signupFormData.area2 === "none") {
      newErrors.area2 = "관심지역2를 선택해주세요.";
      valid = false;
    } else {
      newErrors.area2 = "";
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

    {
      /*중복 검사 api*/
    }

    try {
      const response = await fetch(
        `/api/duplicate${type === "nickname" ? "/nickname" : ""}?user${
          type === "nickname" ? "Nickname" : "Email"
        }=${value}`
      );
      const data = await response.json();
      setAvailability((prev) => ({
        ...prev,
        [type]: data.result === "true" ? false : true,
      }));
      alert(data.message);
    } catch (error) {
      console.error(`Error checking ${type}:`, error);
      alert(
        `${type === "nickname" ? "닉네임" : "이메일"}을 다시 입력해주세요.`
      );
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        {
          /*회원가입 api*/
        }
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupFormData),
        });

        const data = await response.json();

        if (response.ok) {
          alert("회원가입이 완료되었습니다!");
          console.log("Submitted:", signupFormData);
          {
            /*const router = useRouter(); 대신 사용*/
          }
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          alert(data.message || "회원가입에 실패했습니다");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 border-r-gray-300 w-full h-[40rem]">
      <form
        onSubmit={handleSignupSubmit}
        className="w-full h-[30rem] max-w-md bg-white p-8 space-y-3"
      >
        <h2 className="text-2xl font-semibold text-center">회원가입</h2>

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
