'use client';

import {
  FILTER_CATEGORY_TYPE,
  FIRST_FILTER_CATEGORY,
  SECOND_FILTER_CATEGORY,
} from '@/constants/category';
import { FilterCategory } from './FilterCategory';
import { useState } from 'react';
import ActiveFilter from './ActiveFilter';

interface categoryStateType {
  postType: 'default' | 'SELL' | 'BUY';
  postStatus: 'default' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  membershipType:
    | 'default'
    | 'MEMBERSHIP_ONLY'
    | 'MEMBERSHIP_WITH_PT'
    | 'PT_ONLY';
  membershipDuration: 'default' | 'months_0_3' | 'months_3_6' | 'months_6_plus';
  PTCount: 'default' | 'PT_0_10' | 'PT_10_25' | 'PT_25_plus';
}

export default function Filter({
  onChangeFilter,
  filter,
}: {
  onChangeFilter: (obj: categoryStateType) => void;
  filter: categoryStateType;
}) {
  const [activeFilters, setActiveFilters] = useState({
    postType: {
      id: 1,
      filterValue: '',
    },
    postStatus: {
      id: 2,
      filterValue: '',
    },
    membershipType: {
      id: 3,
      filterValue: '',
    },
    membershipDuration: {
      id: 4,
      filterValue: '',
    },
    PTCount: {
      id: 5,
      filterValue: '',
    },
  });

  const handleSelectOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilter({ ...filter, [e.target.name]: e.target.value });

    if (e.target.value !== 'default') {
      setActiveFilters({
        ...activeFilters,
        [e.target.name]: {
          id: e.target.name,
          filterValue: e.target.options[e.target.selectedIndex].text,
        },
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        [e.target.name]: {
          id: e.target.name,
          filterValue: '',
        },
      });
    }
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
      <div className=" flex items-center gap-4 pl-4 mt-8 w-[100%] h-16 rounded-lg bg-blue-300">
        {Object.values(activeFilters).map((value) => (
          <ActiveFilter key={value.id} filterValue={value.filterValue} />
        ))}
      </div>
    </div>
  );
}
