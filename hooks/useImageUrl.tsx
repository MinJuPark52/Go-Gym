import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

export default async function useImageUrl(
  fileName: string,
  file: File,
  type: string,
) {
  // /api/images/presigned-url?file-name=test.jpeg&dir-name=post  //presigned url 요청
  const presignedUrl = async () => {
    const url: string = await axiosInstance.get(`/api/images/presigned-url`, {
      params: {
        ["dir-name"]: type,
        ["file-name"]: fileName,
      },
    });

    const imageUrl = new URL(url);
    const realImg = `${imageUrl.origin}${imageUrl.pathname}`;
    console.log(realImg);
    return { url, realImg };
  };

  const { url, realImg } = await presignedUrl();
  // //반복문으로 돌리기
  // // await uploadImageToS3('', file[0]);

  const upload = async () => {
    const response = await uploadImageToS3(url, file);
    console.log(response);
  };

  upload();
  return realImg;
}

const uploadImageToS3 = async (presignedUrl: string, file: File) => {
  try {
    // Presigned URL을 사용해 S3에 PUT 요청
    const response = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type, // 파일의 MIME 타입 설정
      },
    });
    console.log(response);
    console.log("이미지 업로드 성공!");
  } catch (error) {
    console.error("S3 이미지 업로드 실패:", error);
    throw error;
  }
};
