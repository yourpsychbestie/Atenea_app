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
  face: { x: 0, y: 80, size: 470 },
  sit: { x: 0, y: 430, size: 480 },
  curl: { x: 430, y: 90, size: 650 },
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
