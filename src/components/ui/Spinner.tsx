export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `${Math.max(2, size / 8)}px solid rgba(13, 27, 42, 0.12)`,
        borderTopColor: 'var(--color-amber)',
        borderRadius: '50%',
        animation: 'harbinger-spin 0.7s linear infinite',
      }}
    >
      <style>{`
        @keyframes harbinger-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div
      style={{
        height: '100%',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Spinner size={36} />
    </div>
  );
}
