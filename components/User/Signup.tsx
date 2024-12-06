'use client';

import { ChangeEvent, useState } from 'react';
import axios from 'axios';

interface Signup {
  email: string;
  nickname: string;
  phone: string;
  password: string;
  regionId1: string | null;
  regionId2: string | null;
  profileImageUrl: string;
}

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
}

interface SignupErrors {
  [key: string]: string;
  name: string;
  email: string;
  nickname: string;
  phone: string;
  password: string;
  regionId1: string;
  regionId2: string;
  profileImageUrl: string;
}

const SignupInput: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  errorMessage,
}) => (
  <div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 rounded-md border border-gray-300"
    />

    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </div>
);

const areas = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '충청북도',
  '충청남도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치시',
  '강원특별자치도',
  '전북특별자치도',
];

export default function SignupPage() {
  const [signupFormData, setsignupFormData] = useState({
    name: '',
    email: '',
    nickname: '',
    phone: '',
    password: '',
    regionId1: null,
    regionId2: null,
    profileImageUrl: '',
  });

  const [signupErrors, setsignupErrors] = useState({
    name: '',
    email: '',
    nickname: '',
    phone: '',
    password: '',
    regionId1: '',
    regionId2: '',
    profileImageUrl: '',
  });

  const [areaAuto, setAreaAuto] = useState<string[]>([]);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [loading, setLoading] = useState({
    email: false,
    nickname: false,
  });

  // const fetchAutoArea = async (area: string) => {
  //   if (!area) return;
  //   setLoading((prev) => ({ ...prev, email: true }));
  //   try {
  //     const response = await axios.get(
  //       `/backend/api/regions?name=${signupFormData.area}`
  //     );
  //     setAreaAuto(response.data);
  //   } catch (err) {
  //     console.error('하위 지역 정보를 불러오는 데 실패했습니다.', err);
  //   } finally {
  //     setLoading((prev) => ({ ...prev, email: false }));
  //   }
  // };

  const handleSignupChange =
    (field: keyof typeof signupFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setsignupFormData({ ...signupFormData, [field]: value });

      // if (field === 'area') {
      //   fetchAutoArea(value);
      // }
    };

  const validateForm = () => {
    let valid = true;
    const newErrors: SignupErrors = { ...signupErrors };

    const fields = [
      {
        name: 'name',
        message: '이름을 입력하세요',
        condition: !signupFormData.name,
      },
      {
        name: 'nickname',
        message: '닉네임을 입력해주세요.',
        condition: !signupFormData.nickname,
      },
      {
        name: 'phone',
        message: '핸드폰 번호를 입력해주세요.',
        condition: !signupFormData.phone,
      },
    ];

    fields.forEach((field) => {
      newErrors[field.name] = field.condition ? field.message : '';
      valid = field.condition ? false : valid;
    });

    if (!signupFormData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      valid = false;
    } else if (
      !/(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(signupFormData.password)
    ) {
      newErrors.password = '비밀번호는 특수문자, 영어, 숫자를 포함해야 합니다.';
      valid = false;
    } else {
      newErrors.password = '';
    }

    setsignupErrors(newErrors);
    return valid;
  };

  // 이메일 중복 확인
  const checkEmail = async (email: string) => {
    if (loading.email || !email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("이메일 주소에 '@'을 포함해주세요.");
      return;
    }

    setLoading((prev) => ({ ...prev, email: true }));

    try {
      const response = await axios.get<Signup[]>(
        '/backend/api/auth/check-email',
        { params: { email } }
      );

      if (response.status === 200) {
        setIsEmailAvailable(true);
        alert('이메일 사용 가능합니다.');
      } else {
        alert('이메일 이미 존재합니다.');
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
      alert('서버 오류가 발생했습니다.');
      setIsEmailAvailable(false);
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };

  // 닉네임 중복 확인
  const checkNickname = async (nickname: string) => {
    if (loading.nickname || !nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setLoading((prev) => ({ ...prev, nickname: true }));

    try {
      const response = await axios.get('/backend/api/auth/check-nickname', {
        params: { nickname },
      });

      if (response.status === 200) {
        setIsNicknameAvailable(true);
        alert('닉네임 사용 가능합니다.');
      } else {
        alert('닉네임 이미 존재합니다.');
      }
    } catch (error) {
      console.error('Error checking nickname availability:', error);
      alert('서버 오류가 발생했습니다.');
      setIsNicknameAvailable(false);
    } finally {
      setLoading((prev) => ({ ...prev, nickname: false }));
    }
  };

  //회원가입 로직
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailAvailable || !isNicknameAvailable) {
      alert('중복확인을 해주세요.');
      return;
    }

    if (validateForm()) {
      try {
        const response = await axios.post<Signup[]>(
          '/backend/api/auth/sign-up',
          signupFormData
        );

        if (response.status === 200) {
          const emailResponse = await axios.post(
            '/backend/api/auth/send-verification-email',
            null,
            { params: { email: signupFormData.email } }
          );

          if (emailResponse.status === 200) {
            alert(
              '이메일 인증 링크가 전송되었습니다. 이메일을 통해 인증해주세요'
            );
          } else {
            throw new Error('링크 전송 X');
          }
        } else {
          throw new Error('회원가입 실패');
        }
      } catch (error) {
        console.error('오류:', error);
        alert('회원가입에 실패했습니다.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 border-r-gray-300 w-full h-[40rem]">
      <form
        onSubmit={handleSignupSubmit}
        className="w-full h-[35rem] max-w-md bg-white p-8 space-y-3 overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold text-center">회원가입</h2>
        <div>
          <SignupInput
            type="text"
            placeholder="프로필 이미지 URL"
            value={signupFormData.profileImageUrl}
            onChange={handleSignupChange('profileImageUrl')}
            errorMessage={signupErrors.profileImageUrl}
          />
        </div>

        <div>
          <SignupInput
            type="text"
            placeholder="이름"
            value={signupFormData.name}
            onChange={handleSignupChange('name')}
            errorMessage={signupErrors.name}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <SignupInput
              type="text"
              placeholder="이메일"
              value={signupFormData.email}
              onChange={handleSignupChange('email')}
              errorMessage={signupErrors.email}
            />
          </div>
          <button
            type="button"
            onClick={() => checkEmail(signupFormData.email)} // Updated handler
            disabled={loading.email}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {loading.email ? '확인 중' : '중복확인'}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <SignupInput
              type="text"
              placeholder="닉네임"
              value={signupFormData.nickname}
              onChange={handleSignupChange('nickname')}
              errorMessage={signupErrors.nickname}
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => checkNickname(signupFormData.nickname)}
              disabled={loading.nickname}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              {loading.nickname ? '확인 중' : '중복확인'}
            </button>
          </div>
        </div>

        <div>
          <SignupInput
            type="text"
            placeholder="핸드폰 번호"
            value={signupFormData.phone}
            onChange={handleSignupChange('phone')}
            errorMessage={signupErrors.phone}
          />
        </div>

        <div>
          <SignupInput
            type="password"
            placeholder="비밀번호"
            value={signupFormData.password}
            onChange={handleSignupChange('password')}
            errorMessage={signupErrors.password}
          />
        </div>

        {/* <select
          value={signupFormData.area}
          onChange={handleSignupChange('area')}
          className="w-full p-2 rounded-md border border-gray-300"
        >
          <option value="">관심지역1</option>
          {areas.map((area, index) => (
            <option key={index} value={area}>
              {area}
            </option>
          ))}
        </select>

        {signupFormData.area && areaAuto.length > 0 && (
          <select
            value={signupFormData.area2}
            onChange={handleSignupChange('area2')}
            className="w-full p-2 rounded-md border border-gray-300"
          >
            <option value="">하위 지역 선택</option>
            {areaAuto.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
        )}

        <select
          value={signupFormData.area}
          onChange={handleSignupChange('area')}
          className="w-full p-2 rounded-md border border-gray-300"
        >
          <option value="">관심지역2</option>
          {areas.map((area, index) => (
            <option key={index} value={area}>
              {area}
            </option>
          ))}
        </select>

        {signupFormData.area && areaAuto.length > 0 && (
          <select
            value={signupFormData.area2}
            onChange={handleSignupChange('area2')}
            className="w-full p-2 rounded-md border border-gray-300"
          >
            <option value="">지역 선택</option>
            {areaAuto.map((area, index) => (
              <option key={index} value={area}>
                {area}
              </option>
            ))}
          </select>
        )} */}

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
  );
}
