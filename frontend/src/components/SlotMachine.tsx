import { useEffect, useRef, useState } from "react"
import videoSrc from "../assets/background.mp4"
import { createSlotMachine } from "./slotMachineLogic"

export const SlotMachine = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [spinFunction, setSpinFunction] = useState<(() => void) | null>(null)
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

      const { app, spin } = createSlotMachine(containerRef.current, video)
      setSpinFunction(() => spin)

      return () => {
        app.destroy(true)
        if (videoRef.current) {
          videoRef.current.remove()
        }
      }
    }
  }, [])

  return (
    <div>
      <div ref={containerRef}></div>
      <button
        onClick={() => {
          if (spinFunction) spinFunction()
        }}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Spin
      </button>
    </div>
  )
}
