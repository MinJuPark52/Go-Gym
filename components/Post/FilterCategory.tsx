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
        className="h-12 w-48 cursor-pointer rounded-md border border-gray-400 pl-1 text-gray-600 focus:outline-blue-400"
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
