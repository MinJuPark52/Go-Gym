import Image from 'next/image';
import profile from '../../public/default_profile.png';

export default function DefaultProfile({ width }: { width: string }) {
  const classWidth = `w-${width}`;
  return (
    <div className={` ${classWidth} rounded-full`}>
      <Image src={profile} alt="profile" priority />
    </div>
  );
}
