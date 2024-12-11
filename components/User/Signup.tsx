"use client";

import { ChangeEvent, useState } from "react";
import axios from "axios";

interface Signup {
  email: string;
  nickname: string;
  phone: string;
  password: string;
  regionId1: string | undefined;
  regionId2: string | undefined;
  profileImageUrl: string;
}

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
  regionId1: string;
  regionId2: string;
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
      className="w-full rounded-md border border-gray-300 p-2"
    />
    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
  </div>
);

const regions: { id: string; name: string }[] = [
  { id: "1", name: "서울특별시" },
  { id: "2", name: "부산광역시" },
  { id: "3", name: "대구광역시" },
  { id: "4", name: "인천광역시" },
  { id: "5", name: "광주광역시" },
  { id: "6", name: "대전광역시" },
  { id: "7", name: "울산광역시" },
  { id: "8", name: "세종특별자치시" },
  { id: "9", name: "경기도" },
  { id: "10", name: "충청북도" },
  { id: "11", name: "경상북도" },
  { id: "12", name: "전라남도" },
  { id: "13", name: "경상남도" },
  { id: "14", name: "제주특별자치시" },
  { id: "15", name: "강원특별자치도" },
  { id: "16", name: "전북특별자치도" },
];

export default function SignupPage() {
  const [signupFormData, setsignupFormData] = useState({
    name: "",
    email: "",
    nickname: "",
    phone: "",
    password: "",
    regionId1: "",
    regionId2: "",
    profileImageUrl: "",
  });

  const [signupErrors, setsignupErrors] = useState<SignupErrors>({
    name: "",
    email: "",
    nickname: "",
    phone: "",
    password: "",
    regionId1: "",
    regionId2: "",
    profileImageUrl: "",
  });

  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [subRegions1, setSubRegions1] = useState<
    { id: string; name: string }[]
  >([]);
  const [subRegions2, setSubRegions2] = useState<
    { id: string; name: string }[]
  >([]);

  const handleSignupChange =
    (field: keyof typeof signupFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setsignupFormData({ ...signupFormData, [field]: value });
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
        name: "phone",
        message: "핸드폰 번호를 입력해주세요.",
        condition: !signupFormData.phone,
      },
    ];

    fields.forEach((field) => {
      newErrors[field.name] = field.condition ? field.message : "";
      valid = field.condition ? false : valid;
    });

    if (!signupFormData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
      valid = false;
    } else if (
      !/(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(signupFormData.password)
    ) {
      newErrors.password = "비밀번호는 특수문자, 영어, 숫자를 포함해야 합니다.";
      valid = false;
    } else {
      newErrors.password = "";
    }

    setsignupErrors(newErrors);
    return valid;
  };

  const checkEmail = async (email: string) => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("이메일 주소에 '@'을 포함해주세요.");
      return;
    }

    try {
      const response = await axios.get<Signup[]>(
        "/backend/api/auth/check-email",
        {
          params: { email },
        },
      );

      if (response.status === 200) {
        setIsEmailAvailable(true);
        alert("이메일 사용 가능합니다.");
      } else {
        alert("이메일 이미 존재합니다.");
      }
    } catch (error) {
      console.error("Error checking email availability:", error);
      alert("서버 오류가 발생했습니다.");
      setIsEmailAvailable(false);
    }
  };

  const checkNickname = async (nickname: string) => {
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get("/backend/api/auth/check-nickname", {
        params: { nickname },
      });

      if (response.status === 200) {
        setIsNicknameAvailable(true);
        alert("닉네임 사용 가능합니다.");
      } else {
        alert("닉네임 이미 존재합니다.");
      }
    } catch (error) {
      console.error("Error checking nickname availability:", error);
      alert("서버 오류가 발생했습니다.");
      setIsNicknameAvailable(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailAvailable || !isNicknameAvailable) {
      alert("중복확인을 해주세요.");
      return;
    }

    if (validateForm()) {
      try {
        const response = await axios.post<Signup[]>(
          "/backend/api/auth/sign-up",
          signupFormData,
        );

        if (response.status === 200) {
          const emailResponse = await axios.post(
            "/backend/api/auth/send-verification-email",
            null,
            { params: { email: signupFormData.email } },
          );

          if (emailResponse.status === 200) {
            alert(
              "이메일 인증 링크가 전송되었습니다. 이메일을 통해 인증해주세요",
            );
          } else {
            throw new Error("링크 전송 X");
          }
        } else {
          throw new Error("회원가입 실패");
        }
      } catch (error) {
        console.error("오류:", error);
        alert("회원가입에 실패했습니다.");
      }
    }
  };

  const handleChangeRegionId1 = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedRegionId1 = e.target.value;
    setsignupFormData({ ...signupFormData, regionId1: selectedRegionId1 });

    if (selectedRegionId1) {
      try {
        const response = await axios.get(
          //아이디랑 이름 같이 받아야함
          `/api/regions?name=${selectedRegionId1}`,
        );
        if (response.status === 200) {
          const regionsData = response.data.districts.map(
            (district: { id: string; name: string }) => ({
              id: district.id,
              name: district.name,
            }),
          );
          setSubRegions1(regionsData);
        }
      } catch (error) {
        console.error("API 호출에 실패했습니다.", error);
      }
    }
  };

  const handleChangeRegionId2 = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedRegionId2 = e.target.value;
    setsignupFormData({ ...signupFormData, regionId2: selectedRegionId2 });

    if (selectedRegionId2) {
      try {
        const response = await axios.get(
          `/api/regions?name=${selectedRegionId2}`,
        );
        if (response.status === 200) {
          const regionsData = response.data.districts.map(
            (district: { id: string; name: string }) => ({
              id: district.id,
              name: district.name,
            }),
          );
          setSubRegions2(regionsData);
        }
      } catch (error) {
        console.error("API 호출에 실패했습니다.", error);
      }
    }
  };

  return (
    <div className="flex h-[40rem] w-full items-center justify-center border-r-gray-300 bg-gray-50">
      <form
        onSubmit={handleSignupSubmit}
        className="h-[35rem] w-full max-w-md space-y-3 overflow-y-auto bg-white p-8"
      >
        <h2 className="text-center text-2xl font-semibold">회원가입</h2>

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
            onClick={() => checkEmail(signupFormData.email)}
            className="rounded-md bg-blue-500 px-4 py-2 text-white focus:outline-none"
            disabled={isEmailAvailable}
          >
            {isEmailAvailable ? "사용 가능" : "중복확인"}
          </button>
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
          <button
            type="button"
            onClick={() => checkNickname(signupFormData.nickname)}
            className="rounded-md bg-blue-500 px-4 py-2 text-white focus:outline-none"
            disabled={isNicknameAvailable}
          >
            {isNicknameAvailable ? "사용 가능" : "중복확인"}
          </button>
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
          <div className="flex-1">
            <select
              value={signupFormData.regionId1}
              onChange={handleChangeRegionId1}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">지역 선택1</option>
              {regions.map((region) => (
                <option key={region.id} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <select
              value={signupFormData.regionId1}
              onChange={handleChangeRegionId1}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">세부 지역 선택1</option>
              {subRegions1.map((subRegion) => (
                <option key={subRegion.id} value={subRegion.id}>
                  {subRegion.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <select
              value={signupFormData.regionId2}
              onChange={handleChangeRegionId2}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">지역 선택2</option>
              {regions.map((region) => (
                <option key={region.id} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <select
              value={signupFormData.regionId2}
              onChange={handleChangeRegionId2}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">세부 지역 선택2</option>
              {subRegions2.map((subRegion) => (
                <option key={subRegion.id} value={subRegion.id}>
                  {subRegion.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 py-3 text-white hover:bg-blue-600 focus:outline-none"
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
  );
}
