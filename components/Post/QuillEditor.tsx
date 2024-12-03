'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

// ReactQuill을 동적으로 클라이언트에서만 로드되도록 설정
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

import 'react-quill-new/dist/quill.snow.css';

interface Props {
  onChange: (value: string) => void;
}

const formats = [
  'font',
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'indent',
  'link',
  'align',
  'color',
  'background',
  'size',
];

export default function QuillEditor({ onChange }: Props) {
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }], // 헤더 설정
          ['bold', 'italic', 'underline'], // 텍스트 포맷
          [{ list: 'ordered' }, { list: 'bullet' }], // 리스트 설정
          [{ color: [] }, { background: [] }], // 색상
          ['link'], // 링크
        ],
      },
    };
  }, []);

  return (
    <ReactQuill
      style={{ height: '360px' }}
      theme="snow"
      modules={modules}
      formats={formats}
      onChange={(value) => onChange(value)}
    />
  );
}
