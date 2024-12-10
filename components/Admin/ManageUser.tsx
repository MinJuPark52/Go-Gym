'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useLoginStore from '@/store/useLoginStore';
import { useEffect } from 'react';

export default function ManageUser() {
  const { adminLogin } = useLoginStore();
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ['uesr'],
    queryFn: async () =>
      (await axios.get('http://localhost:4000/members')).data,
    staleTime: 10000,
  });

  useEffect(() => {
    adminLogin();
  }, []);

  const handleUserClick = (nickname: string) => {
    router.push(`/admin/userDetail/${nickname}`);
  };

  if (isPending) {
    return <p>로딩중</p>;
  }

  return (
    <div className="flex flex-col justify-center items-start ml-72 mt-12">
      <h2 className="text-3xl font-bold mb-8">고객관리</h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>No.</th>
              <th>nickname</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {data.map(
              (user: { email: string; nickname: string }, index: number) => (
                <tr
                  className="hover:bg-base-200 cursor-pointer"
                  onClick={handleUserClick.bind(null, user.nickname)}
                  key={user.nickname}
                >
                  <th>{index + 1}</th>
                  <td>{user.nickname}</td>
                  <td>{user.email}</td>
                </tr>
              )
            )}
            {/* row 1 */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
