type BrandMarkProps = {
  size?: number;
};

export function BrandMark({ size = 28 }: BrandMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden focusable="false">
      <rect width="64" height="64" rx="16" fill="var(--sr-brand-primary)" />
      <circle
        cx="32"
        cy="32"
        r="17"
        stroke="var(--sr-text-inverse)"
        strokeOpacity="0.28"
        strokeWidth="3"
      />
      <circle
        cx="32"
        cy="32"
        r="9"
        stroke="var(--sr-text-inverse)"
        strokeOpacity="0.55"
        strokeWidth="3"
      />
      <path
        d="M32 32 L46 19"
        stroke="var(--sr-text-inverse)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="44" cy="22" r="5" fill="var(--sr-brand-accent)" />
    </svg>
  );
}
