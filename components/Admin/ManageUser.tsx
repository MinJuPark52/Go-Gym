"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import useLoginStore from "@/store/useLoginStore";
import { useEffect } from "react";

export default function ManageUser() {
  const { adminLogin } = useLoginStore();
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ["uesr"],
    queryFn: async () =>
      (await axios.get("http://localhost:4000/members")).data,
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
    <div className="ml-72 mt-12 flex flex-col items-start justify-center">
      <h2 className="mb-8 text-3xl font-bold">고객관리</h2>
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
                  className="cursor-pointer hover:bg-base-200"
                  onClick={handleUserClick.bind(null, user.nickname)}
                  key={user.nickname}
                >
                  <th>{index + 1}</th>
                  <td>{user.nickname}</td>
                  <td>{user.email}</td>
                </tr>
              ),
            )}
            {/* row 1 */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
