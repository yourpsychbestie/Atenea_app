interface FoxLogoProps {
  size?: number
  className?: string
  /** face = solo cara (Topbar/Toast) · sit = sentado (Login) · curl = enroscado (Bienvenida) */
  variant?: 'face' | 'sit' | 'curl'
}

// ── Cara ──────────────────────────────────────────────────────────────────────
function FaceFox() {
  return (
    <>
      {/* Orejas */}
      <path d="M22 50 L10 8 L44 34 Z" fill="#E8733A" />
      <path d="M78 50 L90 8 L56 34 Z" fill="#E8733A" />
      <path d="M24 45 L16 18 L42 32 Z" fill="#FFF0E5" />
      <path d="M76 45 L84 18 L58 32 Z" fill="#FFF0E5" />
      {/* Melena/ruff crema */}
      <ellipse cx="50" cy="72" rx="46" ry="28" fill="#FFF0E5" />
      {/* Cara naranja */}
      <ellipse cx="50" cy="58" rx="36" ry="34" fill="#E8733A" />
      {/* Hocico crema amplio */}
      <ellipse cx="50" cy="70" rx="22" ry="18" fill="#FFF0E5" />
      {/* Mejillas */}
      <ellipse cx="22" cy="64" rx="8" ry="6" fill="#F9A8D4" opacity="0.7" />
      <ellipse cx="78" cy="64" rx="8" ry="6" fill="#F9A8D4" opacity="0.7" />
      {/* Ojos */}
      <circle cx="36" cy="54" r="7" fill="#2D1A08" />
      <circle cx="64" cy="54" r="7" fill="#2D1A08" />
      <circle cx="33.5" cy="51.5" r="2.4" fill="white" />
      <circle cx="61.5" cy="51.5" r="2.4" fill="white" />
      {/* Nariz */}
      <ellipse cx="50" cy="68" rx="4" ry="3" fill="#2D1A08" />
      {/* Boca */}
      <path d="M50 71 Q46 76 42 73" stroke="#2D1A08" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M50 71 Q54 76 58 73" stroke="#2D1A08" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  )
}

// ── Sentado ───────────────────────────────────────────────────────────────────
function SitFox() {
  return (
    <>
      {/* Cola (detrás) */}
      <path d="M68 96 Q92 82 84 58 Q80 44 68 56 Q62 66 68 76 Q72 84 70 92 Z" fill="#E8733A" />
      <path d="M76 54 Q86 44 80 36 Q74 28 68 42 Q65 50 70 56 Z" fill="#FFF0E5" />
      {/* Cuerpo */}
      <ellipse cx="46" cy="76" rx="27" ry="25" fill="#E8733A" />
      {/* Pecho crema */}
      <ellipse cx="46" cy="82" rx="17" ry="17" fill="#FFF0E5" />
      {/* Orejas */}
      <path d="M33 32 L25 10 L47 28 Z" fill="#E8733A" />
      <path d="M63 32 L71 10 L49 28 Z" fill="#E8733A" />
      <path d="M34 28 L28 14 L45 26 Z" fill="#FFF0E5" />
      <path d="M62 28 L68 14 L51 26 Z" fill="#FFF0E5" />
      {/* Cabeza */}
      <ellipse cx="48" cy="44" rx="23" ry="21" fill="#E8733A" />
      {/* Hocico */}
      <ellipse cx="48" cy="53" rx="14" ry="11" fill="#FFF0E5" />
      {/* Mejillas */}
      <ellipse cx="30" cy="52" rx="7" ry="5" fill="#F9A8D4" opacity="0.7" />
      <ellipse cx="66" cy="52" rx="7" ry="5" fill="#F9A8D4" opacity="0.7" />
      {/* Ojos */}
      <circle cx="40" cy="42" r="5" fill="#2D1A08" />
      <circle cx="56" cy="42" r="5" fill="#2D1A08" />
      <circle cx="38.5" cy="40" r="1.7" fill="white" />
      <circle cx="54.5" cy="40" r="1.7" fill="white" />
      {/* Nariz */}
      <ellipse cx="48" cy="52" rx="3" ry="2.4" fill="#2D1A08" />
      {/* Patas */}
      <ellipse cx="34" cy="97" rx="9" ry="5" fill="#C8520A" />
      <ellipse cx="58" cy="97" rx="9" ry="5" fill="#C8520A" />
    </>
  )
}

// ── Enroscado ─────────────────────────────────────────────────────────────────
function CurlFox() {
  return (
    <>
      {/* Cuerpo circular */}
      <circle cx="54" cy="65" r="36" fill="#E8733A" />
      {/* Espiral de la cola */}
      <path
        d="M54 65 Q74 52 72 38 Q70 26 58 30 Q48 34 50 48 Q52 58 62 60 Q72 62 74 52"
        stroke="#C8520A" strokeWidth="11" fill="none" strokeLinecap="round"
      />
      {/* Punta de la cola (crema) */}
      <circle cx="72" cy="50" r="9" fill="#FFF0E5" />
      {/* Melena/ruff crema entre cabeza y cuerpo */}
      <ellipse cx="44" cy="37" rx="27" ry="17" fill="#FFF0E5" />
      {/* Orejas */}
      <path d="M27 26 L18 5 L42 22 Z" fill="#E8733A" />
      <path d="M59 23 L68 4 L48 20 Z" fill="#E8733A" />
      <path d="M29 23 L22 10 L40 20 Z" fill="#FFF0E5" />
      <path d="M58 21 L64 8 L50 19 Z" fill="#FFF0E5" />
      {/* Cabeza */}
      <ellipse cx="44" cy="34" rx="22" ry="20" fill="#E8733A" />
      {/* Hocico */}
      <ellipse cx="44" cy="43" rx="13" ry="10" fill="#FFF0E5" />
      {/* Mejillas */}
      <ellipse cx="28" cy="41" rx="7" ry="5" fill="#F9A8D4" opacity="0.7" />
      <ellipse cx="60" cy="41" rx="7" ry="5" fill="#F9A8D4" opacity="0.7" />
      {/* Ojos */}
      <circle cx="37" cy="31" r="5" fill="#2D1A08" />
      <circle cx="51" cy="31" r="5" fill="#2D1A08" />
      <circle cx="35.5" cy="29" r="1.7" fill="white" />
      <circle cx="49.5" cy="29" r="1.7" fill="white" />
      {/* Nariz */}
      <ellipse cx="44" cy="42" rx="3" ry="2.4" fill="#2D1A08" />
    </>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function FoxLogo({ size = 40, className = '', variant = 'face' }: FoxLogoProps) {
  const Fox = variant === 'sit' ? SitFox : variant === 'curl' ? CurlFox : FaceFox
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Atenea"
    >
      <Fox />
    </svg>
  )
}
