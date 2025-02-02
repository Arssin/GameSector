import { useEffect, useMemo, useRef, useState } from "react"
import { BlurFilter, TextStyle } from "pixi.js"
import { Stage, Container, Text, Graphics } from "@pixi/react"
import { NUMBER_OF_REELS, REEL_HEIGHT, REEL_WIDTH, SYMBOLS, TIMEOUT_SPINNING } from "./slot.const"

export const SlotMachine = () => {
  const [reelPositions, setReelPosition] = useState(Array(NUMBER_OF_REELS).fill(0))
  const [targetPositions, setTargetPositions] = useState(Array(NUMBER_OF_REELS).fill(0))
  const [isSpinning, setIsSpinning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const blurFilter = useMemo(() => new BlurFilter(0), [])

  const spinReels = () => {
    console.log("Spinandoo!")
    if (isSpinning) return

    setIsSpinning(true)

    const newTargets = reelPositions.map((pos) => pos + 10 + Math.random() * 10)
    setTargetPositions(newTargets)

    startTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(animate)
  }

  const animate = (currentTime: number) => {
    if (!startTimeRef.current) startTimeRef.current = currentTime

    const elapsedTime = currentTime - startTimeRef.current
    const progress = Math.min(elapsedTime / TIMEOUT_SPINNING, 1)


    const newPositions = reelPositions.map((pos, index) => {
      const target = targetPositions[index]
      return pos + (target - pos) * progress
    })
    setReelPosition(newPositions)

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      setIsSpinning(false)
      startTimeRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const BUTTON_SPIN = {
    height: 50,
    width: 200,
  }

  return (
    <Stage width={1200} height={1000} options={{ background: 0x1099bb, antialias: true, eventMode: "dynamic" }}>
      {Array.from({ length: NUMBER_OF_REELS }).map((_, reelIndex) => (
        <Container key={reelIndex} x={reelIndex * REEL_WIDTH}>
          {SYMBOLS.map((symbol, symbolIndex) => {
            const y = ((reelPositions[reelIndex] + symbolIndex) % SYMBOLS.length) * (REEL_HEIGHT / SYMBOLS.length)
            return (
              <Text
                key={symbolIndex}
                text={symbol}
                x={REEL_WIDTH / 2}
                y={y}
                anchor={0.5}
                style={
                  new TextStyle({
                    fontSize: 36,
                    fill: 0xffffff,
                  })
                }
                filters={[blurFilter]}
              />
            )
          })}
        </Container>
      ))}

      <Container x={600 - BUTTON_SPIN.width / 2} y={900} eventMode="dynamic" pointerdown={spinReels} pointerover={() => setIsHovered(true)} pointerout={() => setIsHovered(false)} cursor="pointer">
        <Graphics
          cursor="pointer"
          draw={(g) => {
            g.clear()
            g.beginFill(isHovered ? 0xcc0000 : 0xff0000)
            g.lineStyle(2, 0xffffff)
            g.drawRect(0, 0, BUTTON_SPIN.width, BUTTON_SPIN.height)
            g.endFill()
          }}
        />
        <Text
          text="Spin!!!"
          anchor={0.5}
          cursor="pointer"
          x={BUTTON_SPIN.width / 2}
          y={BUTTON_SPIN.height / 2}
          style={
            new TextStyle({
              fontSize: 24,
              fill: 0xffffff,
            })
          }
        />
      </Container>
    </Stage>
  )
}
