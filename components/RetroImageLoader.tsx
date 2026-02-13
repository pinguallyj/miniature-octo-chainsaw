'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

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
  // Don't show loading animation for GIFs - they're animated already
  const isGif = src.toLowerCase().endsWith('.gif');
  const [isLoading, setIsLoading] = useState(!isGif);
  const [hasError, setHasError] = useState(false);

  // Reset loading state when src changes (e.g. navigating gallery photos)
  useEffect(() => {
    const newIsGif = src.toLowerCase().endsWith('.gif');
    if (!newIsGif) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [src]);

  // Fallback timeout - show image after 3 seconds even if onLoad doesn't fire
  useEffect(() => {
    if (!isGif && isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isGif, isLoading, src]);

  // For fill images, use an absolute-positioned wrapper so the parent controls dimensions
  if (fill) {
    return (
      <div
        className={`retro-image-container ${className || ''}`}
        style={{ position: 'absolute', inset: 0 }}
        onClick={onClick}
      >
        {isLoading && !isGif && (
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
          fill
          style={{
            objectFit: style?.objectFit || 'cover',
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          priority={priority}
          unoptimized={isGif}
        />
      </div>
    );
  }

  return (
    <div
      className={`retro-image-container ${className || ''}`}
      onClick={onClick}
    >
      {isLoading && !isGif && (
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
          objectFit: style?.objectFit || 'cover',
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        priority={priority}
        unoptimized={isGif}
      />
    </div>
  );
}
