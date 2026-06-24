interface FoxLogoProps {
  size?: number
  className?: string
  /** face = solo cara · sit = sentado · curl = enroscado */
  variant?: 'face' | 'sit' | 'curl'
}

const FOX_BY_VARIANT = {
  face: '/fox-face.png',
  sit: '/fox-sit.png',
  curl: '/fox-curl.png',
} as const

export default function FoxLogo({ size = 40, className = '', variant = 'face' }: FoxLogoProps) {
  const src = FOX_BY_VARIANT[variant]

  return (
    <img
      src={src}
      alt="Atenea"
      width={size}
      height={size}
      className={className}
      draggable={false}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        userSelect: 'none',
      }}
    />
  )
}
