// ParticleEffect.tsx
import React, { useState, useRef, useLayoutEffect } from 'react'
import Particle, { ParticleProps } from './Particle'
import { selectSettings } from './redux/slices/settingsSlice'
import { useAppSelector } from './hooks'

interface IParticle extends ParticleProps {
  id: number
}

interface ParticleEffectProps {
  children: React.ReactNode
}

const EMOTE_COUNT = 12

const ClickParticles: React.FC<ParticleEffectProps> = ({ children }) => {
  const [particles, setParticles] = useState<IParticle[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const { name, page, clickParticles } = useAppSelector(selectSettings)

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setContainerSize({ w: width, h: height })
    }
  }, [])

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const count = Math.floor(Math.random() * 5) + 5 // 5–12 эмодзи
    const newParticles: IParticle[] = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI
      const baseDistance = Math.random() * 25 + 45 // 45–70
      const distance = baseDistance * 2 // в 2 раза дальше
      const dx = Math.cos(angle) * distance
      const dy = Math.sin(angle) * distance

      // размер 5% от ширины контейнера × 3
      const baseSize = containerSize.w * 0.05
      const size = baseSize * 3.2 * (Math.random() * 0.3 + 0.7)

      const rotation = Math.random() * 720 - 360 // –360…+360°
      // выбираем случайный индекс от 1 до EMOTE_COUNT
			const indexes = clickParticles[page]
      const emoteIndex = indexes[Math.floor(Math.random() * indexes.length)]
      const src = `/assets/emotes/${name}/${emoteIndex}.png`

      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        dx,
        dy,
        size,
        rotation,
        src
      })
    }

    setParticles((prev) => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)))
    }, 700)
  }

  return (
    <div ref={containerRef} onClick={handleClick} style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </div>
  )
}

export default ClickParticles
