import React, { useState, useEffect } from 'react'

export interface ParticleProps {
  x: number
  y: number
  dx: number
  dy: number
  size: number
  src: string
  rotation: number
  duration?: number
}

const Particle: React.FC<ParticleProps> = ({
  x, y, dx, dy, size, src, rotation, duration = 700
}) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const transform = animate
    ? `translate(${dx}px, ${dy}px) rotate(${rotation}deg)`
    : `translate(0, 0) rotate(0deg)`

  return (
    <img
      src={src}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        pointerEvents: 'none',
        transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-in`,
        transform,
        opacity: animate ? 0 : 1
      }}
      alt=""
    />
  )
}

export default Particle
