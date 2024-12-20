import Image from "next/image";

export default function ProfileImage({ src }: { src: string }) {
  return (
    <div className={`w-10 overflow-hidden rounded-full`}>
      <Image
        src={
          src
            ? src
            : "https://go-gym-bucket.s3.ap-northeast-2.amazonaws.com/posts/2024/12/18/4893bf95-c33d-47f6-ad0e-308bb3dfd61f-slider_두번째.jpg"
        }
        alt="profile"
        fill
        priority
      />
    </div>
  );
}
