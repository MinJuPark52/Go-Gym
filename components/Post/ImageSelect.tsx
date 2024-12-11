interface props {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageSelect({ name, onChange }: props) {
  return (
    <div className="relative flex h-56 w-60 items-center justify-center">
      <input
        type="file"
        accept="image/*"
        id="file-input"
        name={name}
        onChange={onChange}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
      <label
        htmlFor="file-input"
        className="flex cursor-pointer flex-col items-center justify-center text-gray-600"
      >
        <span className="text-4xl text-green-500">+</span>
        <span className="mt-2 text-sm font-semibold">
          {"이미지 파일을 선택하세요"}
        </span>
      </label>
    </div>
  );
}
