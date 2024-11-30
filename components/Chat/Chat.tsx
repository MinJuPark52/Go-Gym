'use client';

import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    console.log(text);
    setText('');
  };

  const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <form
      onSubmit={handleSubmitMessage}
      className=" relative flex flex-col w-[70%] h-[100%] bg-blue-100 bg-opacity-40"
    >
      <div></div>
      <div className=" flex absolute bottom-0 left-0 w-full h-40 bg-white p-2">
        <textarea
          className=" flex-[4] focus:outline-none"
          placeholder="메세지를 입력해주세요"
          onChange={handleText}
          onKeyDown={handleKeyDown}
          value={text}
        />
        <div className=" flex flex-[1] justify-center items-center">
          <button
            type="submit"
            className='className=" p-1 pl-6 pr-6 rounded-lg bg-blue-300 text-xl text-white font-bold'
          >
            전송
          </button>
        </div>
      </div>
    </form>
  );
}
