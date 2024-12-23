"use client";
import axiosInstance from "@/api/axiosInstance";
import S3ImageUrl from "@/hooks/S3ImageUrl";
import useUserStore from "@/store/useUserStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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
  const [region1State, setRegion1State] = useState("");
  const [region2State, setRegion2State] = useState("");
  const [subRegion1State, setSubRegion1State] = useState({
    name: "",
    id: "",
  });
  const [subRegion2State, setSubRegion2State] = useState({
    name: "",
    id: "",
  });
  const [values, setValues] = useState({
    nickname: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: checkNickname } = useMutation<boolean, Error, string>({
    mutationFn: async (nickname: string) => {
      if (!nickname) {
        throw new Error("닉네임을 입력해주세요.");
      }

      // 닉네임 중복확인
      const response = await axios.get(
        "https://go-gym.site/api/auth/check-nickname",
        {
          params: { nickname },
        },
      );
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
      const response = await axios.put(
        "https://go-gym.site/api/auth/reset-password",
        {
          email: user?.email,
          //수정하기
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        },
      );
      if (response.status === 200) {
        return true;
      } else {
        throw new Error("비밀번호 이미 존재합니다.");
      }
    },
    onSuccess: () => {
      setIsPasswordAvailable(true);
      alert("비밀번호 변경 되었습니다.");
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
        nickname: values.nickname || user.nickname,
        phone: values.phone || user.phone,
        profileImageUrl: file || user.profileImageUrl,
        regionId1: subRegion1State.id || user.regionId1,
        regionId2: subRegion2State.id || user.regionId2,
      }),
    onSuccess: () => {
      alert("수정완료");
      router.push("/mypage");
    },
  });

  const { data: subRegions } = useQuery({
    queryKey: ["subRegion", region1State],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axiosInstance.get(
        `/api/regions?name=${region1State}`,
      );
      return response;
    },
    staleTime: 10000,
    enabled: !!region1State,
  });

  const { data: sub2Regions } = useQuery({
    queryKey: ["subRegion", region2State],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axiosInstance.get(
        `/api/regions?name=${region2State}`,
      );
      return response;
    },
    staleTime: 10000,
    enabled: !!region2State,
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

  const handleChangeRegion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion1State(e.target.value);
  };

  const handleChangeRegion2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion2State(e.target.value);
  };

  const handleChangeSubRegion = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubRegion1State({
      ...subRegion1State,
      id: e.target.value,
    });
  };

  const handleChangeSubRegion2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubRegion2State({
      ...subRegion2State,
      id: e.target.value,
    });

    console.log(subRegion1State);
    console.log(subRegion2State);
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
              placeholder="현재 비밀번호"
              disabled={false}
              name="currentPassword"
              value={values.currentPassword}
              onChange={handleChangeValue}
            />
          </div>
          <div>
            <SignupInput
              type="password"
              placeholder="새 비밀번호"
              disabled={false}
              name="newPassword"
              value={values.newPassword}
              onChange={handleChangeValue}
            />
          </div>
          <div className="flex justify-between">
            <div>
              <SignupInput
                type="password"
                placeholder="새 비밀번호 확인"
                disabled={false}
                value={values.newPasswordConfirm}
                name="newPasswordConfirm"
                onChange={handleChangeValue}
              />
              {values.newPassword !== values.newPasswordConfirm && (
                <p className="text-xs text-red-500">
                  비밀번호가 일치하지않습니다.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (values.newPassword !== values.newPassword) {
                  alert("비밀번호가 다릅니다.");
                  return;
                }
                checkPassword(values.newPassword);
              }}
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
          <select
            value={region1State}
            onChange={handleChangeRegion}
            className="w-full rounded-md border border-gray-300 p-3 focus:outline-none"
          >
            <option value="">관심지역1</option>
            {regions?.map((region) => (
              <option key={region.id} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <select
            value={subRegion1State.id}
            onChange={handleChangeSubRegion}
            className="w-full rounded-md border border-gray-300 p-3"
          >
            <option value="">세부 지역 선택</option>
            {subRegions &&
              subRegions.map((data: { name: string; regionId: string }) => (
                <option key={data.name} value={data.regionId}>
                  {data.name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-full">
          <select
            value={region2State}
            onChange={handleChangeRegion2}
            className="w-full rounded-md border border-gray-300 p-3 focus:outline-none"
          >
            <option value="">관심지역2</option>
            {regions?.map((region) => (
              <option key={region.id} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* 세부지역 만들기 */}
        <div className="w-full">
          <select
            value={subRegion2State.id}
            onChange={handleChangeSubRegion2}
            className="w-full rounded-md border border-gray-300 p-3"
          >
            <option value="">세부 지역 선택</option>
            {sub2Regions &&
              sub2Regions.map((data: { name: string; regionId: string }) => (
                <option key={data.name} value={data.regionId}>
                  {data.name}
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
          수정하기
        </button>
      </div>
    </form>
  );
}
