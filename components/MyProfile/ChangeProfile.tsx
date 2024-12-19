"use client";
import S3ImageUrl from "@/hooks/S3ImageUrl";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import { useRef, useState } from "react";

const SignupInput: React.FC<InputProps> = ({
  type,
  name,
  placeholder,
  disabled,
  value,
  onChange,
}) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 p-2"
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
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChangeProfile() {
  const { user } = useUserStore();

  const [file, setFile] = useState<string>("");
  const [values, setValues] = useState({
    nickname: "",
    phone: "",
    password: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      setFile(newImg.toString());
    }
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: [e.target.value] });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
              src={file}
              alt="헬스장 이미지"
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

      <div className="flex items-center space-x-2">
        <div>
          <SignupInput
            type="text"
            placeholder={user ? user.email : ""}
            value={user ? user.email : ""}
            disabled={true}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div>
          <SignupInput
            type="text"
            placeholder="닉네임"
            disabled={false}
            value={user ? user.nickname : ""}
            name="nickname"
            onChange={handleChangeValue}
          />
        </div>
      </div>

      <div>
        <SignupInput
          type="text"
          placeholder="핸드폰 번호 ex)010-0000-0000"
          disabled={false}
          value={user ? user.phone : ""}
          name="phone"
          onChange={handleChangeValue}
        />
      </div>

      <div>
        <SignupInput
          type="password"
          placeholder="비밀번호"
          disabled={false}
          name="password"
          onChange={handleChangeValue}
        />
      </div>

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
