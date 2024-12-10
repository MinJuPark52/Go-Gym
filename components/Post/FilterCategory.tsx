"use client";

import { categoryPropsType } from "@/constants/category";
import { useEffect } from "react";

export function FilterCategory({
  label,
  categoryName,
  options,
  value,
  onInit,
  onSelect,
}: categoryPropsType) {
  useEffect(() => {
    const data = options.filter((option) => option.value === value);
    if (data.length > 0) {
      onInit?.(label, data[0].optionName || "");
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={label} className="text-sm text-gray-500">
        {categoryName}
      </label>
      <select
        className="w-48 pl-2 h-12 border border-gray-400 rounded-md focus:outline-blue-400  text-gray-600 cursor-pointer"
        name={label}
        id={label}
        onChange={onSelect}
        value={value}
      >
        <option value={"default"}>선택 하기</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.optionName}
          </option>
        ))}
      </select>
    </div>
  );
}
