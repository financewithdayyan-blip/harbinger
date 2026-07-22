interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 28 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      <circle cx="82" cy="100" r="56" fill="currentColor" />
      <circle cx="132" cy="100" r="56" fill="#C8973A" fillOpacity="0.88" />
    </svg>
  );
}
