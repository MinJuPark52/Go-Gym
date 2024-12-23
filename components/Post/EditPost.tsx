"use client";

import {
  FILTER_CATEGORY_TYPE,
  FIRST_FILTER_CATEGORY,
} from "@/constants/category";
import { FilterCategory } from "./FilterCategory";
import { ChangeEvent, useEffect, useState } from "react";
import QuillEditor from "./QuillEditor";
import ImageSelect from "./ImageSelect";
import Image from "next/image";
import SearchKakaoMap from "./SearchKaKaoMap";
import { useMutation } from "@tanstack/react-query";
import { getAccessToken, getCity } from "@/api/api";
import axiosInstance from "@/api/axiosInstance";
import { useRouter } from "next/navigation";
import S3ImageUrl from "@/hooks/S3ImageUrl";
import useLoginStore from "@/store/useLoginStore";

interface categoryStateType {
  postType: "default" | "SELL" | "BUY";
  membershipType:
    | "default"
    | "MEMBERSHIP_ONLY"
    | "MEMBERSHIP_WITH_PT"
    | "PT_ONLY";
}

export default function EditPost() {
  const router = useRouter();
  const { loginState } = useLoginStore();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (isLogin && !loginState) {
      router.push("/login");
    }
    setIsLogin(true);
  }, [loginState, isLogin]);

  const [values, setValues] = useState({
    title: "",
    content: "",
    expirationDate: "",
    remainingSessions: 0,
    amount: "",
    city: "",
    district: "",
    // ptType: 'PT_0_10',
    // monthsType: 'MONTHS_0_3',
  });
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapValue, setMapValue] = useState({
    latitude: 0,
    longitude: 0,
    gymKakaoUrl: "",
    gymName: "",
  });
  //<Record<string, string | File | null>> 백엔드 연동시 타입추가
  const [preview, setPreview] = useState<Record<string, File | null>>({
    imageUrl1: null,
    imageUrl2: null,
    imageUrl3: null,
  });
  const [images, setImages] = useState<Record<string, string | null>>({
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
  });

  const [categoryValue, setCategoryValue] = useState<categoryStateType>({
    postType: "default",
    membershipType: "default",
  });

  //토큰발급

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getToken = async () => {
        const response = await getAccessToken();
        if (response) {
          sessionStorage.setItem("accessToken", response);
        }
      };

      getToken();
    }
  }, []);

  useEffect(() => {
    // mapValue.latitude가 0이 아닌 경우에만 getCity 호출
    const token = sessionStorage.getItem("accessToken");

    if (mapValue.latitude !== 0 && token) {
      const fetchCityData = async () => {
        const response = await getCity(
          mapValue.latitude.toString(),
          mapValue.longitude.toString(),
          token,
        );

        if (response) {
          setValues({
            ...values,
            city: response.sido_nm,
            district: response.sgg_nm,
          });
        }
      };

      fetchCityData();
    }
  }, [mapValue]);

  const { mutate, isPending } = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (jsonData: Record<string, any>) =>
      await axiosInstance.post(`/api/posts`, jsonData),
    onSuccess: () => {
      alert("게시글이 작성되었습니다.");
      router.push("/community");
    },
    onError: () => {
      alert("게시글이 작성되지않았습니다.");
    },
  });

  const handleValues = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleContent = (value: string) => {
    setValues({
      ...values,
      content: value,
    });
  };

  const handleSelectOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryValue({
      ...categoryValue,
      [e.target.name === "post-type" ? "postType" : "membershipType"]:
        e.target.value,
    });
  };

  const handleFileSelect = async (key: string, img: File) => {
    // 백엔드 연동시 파일자체 보내기
    setPreview({
      ...preview,
      [key]: img,
    });
    const newImg = await S3ImageUrl(img.name, img, "posts");
    if (newImg) {
      setImages((prevImages) => ({
        ...prevImages,
        [key]: newImg.toString(),
      }));
    }
  };

  const handleDeleteImage = (el: string) => {
    setImages({ ...images, [el]: null });
    setPreview({ ...preview, [el]: null });
  };

  const handleClickGym = (
    latitude: number,
    longitude: number,
    gymKakaoUrl: string,
    gymName: string,
  ) => {
    setMapValue({
      latitude,
      longitude,
      gymKakaoUrl,
      gymName,
    });
    setIsMapOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mapValue.gymName.trim().length === 0) {
      alert("헬스장을 선택해주세요");
      return;
    }

    if (Object.values(categoryValue).find((status) => status === "default")) {
      alert("카테고리를 선택해주세요");
      return;
    }

    if (values.expirationDate.trim().length === 0) {
      alert("회원권의 기간과 가격을 입력해주세요");
      return;
    }

    if (Number.isNaN(+values.amount.replace(/,/g, ""))) {
      alert("숫자만 입력해주세요");
      return;
    }

    if (values.remainingSessions < 0 || +values.amount.replace(/,/g, "") < 0) {
      alert("가격과 PT횟수는 0 이상으로 입력해주세요");
      return;
    }

    if (
      values.title.trim().length === 0 ||
      values.content.trim().length === 0
    ) {
      alert("제목과 내용을 입력해주세요");
      return;
    }

    // setValues({
    //   ...values,
    //   monthsType: updateMonthsType(values.expirationDate),
    // });
    // setValues({
    //   ...values,
    //   monthsType: updatePtType(values.remainingSessions),
    // });

    // mutate(jsonData);

    //백엔드 연동시 formData로 변환해서 보내기
    // const formData = new FormData();

    // // values 추가
    // // number가 있기때문에 toString()을 사용해 타입 고정
    // for (const key in values) {
    //   formData.append(key, values[key as keyof typeof values].toString());
    // }

    // // mapValue 추가
    // for (const key in mapValue) {
    //   formData.append(key, mapValue[key as keyof typeof mapValue].toString());
    // }

    // // images 추가
    // for (const key in images) {
    //   if (images[key]) {
    //     formData.append(key, images[key] as File);
    //   }
    // }

    // // categoryValue 추가
    // for (const key in categoryValue) {
    //   formData.append(key, categoryValue[key as keyof typeof categoryValue]);
    // }

    // const data: Record<string, string> = {};
    // formData.forEach((value, key) => {
    //   data[key] = value as string; // 값이 string 타입으로 추론되도록 처리
    // });

    mutate({
      ...values,
      ...mapValue,
      ...images,
      ...categoryValue,
      amount: +values.amount.replace(/,/g, ""),
    });
  };

  if (isPending) {
    return <p>게시글 작성중입니다 ...</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-[75%] p-8 pt-12">
        <div className="mb-4 flex flex-col gap-2">
          {mapValue.gymName ? (
            <div
              onClick={() => {
                setIsMapOpen(true);
              }}
              className="flex h-12 w-fit min-w-48 cursor-pointer items-center rounded-md border border-gray-400 pl-2 text-left text-gray-500 focus:outline-blue-400"
            >
              {mapValue.gymName}
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-active h-12 w-48 border-none bg-blue-500 text-white hover:bg-blue-700"
              onClick={() => {
                setIsMapOpen(true);
              }}
            >
              헬스장 찾기
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor={"expirationDate"} className="text-sm text-gray-500">
              회원권 마감 날짜
            </label>
            <input
              type="date"
              className="h-12 w-48 cursor-pointer rounded-md border border-gray-400 pl-2 text-gray-600 focus:outline-blue-400"
              name={"expirationDate"}
              id={"expirationDate"}
              onChange={handleValues}
              value={values.expirationDate}
              placeholder="ex) 2025/02/24"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor={"remainingSessions"}
              className="text-sm text-gray-500"
            >
              PT횟수
            </label>
            <input
              type="number"
              className="h-12 w-48 cursor-pointer rounded-md border border-gray-400 pl-2 text-gray-600 focus:outline-blue-400"
              name={"remainingSessions"}
              id={"remainingSessions"}
              value={values.remainingSessions}
              onChange={handleValues}
              placeholder="ex) 25"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={"amount"} className="text-sm text-gray-500">
              가격
            </label>
            <input
              type="text"
              className="h-12 w-48 cursor-pointer rounded-md border border-gray-400 pl-2 text-gray-600 focus:outline-blue-400"
              name={"amount"}
              id={"amount"}
              value={formatNumber(values.amount.toString())}
              onChange={handleValues}
              placeholder="ex) 250000"
            />
          </div>
        </div>
        <div className="mb-4 mt-4 flex flex-wrap gap-4 border-b border-gray-400 pb-8">
          {FIRST_FILTER_CATEGORY.map((category: FILTER_CATEGORY_TYPE) => (
            <FilterCategory
              key={category.label}
              {...category}
              onSelect={handleSelectOptions}
            />
          ))}
        </div>
        <div className="flex flex-col items-center gap-4">
          <input
            className="mb-2 mt-4 h-12 w-[100%] max-w-[1200px] rounded-lg border-2 border-blue-300 pl-4 text-2xl font-bold focus:outline-blue-300"
            placeholder="제목을 입력하세요"
            value={values.title}
            name="title"
            onChange={handleValues}
          />
          <div className="h-[400px] w-[100%] max-w-[1200px]">
            <QuillEditor onChange={handleContent} />
          </div>
          <div className="mt-8 flex w-[100%] max-w-[1200px] flex-col items-center justify-between gap-8 lg:mt-4 lg:flex-row">
            {Object.keys(preview).map((el) =>
              preview[el] ? (
                <div
                  key={el}
                  className="relative flex h-56 min-w-60 items-center justify-center overflow-hidden"
                >
                  <button
                    type="button"
                    className="absolute right-0 top-0"
                    onClick={() => handleDeleteImage(el)}
                  >
                    ❌
                  </button>
                  <Image
                    // json서버 사용시까진 blob url
                    // src={images[el] as string}
                    src={URL.createObjectURL(preview[el]!)}
                    width={224}
                    height={15}
                    alt="헬스장 이미지"
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <ImageSelect key={el} name={el} onChange={handleFileSelect} />
              ),
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bt-active btn bg-blue-500 text-white hover:bg-blue-700"
          >
            작성하기
          </button>
        </div>
      </form>
      {isMapOpen && (
        <SearchKakaoMap
          onClick={handleClickGym}
          onClose={() => {
            setIsMapOpen(false);
          }}
        />
      )}
    </>
  );
}

const formatNumber = (input: string) => {
  const numericValue = input.replace(/,/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
