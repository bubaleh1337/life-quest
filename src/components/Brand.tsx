import React from "react";

type BrandLockupProps = {
  compact?: boolean;
  label?: string;
};

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" role="presentation" focusable="false">
        <circle cx="32" cy="32" r="19" fill="none" stroke="#F8F4F7" strokeWidth="3" opacity="0.32" />
        <path d="M32 14.5L35.8 24.6L46.6 28.4L35.8 32.2L32 42.3L28.2 32.2L17.4 28.4L28.2 24.6L32 14.5Z" fill="#F2D092" />
        <circle cx="32" cy="28.5" r="1.8" fill="#fff8fc" opacity="0.92" />
      </svg>
    </span>
  );
}

export default function BrandLockup({ compact = false, label = "Life Quest" }: BrandLockupProps) {
  return (
    <span className={compact ? "brand-lockup compact" : "brand-lockup"}>
      <BrandMark />
      <span>{label}</span>
    </span>
  );
}
