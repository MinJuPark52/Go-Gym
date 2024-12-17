import Image from "next/image";

interface propsType {
  imageUrl: string;
}
export default function PostDetailImage({ imageUrl }: propsType) {
  return (
    <>
      {imageUrl ? (
        <div className="cursor-pointer">
          <Image
            src={imageUrl}
            alt="헬스장 이미지"
            className="rounded-lg"
            width={240}
            height={240}
          />
        </div>
      ) : (
        <p>등록된 사진이 없습니다</p>
      )}
    </>
  );
}
