'use client';

import {
  FILTER_CATEGORY_TYPE,
  FIRST_FILTER_CATEGORY,
} from '@/constants/category';
import { FilterCategory } from './FilterCategory';
import { useState } from 'react';
import QuillEditor from './QuillEditor';
import ImageSelect from './ImageSelect';
import Image from 'next/image';

interface categoryStateType {
  postType: 'default' | 'SELL' | 'BUY';
  postStatus: 'default' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  membershipType:
    | 'default'
    | 'MEMBERSHIP_ONLY'
    | 'MEMBERSHIP_WITH_PT'
    | 'PT_ONLY';
  membershipDuration: string;
  PTCount: string;
}

export default function EditPost() {
  const [values, setValues] = useState('');
  const [images, setImages] = useState<Record<string, string | null>>({
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
  });

  const [categoryValue, setCategoryValue] = useState<categoryStateType>({
    postType: 'SELL',
    postStatus: 'PENDING',
    membershipType: 'MEMBERSHIP_ONLY',
    membershipDuration: '',
    PTCount: '',
  });

  const handleValue = (value: string) => {
    setValues(value);
    console.log(values);
  };

  const handleSelectOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryValue({ ...categoryValue, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImages({ ...images, [e.target.name]: url });
    }
  };
  return (
    <form className=" w-[75%] p-8 pt-12">
      <div className=" flex flex-col gap-2 mb-4">
        <label htmlFor={'expirationDate'} className="text-sm text-gray-500">
          헬스장 찾기
        </label>
        <input
          type="button"
          className=" w-48 pl-2 h-12 border border-gray-400 rounded-md focus:outline-blue-400  text-gray-600 cursor-pointer"
        />
      </div>
      <div className=" flex gap-4 mb-4">
        <div className=" flex flex-col gap-2">
          <label htmlFor={'expirationDate'} className="text-sm text-gray-500">
            회원권 마감 날짜
          </label>
          <input
            className=" w-48 pl-2 h-12 border border-gray-400 rounded-md focus:outline-blue-400  text-gray-600 cursor-pointer"
            name={'expirationDate'}
            id={'expirationDate'}
            placeholder="ex) 2025/02/24"
          />
        </div>
        <div className=" flex flex-col gap-2">
          <label htmlFor={'PT_count'} className="text-sm text-gray-500">
            PT횟수
          </label>
          <input
            className=" w-48 pl-2 h-12 border border-gray-400 rounded-md focus:outline-blue-400  text-gray-600 cursor-pointer"
            name={'PT_count'}
            id={'PT_count'}
            placeholder="ex) 25"
          />
        </div>
        <div className=" flex flex-col gap-2">
          <label htmlFor={'amount'} className="text-sm text-gray-500">
            가격
          </label>
          <input
            className=" w-48 pl-2 h-12 border border-gray-400 rounded-md focus:outline-blue-400  text-gray-600 cursor-pointer"
            name={'amount'}
            id={'amount'}
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
          className=" w-[100%] max-w-[1200px] h-24 mt-4 mb-4 pl-4 rounded-lg font-bold text-4xl focus:outline-blue-300"
          placeholder="제목을 입력하세요"
        />
        <div className=" w-[100%] max-w-[1200px] h-[400px]">
          <QuillEditor onChange={handleValue} />
        </div>
        <div className=" flex justify-between items-center w-[100%] max-w-[1200px]">
          {Object.keys(images).map((el) =>
            images[el] ? (
              <Image
                key={el}
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
  );
}
