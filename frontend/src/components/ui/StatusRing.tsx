interface StatusRingProps {
  progress: number;
  color: string;
  size?: number;
  onClick?: () => void;
}

export function StatusRing({ progress, color, size = 16, onClick }: StatusRingProps) {
  const completed = progress >= 100;
  const empty = progress <= 0;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="relative shrink-0 cursor-pointer rounded-full transition-transform hover:scale-110 active:scale-95"
      style={{ width: size, height: size }}
      aria-label={completed ? "Concluído" : empty ? "Não iniciado" : "Em andamento"}
    >
      {completed ? (
        <span
          className="block h-full w-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px -1px ${color}99` }}
        />
      ) : (
        <span
          className="block h-full w-full rounded-full"
          style={{
            background: empty ? "transparent" : `conic-gradient(${color} ${progress * 3.6}deg, var(--color-border) 0deg)`,
            border: empty ? `1.5px solid var(--color-ink-3)` : "none",
          }}
        >
          <span
            className="absolute rounded-full"
            style={{
              inset: empty ? 0 : 2.5,
              background: "var(--color-surface)",
              display: empty ? "none" : "block",
            }}
          />
        </span>
      )}
    </button>
  );
}
