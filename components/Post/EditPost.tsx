'use client';

import {
  FILTER_CATEGORY_TYPE,
  FIRST_FILTER_CATEGORY,
} from '@/constants/category';
import { FilterCategory } from './FilterCategory';
import { ChangeEvent, useEffect, useState } from 'react';
import QuillEditor from './QuillEditor';
import ImageSelect from './ImageSelect';
import Image from 'next/image';
import SearchKakaoMap from './SearchKaKaoMap';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { getAccessToken, getCity } from '@/api/api';

interface categoryStateType {
  postType: 'default' | 'SELL' | 'BUY';
  postStatus: 'default' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  membershipType:
    | 'default'
    | 'MEMBERSHIP_ONLY'
    | 'MEMBERSHIP_WITH_PT'
    | 'PT_ONLY';
}

export default function EditPost() {
  const [values, setValues] = useState({
    title: '',
    content: '',
    expirationDate: '',
    remainingSession: 0,
    amount: 0,
    city: '',
    district: '',
  });
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapValue, setMapValue] = useState({
    latitude: 0,
    longitude: 0,
    gymKaKaoUrl: '',
    gymName: '',
  });
  //<Record<string, string | File | null>> 백엔드 연동시 타입추가
  const [images, setImages] = useState<Record<string, string | null>>({
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
  });

  const [categoryValue, setCategoryValue] = useState<categoryStateType>({
    postType: 'default',
    postStatus: 'PENDING',
    membershipType: 'default',
  });

  //토큰발급

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getToken = async () => {
        const response = await getAccessToken();
        if (response) {
          sessionStorage.setItem('accessToken', response);
        }
      };

      getToken();
    }
  }, []);

  useEffect(() => {
    // mapValue.latitude가 0이 아닌 경우에만 getCity 호출
    const token = sessionStorage.getItem('accessToken');

    if (mapValue.latitude !== 0 && token) {
      const fetchCityData = async () => {
        const response = await getCity(
          mapValue.latitude.toString(),
          mapValue.longitude.toString(),
          token
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
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/postDetails`,
        jsonData
      ),
    onSuccess: (data) => {
      alert('게시글이 작성되었습니다.');
      console.log(data);
    },
    onError: () => {
      alert('게시글이 작성되지않았습니다.');
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
    setCategoryValue({ ...categoryValue, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // 백엔드 연동시 파일자체 보내기
      setImages({
        ...images,
        [e.target.name]: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleClickGym = (
    latitude: number,
    longitude: number,
    gymKaKaoUrl: string,
    gymName: string
  ) => {
    setMapValue({
      latitude,
      longitude,
      gymKaKaoUrl,
      gymName,
    });
    setIsMapOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mapValue.gymName.trim().length === 0) {
      alert('헬스장을 선택해주세요');
      return;
    }

    if (Object.values(categoryValue).find((status) => status === 'default')) {
      alert('카테고리를 선택해주세요');
      return;
    }

    if (values.expirationDate.trim().length === 0) {
      alert('회원권의 기간과 가격을 입력해주세요');
      return;
    }

    if (values.remainingSession < 0 || values.amount < 0) {
      alert('가격과 PT횟수는 0 이상으로 입력해주세요');
      return;
    }

    if (
      values.title.trim().length === 0 ||
      values.content.trim().length === 0
    ) {
      alert('제목과 내용을 입력해주세요');
      return;
    }

    const jsonData = {
      ...values,
      ...mapValue,
      ...images,
      ...categoryValue,
    };
    mutate(jsonData);

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

    // mutate(data);
  };

  if (isPending) {
    return <p>게시글 작성중입니다 ...</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className=" w-[75%] p-8 pt-12">
        <div className=" flex flex-col gap-2 mb-4">
          <label htmlFor={'expirationDate'} className="text-sm text-gray-500">
            헬스장 찾기
          </label>
          <input
            type="button"
            className=" min-w-48 w-fit pl-2 pr-2 h-12 border border-gray-400 rounded-md focus:outline-blue-400  text-gray-500 cursor-pointer"
            onClick={() => {
              setIsMapOpen(true);
            }}
            value={mapValue.gymName}
          />
        </div>
        <div className=" flex gap-4 mb-4">
          <div className=" flex flex-col gap-2">
            <label htmlFor={'expirationDate'} className="text-sm text-gray-500">
              회원권 마감 날짜
            </label>
            <input
              type="date"
              className=" w-48 pl-2 h-12 border border-gray-400 rounded-md focus:outline-blue-400  text-gray-600 cursor-pointer"
              name={'expirationDate'}
              id={'expirationDate'}
              onChange={handleValues}
              value={values.expirationDate}
              placeholder="ex) 2025/02/24"
            />
          </div>
          <div className=" flex flex-col gap-2">
            <label
              htmlFor={'remainingSession'}
              className="text-sm text-gray-500"
            >
              PT횟수
            </label>
            <input
              type="number"
              className=" w-48 pl-2 h-12 border border-gray-400 rounded-md focus:outline-blue-400  text-gray-600 cursor-pointer"
              name={'remainingSession'}
              id={'remainingSession'}
              value={values.remainingSession}
              onChange={handleValues}
              placeholder="ex) 25"
            />
          </div>
          <div className=" flex flex-col gap-2">
            <label htmlFor={'amount'} className="text-sm text-gray-500">
              가격
            </label>
            <input
              type="number"
              className=" w-48 pl-2 h-12 border border-gray-400 rounded-md focus:outline-blue-400  text-gray-600 cursor-pointer"
              name={'amount'}
              id={'amount'}
              value={values.amount}
              onChange={handleValues}
              placeholder="ex) 250000"
            />
          </div>
        </div>
        <div className=" flex gap-4 pb-8 mb-4 border-b border-gray-400">
          {FIRST_FILTER_CATEGORY.map((category: FILTER_CATEGORY_TYPE) => (
            <FilterCategory
              key={category.label}
              {...category}
              onSelect={handleSelectOptions}
            />
          ))}
        </div>
        <div className=" flex flex-col items-center gap-4">
          <input
            className=" w-[100%] max-w-[1200px] h-24 mt-4 mb-4 pl-4 border-2 border-blue-300 rounded-lg font-bold text-4xl focus:outline-blue-300"
            placeholder="제목을 입력하세요"
            value={values.title}
            name="title"
            onChange={handleValues}
          />
          <div className=" w-[100%] max-w-[1200px] h-[400px]">
            <QuillEditor onChange={handleContent} />
          </div>
          <div className=" flex justify-between items-center w-[100%] max-w-[1200px]">
            {Object.keys(images).map((el) =>
              images[el] ? (
                <Image
                  key={el}
                  // json서버 사용시까진 blob url  src={URL.createObjectURL(images[el] as File)}
                  src={images[el] as string}
                  alt="헬스장 이미지"
                  className="rounded-lg"
                  width={240}
                  height={240}
                  layout="intrinsic"
                />
              ) : (
                <ImageSelect key={el} name={el} onChange={handleFileSelect} />
              )
            )}
            <button
              type="submit"
              className=" p-1 pl-6 pr-6 rounded-lg bg-blue-300 text-xl text-white hover:bg-blue-500 transition-all"
            >
              작성하기
            </button>
          </div>
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
