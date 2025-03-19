// components/ui/CustomImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface CustomImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
}

const CustomImage = ({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = '/images/default-avatar.png'
}: CustomImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default CustomImage;