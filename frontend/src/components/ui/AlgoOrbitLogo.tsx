import React from 'react';

export interface AlgoOrbitLogoProps {
  size?: number | string;
  variant?: 'icon' | 'badge' | 'full';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showWordmark?: boolean;
  animate?: boolean;
  glow?: boolean;
  style?: React.CSSProperties;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  [key: string]: any;
}

/**
 * AlgoOrbitLogo
 * Simple, minimal, ultra-clear letter symbol logo for AlgoOrbit.
 * Features:
 * - Bold, high-contrast geometric Letter 'A' monogram
 * - Razor-sharp 24x24 vector grid with zero blurry padding
 * - High-contrast tactile badge with theme-aware gradient
 * - Crystal clear at all viewport sizes (mobile, desktop, and favicon)
 */
export default function AlgoOrbitLogo({
  size = 34,
  variant = 'icon', // 'icon' | 'badge' | 'full'
  className = '',
  iconClassName = '',
  textClassName = '',
  showWordmark = false,
  animate = false,
  glow,
  ...props
}: AlgoOrbitLogoProps) {
  const isFull = variant === 'full' || showWordmark;
  const isBadge = variant === 'badge';

  // Bold, crisp, architectural Letter 'A' glyph
  const svgGlyph = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: isBadge ? '62%' : typeof size === 'number' ? `${size}px` : size,
        height: isBadge ? '62%' : typeof size === 'number' ? `${size}px` : size,
      }}
      className={`shrink-0 overflow-visible transition-transform duration-200 ${animate ? 'hover:scale-105' : ''} ${iconClassName}`}
      aria-label="AlgoOrbit Letter Logo"
      role="img"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.8 3.2C11.3 2.4 12.7 2.4 13.2 3.2L21 19.8C21.6 21 20.7 22.5 19.3 22.5H16.2C15.4 22.5 14.7 22 14.3 21.2L13 18.2H11L9.7 21.2C9.3 22 8.6 22.5 7.8 22.5H4.7C3.3 22.5 2.4 21 3 19.8L10.8 3.2ZM12 8.5L10.1 14.5H13.9L12 8.5Z"
        fill="currentColor"
      />
    </svg>
  );

  if (isBadge) {
    const badgeSize = typeof size === 'number' ? `${size}px` : size;
    return (
      <span
        style={{
          width: badgeSize,
          height: badgeSize,
        }}
        className={`inline-flex items-center justify-center rounded-[10px] sm:rounded-xl bg-gradient-to-br from-[#2fe92b] via-[#22c55e] to-[#15803d] text-[#07080b] shadow-[0_4px_14px_rgba(47,233,43,0.38)] shrink-0 transition-all duration-300 hover:shadow-[0_6px_20px_rgba(47,233,43,0.55)] hover:scale-105 select-none ${className}`}
        {...props}
      >
        {svgGlyph}
      </span>
    );
  }

  if (isFull) {
    const badgeSize = typeof size === 'number' ? `${size}px` : size;
    return (
      <div className={`inline-flex items-center gap-2.5 no-underline select-none ${className}`} {...props}>
        <span
          style={{ width: badgeSize, height: badgeSize }}
          className="inline-flex items-center justify-center rounded-[10px] sm:rounded-xl bg-gradient-to-br from-[#2fe92b] via-[#22c55e] to-[#15803d] text-[#07080b] shadow-[0_4px_14px_rgba(47,233,43,0.38)] shrink-0"
        >
          {svgGlyph}
        </span>
        <div className={`flex items-baseline font-extrabold tracking-tight leading-none text-foreground ${textClassName}`}>
          <span className="text-foreground">Algo</span>
          <span className="bg-gradient-to-r from-emerald-500 via-[#2fe92b] to-[#10b981] dark:from-[#3efd3a] dark:to-[#10b981] bg-clip-text text-transparent ml-0.5">
            Orbit
          </span>
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center text-primary ${className}`} {...props}>
      {svgGlyph}
    </span>
  );
}
