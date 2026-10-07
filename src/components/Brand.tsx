import React from "react";

type BrandLockupProps = {
  compact?: boolean;
  label?: string;
};

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" role="presentation" focusable="false">
        <path d="M17 45.5C18.5 33.5 26.5 23.5 40 18" fill="none" stroke="#F8F4F7" strokeWidth="4.75" strokeLinecap="round" />
        <path d="M23.5 42.5C18.5 40.5 16.5 35 18 29.5C23 31.5 25.5 37 23.5 42.5Z" fill="#F8F4F7" opacity="0.95" />
        <path d="M28 39C32.5 38 36 34.5 36.5 29.5C31.5 30.5 28 34 28 39Z" fill="#F3D8A8" opacity="0.98" />
        <path d="M41 13l2.3 4.9 5.4.7-3.9 3.8.9 5.4-4.7-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.7L41 13Z" fill="#F2D092" />
        <circle cx="41" cy="20.3" r="10.5" fill="none" stroke="#F8F4F7" strokeWidth="1.7" opacity="0.38" />
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
