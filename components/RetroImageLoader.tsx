'use client';

import Image from 'next/image';
import { useState } from 'react';

interface RetroImageLoaderProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

export default function RetroImageLoader({
  src,
  alt,
  fill = false,
  width,
  height,
  style,
  className,
  onClick,
  priority = false,
}: RetroImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`retro-image-container ${className || ''}`} style={style} onClick={onClick}>
      {isLoading && (
        <div className="retro-loader">
          <div className="retro-loader-content">
            <div className="retro-spinner"></div>
            <div className="retro-loader-text">LOADING...</div>
            <div className="retro-progress-bar">
              <div className="retro-progress-fill"></div>
            </div>
          </div>
        </div>
      )}
      {hasError && (
        <div className="retro-error">
          <div className="retro-error-icon">⚠</div>
          <div className="retro-error-text">ERROR</div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        style={{
          ...style,
          objectFit: style?.objectFit || 'cover',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        priority={priority}
      />
    </div>
  );
}
