import React, { useId } from "react";

interface LogoProps {
  showText?: boolean;
  className?: string;
  size?: number;
}

/**
 * Logo Component - Enhanced Version
 *
 * Includes the original linear gradients and glow effects from the design system.
 * Uses useId for unique gradient IDs to safely render multiple logos on one page.
 */
export default function Logo({
  showText = true,
  className = "",
  size = 40,
}: LogoProps) {
  const id = useId();
  const mainGradientId = `logo-gradient-${id}`;
  const pathGradientId = `path-gradient-${id}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Section */}
      <div
        className="flex items-center justify-center rounded-full bg-primary/5 text-primary relative"
        style={{ width: size, height: size }}
      >
        {/* Extra glowing background layer */}
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-sm"></div>

        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: size * 0.7, height: size * 0.7 }}
          className="relative z-10 logo-glow"
        >
          {/* External Path (The Flame/Leaf container) */}
          <path
            d="M50 90C50 90 85 65 85 40C85 15 50 10 50 10C50 10 15 15 15 40C15 65 50 90 50 90Z"
            stroke={`url(#${mainGradientId})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Internal Path (The Path of Guidance) */}
          <path
            d="M50 90C50 70 50 50 50 50C50 35 65 25 75 25M50 50C50 40 40 35 30 35"
            stroke={`url(#${pathGradientId})`}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id={mainGradientId}
              x1="50"
              y1="10"
              x2="50"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#13ecc8" />
              <stop offset="1" stopColor="#0d6b5c" />
            </linearGradient>
            <linearGradient
              id={pathGradientId}
              x1="50"
              y1="25"
              x2="50"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#13ecc8" />
              <stop offset="1" stopColor="#13ecc8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text Section */}
      {showText && (
        <h2 className="text-white text-xl font-display font-bold leading-tight tracking-tight">
          Refik
        </h2>
      )}
    </div>
  );
}
