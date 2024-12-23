"use client";

import { useDropzone } from "react-dropzone";

interface props {
  name: string;
  onChange: (name: string, file: File) => void;
}

export default function ImageSelect({ name, onChange }: props) {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  function onDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onChange(name, file); // 파일 자체를 바로 onChange로 전달
    }
  }

  return (
    <div
      className="relative flex h-56 w-60 items-center justify-center"
      {...getRootProps()}
    >
      <input
        {...getInputProps()}
        name={name}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
      <label
        htmlFor="file-input"
        className="flex cursor-pointer flex-col items-center justify-center text-gray-600"
      >
        {name === "imageUrl1" && <div>대표이미지</div>}
        <span className="text-4xl text-green-500">+</span>
        <p className="mt-2 text-sm font-semibold">파일을 올려놓거나</p>
        <p className="mt-2 text-sm font-semibold">아이콘을 클릭하세요</p>
      </label>
    </div>
  );
}
