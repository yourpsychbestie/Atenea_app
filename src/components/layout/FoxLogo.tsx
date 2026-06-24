interface FoxLogoProps {
  size?: number
  className?: string
  /** face = solo cara · sit = sentado · curl = enroscado */
  variant?: 'face' | 'sit' | 'curl'
}

const SPRITE_PATH = '/fox-sprite.png'
const SPRITE_W = 1115
const SPRITE_H = 944

const CROP = {
  // Recortes cuadrados para cada zorrito del sprite
  face: { x: 18, y: 95, size: 360 },
  sit: { x: 8, y: 430, size: 430 },
  curl: { x: 430, y: 80, size: 640 },
} as const

export default function FoxLogo({ size = 40, className = '', variant = 'face' }: FoxLogoProps) {
  const crop = CROP[variant]
  const scale = size / crop.size

  return (
    <span
      style={{
        width: `${size}px`,
        height: `${size}px`,
        overflow: 'hidden',
        display: 'inline-block',
        position: 'relative',
      }}
      className={className}
      role="img"
      aria-label="Atenea"
    >
      <img
        src={SPRITE_PATH}
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          left: `${-crop.x * scale}px`,
          top: `${-crop.y * scale}px`,
          width: `${SPRITE_W * scale}px`,
          height: `${SPRITE_H * scale}px`,
          maxWidth: 'none',
          userSelect: 'none',
        }}
      />
    </span>
  )
}
