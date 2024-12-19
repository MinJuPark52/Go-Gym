"use client";

import useLoginStore from "@/store/useLoginStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function SanctionUser() {
  const { adminLogin } = useLoginStore();
  const params = useParams();
  useEffect(() => {
    adminLogin();
  }, []);

  const userId = params?.userId as string;

  return (
    <div className="ml-72 mt-12">
      <h2>제재계정: {decodeURIComponent(userId)}</h2>
      <div className="p-6">
        <table className="w-full table-auto border-spacing-2">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2 font-bold">
                처리 상태
              </th>
              <th className="border border-gray-400 p-2 text-left">
                <label className="mr-4 inline-block">
                  <input type="checkbox" className="mr-2" /> 정지
                </label>
                <label className="inline-block">
                  <input type="checkbox" className="mr-2" /> 경고 (7일)
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2 font-bold">이름</td>
              <td className="border border-gray-400 p-2">
                <textarea
                  className="h-20 w-full border-none p-2 focus:outline-none"
                  placeholder="이름을 입력하세요"
                ></textarea>
              </td>
            </tr>

            <tr>
              <td className="border border-gray-400 p-2 font-bold">계정</td>
              <td className="border border-gray-400 p-2">
                <textarea
                  className="h-20 w-full border-none p-2 focus:outline-none"
                  placeholder="계정을 입력하세요"
                ></textarea>
              </td>
            </tr>

            <tr>
              <td className="border border-gray-400 p-2 font-bold">
                정지 사유
              </td>
              <td className="border border-gray-400 p-2">
                <label className="mr-4 inline-block">
                  <input type="checkbox" className="mr-2" /> 욕설
                </label>
                <label className="mr-4 inline-block">
                  <input type="checkbox" className="mr-2" /> 사기
                </label>
                <label className="inline-block">
                  <input type="checkbox" className="mr-2" /> 광고
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
