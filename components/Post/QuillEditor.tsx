'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface props {
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

export default function QuillEditor({ onChange }: props) {
  const [values, setValues] = useState<string>('');

  useEffect(() => {
    onChange(values);
  }, [values]);

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
      onChange={(value) => setValues(value)}
    />
  );
}
