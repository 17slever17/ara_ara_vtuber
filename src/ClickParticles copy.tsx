import React, { useState, useEffect } from 'react'

interface ParticleProps {
  x: number
  y: number
  dx: number
  dy: number
  size: number
  duration?: number
}

const Particle: React.FC<ParticleProps> = ({ x, y, dx, dy, size, duration = 700 }) => {
  const [animate, setAnimate] = useState<boolean>(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: 'aqua', // цвет частиц
        borderRadius: '50%',
        pointerEvents: 'none',
        transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-in`,
        transform: animate ? `translate(${dx}px, ${dy}px)` : 'translate(0, 0)',
        opacity: animate ? 0 : 1,
        mixBlendMode: 'difference'
      }}
    />
  )
}

interface IParticle extends ParticleProps {
  id: number
}

interface ParticleEffectProps {
  children: React.ReactNode
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ children }) => {
  const [particles, setParticles] = useState<IParticle[]>([])

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const containerRect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - containerRect.left
    const y = event.clientY - containerRect.top

    // Генерируем случайное количество частиц от 8 до 15
    const count = Math.floor(Math.random() * (10 - 7 + 1)) + 7
    const newParticles: IParticle[] = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI
      const distance = Math.random() * (70 - 45) + 45 // расстояние от 15 до 20 пикселей
      const dx = Math.cos(angle) * distance
      const dy = Math.sin(angle) * distance
      const size = Math.random() * (8 - 4) + 4 // размер от 5 до 10 пикселей

      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        dx,
        dy,
        size
      })
    }

    setParticles((prev) => [...prev, ...newParticles])

    // Удаляем частицы после окончания анимации (700 мс)
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)))
    }, 700)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        display: 'inline-block'
      }}
    >
      {children}
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </div>
  )
}

export default ParticleEffect
