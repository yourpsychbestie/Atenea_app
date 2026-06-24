interface EmptyStateProps {
  message: string
  submessage?: string
}

export default function EmptyState({ message, submessage }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden="true">
        <ellipse cx="60" cy="92" rx="34" ry="6" fill="#FDEEE6" />
        <path d="M30 38 L20 16 L46 32 Z" fill="#FDBA74" />
        <path d="M90 38 L100 16 L74 32 Z" fill="#FDBA74" />
        <ellipse cx="60" cy="58" rx="32" ry="28" fill="#FDBA74" />
        <ellipse cx="60" cy="66" rx="17" ry="13" fill="#FFF8F5" />
        <circle cx="48" cy="54" r="3.5" fill="#2A1B12" />
        <circle cx="72" cy="54" r="3.5" fill="#2A1B12" />
        <path d="M52 70 Q60 76 68 70" stroke="#2A1B12" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      <p className="mt-4 text-base font-bold text-fox-dark">{message}</p>
      {submessage && <p className="mt-1 text-sm text-gray-500">{submessage}</p>}
    </div>
  )
}
