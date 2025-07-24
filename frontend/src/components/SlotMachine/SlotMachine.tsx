import { useEffect, useRef, useState } from "react"
import videoSrc from "../../assets/background.mp4"
import { createSlotMachine } from "./slotMachineLogic"
import className from "./SlotMachine.module.css"

export const SlotMachine = () => {
  // ...existing code...
  const [isPortrait, setIsPortrait] = useState(false)
  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 700
      setIsPortrait(isMobile && window.innerHeight > window.innerWidth)
    }
    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)
    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [spinFunction, setSpinFunction] = useState<(() => void) | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [autoSpin, setAutoSpin] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  // kasynowa otoczka: dźwignia animowana
  const handleLever = () => {
    if (spinFunction) spinFunction()
  }

  useEffect(() => {
    if (containerRef.current) {
      const video = document.createElement("video")
      video.src = videoSrc
      video.autoplay = true
      video.loop = true
      video.muted = true
      video.style.display = "none"
      document.body.appendChild(video)
      videoRef.current = video

      const { app, spin, getReels } = createSlotMachine(containerRef.current, video, () => {
        const reels = getReels()
        const middleSymbols = reels.map((r) => r.symbols[Math.floor(r.symbols.length / 2)])
        const firstUrl = middleSymbols[0].texture.baseTexture.source?.url
        const win = middleSymbols.every((s) => s.texture.baseTexture.source?.url === firstUrl)
        setSpinning(false)
        if (win) onWin()
      })

      setSpinFunction(() => () => {
        if (!spinning) {
          setSpinning(true)
          spin()
        }
      })

      return () => {
        app.destroy(true)
        if (videoRef.current) videoRef.current.remove()
      }
    }
  }, [])

  // autospin effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (autoSpin && spinFunction && !spinning) {
      interval = setInterval(() => {
        spinFunction()
      }, 1800)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoSpin, spinFunction, spinning])

  const triggerConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  useEffect(() => {
    if (!showConfetti) return
    const canvas = document.getElementById("confetti") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const particles = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * W,
      y: Math.random() * -H,
      r: Math.random() * 10 + 5,
      d: Math.random() * 10 + 5,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    }))

    let animationFrameId: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y += Math.cos(p.d) + 3
        p.tiltAngle += p.tiltAngleIncrement
        p.tilt = Math.sin(p.tiltAngle) * 15

        ctx.beginPath()
        ctx.lineWidth = p.r
        ctx.strokeStyle = p.color
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y)
        ctx.lineTo(p.x + p.tilt, p.y + p.r)
        ctx.stroke()
      }
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationFrameId)
  }, [showConfetti])

  useEffect(() => {
    let interval: any
    if (autoSpin && spinFunction && !spinning) {
      interval = setInterval(() => {
        if (!spinning) spinFunction()
      }, 3500)
    }
    return () => clearInterval(interval)
  }, [autoSpin, spinFunction, spinning])

  const toggleFullscreen = () => {
    const el = document.documentElement
    if (!document.fullscreenElement) {
      el.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const handleLeverPull = () => {
    const lever = document.getElementById("lever")
    if (lever) {
      lever.classList.add("pulling")
      setTimeout(() => lever.classList.remove("pulling"), 600)
    }
    if (spinFunction) spinFunction()
  }

  return (
    <div className={className.screenWrap}>
      {isPortrait && (
        <div className={className.rotateInfo}>
          Aby zagrać, obróć telefon poziomo.
          <br />
          <span role="img" aria-label="rotate">
            🔄
          </span>
        </div>
      )}
      {!isPortrait && (
        <>
          <div>Player Panel</div>
          <div className={className.gameMain}>
            <div ref={containerRef} className={className.pixiContainer} />
            {/* Dźwignia po prawej */}
          </div>
          <div>
            LowerPanel
            <div className={className.leverContainer}>
              <button className={spinning ? `${className.lever} ${className.disabled}` : className.lever} onClick={handleLeverPull} disabled={spinning} aria-label="Spin lever">
                <svg width="80" height="160" viewBox="0 0 80 160">
                  <rect x="35" y="30" width="10" height="100" rx="5" fill="#bfa76f" stroke="#fff200" strokeWidth="2" />
                  <circle className="lever-knob" cx="40" cy="30" r="18" fill="#fff200" stroke="#bfa76f" strokeWidth="3" />
                </svg>
              </button>
            </div>
          </div>
          {/* Toggle autospin na dole */}
          <div className={className.autospinToggleWrap}>
            <label className={className.autospinLabel}>
              <input type="checkbox" checked={autoSpin} onChange={(e) => setAutoSpin(e.target.checked)} className={className.autospinCheckbox} />
              <span className={className.autospinText}>Autospin</span>
            </label>
          </div>
        </>
      )}
    </div>
  )
}
