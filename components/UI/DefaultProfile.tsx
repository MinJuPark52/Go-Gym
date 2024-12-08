import Image from 'next/image';
import profile from '../../public/default_profile.png';

export default function DefaultProfile({ width }: { width: string }) {
  return (
    <div className="avatar">
      <div className={`w-${width} rounded-full`}>
        <Image src={profile} alt="profile" priority />
      </div>
    </div>
  );
}
