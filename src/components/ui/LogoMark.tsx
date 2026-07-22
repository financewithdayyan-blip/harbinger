interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 28 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 680 680"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      <polygon points="340,160 520,500 160,500" fill="currentColor" />
      <polygon points="340,280 430,440 250,440" fill="#C8973A" />
    </svg>
  );
}
