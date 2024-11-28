interface props {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageSelect({ name, onChange }: props) {
  return (
    <div className="relative flex justify-center items-center w-60 h-56">
      <input
        type="file"
        accept="image/*"
        id="file-input"
        name={name}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <label
        htmlFor="file-input"
        className="flex flex-col items-center justify-center cursor-pointer text-gray-600"
      >
        <span className="text-4xl text-green-500">+</span>
        <span className="mt-2 text-sm font-semibold">
          {'이미지 파일을 선택하세요'}
        </span>
      </label>
    </div>
  );
}
