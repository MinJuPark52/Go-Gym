"use client";

import {
  FILTER_CATEGORY_TYPE,
  FIRST_FILTER_CATEGORY,
  SECOND_FILTER_CATEGORY,
} from "@/constants/category";
import { FilterCategory } from "./FilterCategory";
import { useState } from "react";
import ActiveFilter from "./ActiveFilter";

interface categoryStateType {
  ["post-type"]: "default" | "SELL" | "BUY";
  status:
    | "default"
    | "POSTING"
    | "SALE_COMPLETED"
    | "PURCHASE_COMPLETED"
    | "HIDDEN";
  ["membership-type"]:
    | "default"
    | "MEMBERSHIP_ONLY"
    | "MEMBERSHIP_WITH_PT"
    | "PT_ONLY";
  ["month-type"]: "default" | "MONTHS_0_3" | "MONTHS_3_6" | "MONTHS_6_PLUS";
  ["pt-type"]: "default" | "PT_0_10" | "PT_10_25" | "PT_25_PLUS";
}

export default function Filter({
  onChangeFilter,
  filter,
}: {
  onChangeFilter: (obj: categoryStateType) => void;
  filter: categoryStateType;
}) {
  const obj: any = {};

  const [activeFilters, setActiveFilters] = useState({
    postType: "",
    postStatus: "",
    membershipType: "",
    membershipDuration: "",
    PTCount: "",
  });

  const handleInitFilters = (key: string, value: string) => {
    obj[key] = value;
    setActiveFilters({ ...activeFilters, ...obj });
  };

  const handleSelectOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeFilter({ ...filter, [e.target.name]: e.target.value });

    if (e.target.value !== "default") {
      setActiveFilters({
        ...activeFilters,
        [e.target.name]: e.target.options[e.target.selectedIndex].text,
      });
    } else {
      setActiveFilters({
        ...activeFilters,
        [e.target.name]: "",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        {FIRST_FILTER_CATEGORY.map((category: FILTER_CATEGORY_TYPE) => (
          <FilterCategory
            key={category.label}
            {...category}
            value={filter[category.label]}
            onInit={handleInitFilters}
            onSelect={handleSelectOptions}
          />
        ))}
      </div>
      <div className="grid max-w-[406px] grid-cols-2 gap-3 md:min-w-[604px] md:max-w-[605px] md:grid-cols-3">
        {SECOND_FILTER_CATEGORY.map((category: FILTER_CATEGORY_TYPE) => (
          <FilterCategory
            key={category.label}
            {...category}
            value={filter[category.label]}
            onInit={handleInitFilters}
            onSelect={handleSelectOptions}
          />
        ))}
      </div>
      <div className="mt-8 flex h-16 w-[100%] items-center gap-4 rounded-lg bg-gray-200 pl-4">
        {Object.values(activeFilters).map((value, idx) => (
          <ActiveFilter key={idx} filterValue={value} />
        ))}
      </div>
    </div>
  );
}
