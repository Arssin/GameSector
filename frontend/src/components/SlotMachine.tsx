import { useEffect, useRef, useState } from "react"

import { createSlotMachine } from "./slotMachineLogic"

export const SlotMachine = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [spinFunction, setSpinFunction] = useState<(() => void) | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      const { app, spin } = createSlotMachine(containerRef.current)
      setSpinFunction(() => spin)

      return () => {
        app.destroy(true)
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
