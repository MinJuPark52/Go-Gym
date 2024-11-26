import { categoryPropsType } from '@/constants/category';

export function FilterCategory({
  label,
  categoryName,
  options,
  onSelect,
}: categoryPropsType) {
  return (
    <div className=" flex flex-col gap-2">
      <label htmlFor={label} className="text-sm text-gray-500">
        {categoryName}
      </label>
      <select
        className=" w-48 pl-2 h-12 border border-gray-400 rounded-md focus:outline-blue-400  text-gray-600"
        name={label}
        id={label}
        onChange={onSelect}
      >
        <option defaultValue={'default'} value={'default'}>
          선택 하기
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.optionName}
          </option>
        ))}
      </select>
    </div>
  );
}
