import { useEffect, useRef, useState } from "react"
import videoSrc from "../assets/background.mp4"
import { createSlotMachine } from "./slotMachineLogic"

export const SlotMachine = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [spinFunction, setSpinFunction] = useState<(() => void) | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [autoSpin, setAutoSpin] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

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
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#111",
        overflow: "hidden",
      }}
    >
      <div
        ref={containerRef}
        style={{
          border: "10px solid gold",
          borderRadius: "20px",
          boxShadow: "0 0 30px gold",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* SVG Lever */}
      <svg
        id="lever"
        onClick={handleLeverPull}
        width="80"
        height="160"
        viewBox="0 0 80 160"
        style={{
          position: "absolute",
          right: "5%",
          top: "40%",
          cursor: "pointer",
          zIndex: 10,
          transformOrigin: "top center",
          transition: "transform 0.2s ease-in-out",
        }}
      >
        <rect x="30" y="40" width="20" height="100" rx="10" fill="#444" />
        <circle cx="40" cy="30" r="20" fill="red" />
      </svg>

      {/* Spin Button */}
      <button
        onClick={handleLeverPull}
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "20px 60px",
          fontSize: "28px",
          fontWeight: "bold",
          borderRadius: "12px",
          background: "linear-gradient(45deg, #28a745, #218838)",
          color: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          animation: "pulse 2s infinite",
          border: "none",
          cursor: "pointer",
        }}
      >
        SPIN
      </button>

      {/* Fullscreen toggle */}
      <button
        onClick={toggleFullscreen}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          background: "#333",
          color: "#fff",
          border: "2px solid gold",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>
      <label className="autospin">
        <input type="checkbox" checked={autoSpin} onChange={(e) => setAutoSpin(e.target.checked)} /> Auto Spin
      </label>

      {/* Confetti */}
      {showConfetti && (
        <canvas
          id="confetti"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 999,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.1); }
          100% { transform: translateX(-50%) scale(1); }
        }

        #lever.pulling {
          transform: rotate(30deg);
        }
      `}</style>
    </div>
  )
}
