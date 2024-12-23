"use client";

import React, { useState } from "react";
import {
  Map,
  MapMarker,
  useKakaoLoader,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";

export default function SearchKakaoMap({
  onClick,
  onClose,
}: {
  onClick: (
    latitude: number,
    longitude: number,
    gymKaKaoUrl: string,
    gymName: string,
  ) => void;
  onClose: () => void;
}) {
  const [loading, error] = useKakaoLoader({
    //에러나는거같네요
    appkey: process.env.KAKAO_JAVASCRIPT_KEY!,
    libraries: ["services"],
  });

  const [keyword, setKeyword] = useState(""); // 검색 키워드
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [places, setPlaces] = useState<any[]>([]); // 검색 결과를 저장할 상태
  const [mapCenter, setMapCenter] = useState({
    lat: 37.566535,
    lng: 126.9779692,
  }); // 지도 중심

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.kakao.maps.services) return;

    const ps = new window.kakao.maps.services.Places();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ps.keywordSearch(keyword, (data: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setTimeout(() => {
          setPlaces(data); // 검색 결과를 상태로 설정
          if (data.length > 0) {
            setMapCenter({
              lat: parseFloat(data[0].y),
              lng: parseFloat(data[0].x),
            }); // 첫 번째 검색 결과로 중심 이동
          }
        }, 0);
      }
    });
  };

  const handleClickList = (lat: number, lng: number) => {
    setMapCenter({
      lat,
      lng,
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error(error);
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-center gap-4 bg-slate-400 bg-opacity-30">
      {/* 검색 UI */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="w-48 rounded-lg px-4 py-2 focus:outline-blue-300 md:w-72"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          검색
        </button>
        <button
          type="button"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => onClose()}
        >
          닫기
        </button>
      </form>

      {/* 지도 */}
      <div className="flex h-[80%] w-[100%] translate-y-4 justify-center md:w-[80%]">
        <Map
          center={mapCenter}
          style={{ width: "100%", height: "100%" }}
          level={3}
        >
          {/* 검색 결과에 따라 마커를 지도에 표시 */}
          {places.map((place, index) => (
            <MapMarker
              key={index}
              position={{ lat: parseFloat(place.y), lng: parseFloat(place.x) }}
              clickable={true}
            >
              <CustomOverlayMap
                position={{
                  lat: parseFloat(place.y),
                  lng: parseFloat(place.x),
                }}
              >
                <div className="translate-y-[-64px] rounded border border-blue-300 bg-white p-2 font-bold text-gray-600">
                  {place.place_name}
                </div>
              </CustomOverlayMap>
            </MapMarker>
          ))}
        </Map>

        {/* 검색 결과 목록 */}
        {places.length ? (
          <ul className="h-[100%] w-[50%] max-w-md overflow-y-auto bg-white">
            {places.map((place, index) => (
              <li
                key={index}
                onClick={() =>
                  handleClickList(parseFloat(place.y), parseFloat(place.x))
                }
                className="mb-4 cursor-pointer border-b p-4"
              >
                <strong className="block">{place.place_name}</strong>
                <p className="text-sm">
                  {place.road_address_name || place.address_name}
                </p>
                <a
                  href={`https://map.kakao.com/link/to/${place.place_name},${place.y},${place.x}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  길찾기
                </a>
                <button
                  className="ml-2 rounded-xl bg-blue-500 p-1 pl-2 pr-2 text-sm font-bold text-white transition-all hover:bg-blue-600"
                  onClick={() =>
                    onClick(
                      parseFloat(place.y),
                      parseFloat(place.x),
                      `https://map.kakao.com/link/to/${place.place_name},${place.y},${place.x}`,
                      place.place_name,
                    )
                  }
                >
                  선택
                </button>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
