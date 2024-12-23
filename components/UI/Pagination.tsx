"use client";

import { useState } from "react";

interface Props {
  page: number;
  onRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size: number;
  totalPage: number;
}

export default function Pagenation({
  page,
  onRadioChange,
  size,
  totalPage,
}: Props) {
  const [startPage, setStartPage] = useState(0);

  const handlePreviousPages = () => {
    if (startPage - size >= 0) {
      setStartPage((prev) => prev - size);
    }
  };

  const handleNextPages = () => {
    if (startPage + size < totalPage) {
      setStartPage((prev) => prev + size);
    }
  };

  const handleStartPages = () => {
    setStartPage(0);
  };

  const handleLastPages = () => {
    setStartPage(totalPage - (totalPage % size));
  };

  return (
    <div className="mb-12 flex justify-center">
      <div className="join">
        <button
          onClick={handleStartPages}
          disabled={startPage === 0}
          className="btn btn-square join-item hover:!border-blue-500 hover:!bg-blue-500 hover:text-gray-100 hover:outline-none"
        >
          {"<<"}
        </button>
        <button
          onClick={handlePreviousPages}
          disabled={startPage - size < 0}
          className="btn btn-square join-item hover:!border-blue-500 hover:!bg-blue-500 hover:text-gray-100 hover:outline-none"
        >
          {"<"}
        </button>
        {[
          ...Array(Math.max(0, Math.min(size, totalPage - startPage))).keys(),
        ].map((num) => (
          <input
            key={num}
            className="btn btn-square join-item checked:!border-blue-500 checked:!bg-blue-500"
            type="radio"
            name="options"
            aria-label={`${startPage + num + 1}`}
            value={startPage + num}
            checked={page === startPage + num}
            onChange={onRadioChange}
          />
        ))}
        <button
          disabled={startPage + size >= totalPage}
          onClick={handleNextPages}
          className="btn btn-square join-item hover:!border-blue-500 hover:!bg-blue-500 hover:text-gray-100 hover:outline-none"
        >
          {">"}
        </button>
        <button
          disabled={startPage + size >= totalPage}
          onClick={handleLastPages}
          className="btn btn-square join-item hover:!border-blue-500 hover:!bg-blue-500 hover:text-gray-100 hover:outline-none"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}
