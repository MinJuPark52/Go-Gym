'use client';

import {
  FILTER_CATEGORY_TYPE,
  FIRST_FILTER_CATEGORY,
  SECOND_FILTER_CATEGORY,
} from '@/constants/category';
import { FilterCategory } from './FilterCategory';
import { useState } from 'react';

interface categoryStateType {
  postType: 'default' | 'sell' | 'buy';
  postStatus: 'default' | 'ing' | 'buycomplete' | 'sellComplete';
  membershipType: 'default' | 'membership' | 'membershipWithPT' | 'PTOnly';
  membershipDuration: 'default' | 'months_0_3' | 'months_3_6' | 'months_6_plus';
  PTCount: 'default' | 'PT_0_10' | 'PT_10_25' | 'PT_25_plus';
}

export default function Filter() {
  const [categoryValue, setCategoryValue] = useState<categoryStateType>({
    postType: 'sell',
    postStatus: 'ing',
    membershipType: 'membership',
    membershipDuration: 'months_0_3',
    PTCount: 'PT_0_10',
  });

  const handleSelectOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryValue({ ...categoryValue, [e.target.name]: e.target.value });
  };

  return (
    <div className=" flex flex-col gap-4">
      <div className=" flex gap-3">
        {FIRST_FILTER_CATEGORY.map((category: FILTER_CATEGORY_TYPE) => (
          <FilterCategory
            key={category.label}
            {...category}
            onSelect={handleSelectOptions}
          />
        ))}
      </div>
      <div className=" flex gap-3">
        {SECOND_FILTER_CATEGORY.map((category: FILTER_CATEGORY_TYPE) => (
          <FilterCategory
            key={category.label}
            {...category}
            onSelect={handleSelectOptions}
          />
        ))}
      </div>
      <div className=" mt-8 w-[100%] h-16 rounded-lg bg-gray-300"></div>
    </div>
  );
}
