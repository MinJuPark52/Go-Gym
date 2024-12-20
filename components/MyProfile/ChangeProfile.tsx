"use client";
import axiosInstance from "@/api/axiosInstance";
import S3ImageUrl from "@/hooks/S3ImageUrl";
import useUserStore from "@/store/useUserStore";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRef, useState } from "react";

const SignupInput: React.FC<InputProps> = ({
  type,
  name,
  placeholder,
  disabled,
  value,
  style,
  onChange,
}) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={`w-full rounded-md border border-gray-300 p-2 focus:outline-blue-500 ${style}`}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  </div>
);

interface InputProps {
  type: string;
  name?: string;
  placeholder: string;
  disabled: boolean;
  style?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChangeProfile() {
  const { user } = useUserStore();
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [isPasswordAvailable, setIsPasswordAvailable] = useState(false);
  const [visiblePasswordChange, setVisiblePasswordChange] = useState(true);
  const [file, setFile] = useState<string>("");
  const [preview, setPreview] = useState<File | null>(null);
  const [values, setValues] = useState({
    nickname: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: checkNickname } = useMutation<boolean, Error, string>({
    mutationFn: async (nickname: string) => {
      if (!nickname) {
        throw new Error("닉네임을 입력해주세요.");
      }

      // 닉네임 중복확인
      const response = await axiosInstance.get("/api/auth/check-nickname", {
        params: { nickname },
      });
      if (response.status === 200) {
        return true;
      } else {
        throw new Error("닉네임 이미 존재합니다.");
      }
    },
    onSuccess: () => {
      setIsNicknameAvailable(true);
      alert("닉네임 사용 가능합니다.");
    },
    onError: (error) => {
      setIsNicknameAvailable(false);
      alert(error.message);
    },
  });

  const { mutate: checkPassword } = useMutation<boolean, Error, string>({
    mutationFn: async (password) => {
      if (!password) {
        throw new Error("닉네임을 입력해주세요.");
      }

      // 비밀번호 재설정
      const response = await axiosInstance.put("/api/auth/reset-password", {
        email: user?.email,
        password: values.password,
      });
      if (response.status === 200) {
        return true;
      } else {
        throw new Error("비밀번호 이미 존재합니다.");
      }
    },
    onSuccess: () => {
      setIsPasswordAvailable(true);
      alert("비밀번호 사용 가능합니다.");
    },
    onError: (error) => {
      setIsPasswordAvailable(false);
      alert(error.message);
    },
  });

  const { mutate: submit } = useMutation({
    mutationKey: ["submit"],
    mutationFn: async () =>
      await axiosInstance.put("/api/members/me/profile", {
        name: user ? user.name : "",
        nickname: values.nickname,
        phone: values.phone,
        profilImageUrl: file,
      }),
    onSuccess: () => {
      alert("수정완료");
    },
  });

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // useRef를 사용하여 파일 입력 요소 클릭
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // 백엔드 연동시 파일자체 보내기
      const newImg = await S3ImageUrl(
        e.target.files[0].name,
        e.target.files[0],
        "members",
      );
      setPreview(e.target.files[0]);
      setFile(newImg.toString());
    }
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-3 overflow-y-auto p-8"
    >
      <h2 className="text-center text-2xl font-semibold">프로필 수정</h2>
      {file ? (
        <>
          <div className="relative ml-auto mr-auto flex h-[240px] w-[240px] justify-center overflow-hidden rounded-[100%] border border-gray-300">
            <Image
              src={URL.createObjectURL(preview!)}
              alt="프로필 이미지"
              className="rounded-lg"
              layout="fill"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleButtonClick} // 클릭 핸들러 호출
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              다시 선택
            </button>

            <input
              type="file"
              accept="image/*"
              id="file-input"
              name="file-input"
              onChange={handleFileSelect}
              ref={fileInputRef} // ref 연결
              style={{ display: "none" }} // 숨김
            />
          </div>
        </>
      ) : (
        <div className="relative ml-auto mr-auto flex h-[240px] w-[240px] justify-center overflow-hidden rounded-[100%] border border-gray-300">
          <div className="flex h-56 w-60 items-center justify-center">
            <input
              type="file"
              accept="image/*"
              id="file-input"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="file-input"
              className="flex cursor-pointer flex-col items-center justify-center text-gray-600"
            >
              <span className="text-4xl text-green-500">+</span>
              <span className="mt-2 text-sm font-semibold">
                {"프로필 사진 선택하세요"}
              </span>
            </label>
          </div>
        </div>
      )}

      <div>
        <SignupInput
          type="text"
          placeholder={user ? user.name : ""}
          value={user ? user.name : ""}
          disabled={true}
        />
      </div>

      <div>
        <SignupInput
          type="text"
          placeholder={user ? user.email : ""}
          value={user ? user.email : ""}
          disabled={true}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <SignupInput
            type="text"
            placeholder={user ? user.nickname : ""}
            disabled={false}
            value={values.nickname}
            name="nickname"
            onChange={handleChangeValue}
          />
        </div>
        <button
          type="button"
          onClick={() => checkNickname(values.nickname)}
          className="rounded-md bg-blue-500 px-4 py-2 text-white focus:outline-none"
          disabled={isNicknameAvailable}
        >
          {isNicknameAvailable ? "사용 가능" : "중복확인"}
        </button>
      </div>

      <div>
        {/* 세자리 네자리 네자리 자동넘어가기 */}
        <SignupInput
          type="text"
          placeholder={user ? user.phone : ""}
          disabled={false}
          value={values.phone}
          name="phone"
          onChange={handleChangeValue}
        />
      </div>

      {visiblePasswordChange ? (
        <div>
          <button
            type="button"
            onClick={() => setVisiblePasswordChange(false)}
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white focus:outline-none"
          >
            비밀번호 변경하기
          </button>
        </div>
      ) : (
        <>
          <div>
            <SignupInput
              type="password"
              placeholder="새 비밀번호"
              disabled={false}
              name="password"
              value={values.password}
              onChange={handleChangeValue}
            />
          </div>
          <div className="flex justify-between">
            <div>
              <SignupInput
                type="password"
                placeholder="새 비밀번호 확인"
                disabled={false}
                value={values.passwordConfirm}
                name="passwordConfirm"
                onChange={handleChangeValue}
              />
              {values.password !== values.passwordConfirm && (
                <p className="text-xs text-red-500">
                  비밀번호가 일치하지않습니다.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => checkPassword(values.password)}
              className="h-11 rounded-md bg-blue-500 px-4 py-2 text-white focus:outline-none"
              disabled={isPasswordAvailable}
            >
              {!isPasswordAvailable ? "변경하기" : "변경완료"}
            </button>
          </div>
        </>
      )}

      <div className="flex space-x-4">
        <div className="w-full">
          <select className="w-full rounded-md border border-gray-300 p-3 focus:outline-none">
            <option value="">관심지역</option>
          </select>
        </div>

        <div className="w-full">
          <select className="mb-3 w-full rounded-md border border-gray-300 p-3 focus:outline-none">
            <option value="">관심지역2</option>
          </select>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 py-3 text-white hover:bg-blue-600 focus:outline-none"
        >
          수정하기
        </button>
      </div>
    </form>
  );
}
