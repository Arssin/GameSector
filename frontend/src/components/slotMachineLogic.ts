import * as PIXI from "pixi.js"
import { BlurFilter } from "@pixi/filter-blur"
import { SYMBOLS } from "./slot.const"

export function createSlotMachine(container: HTMLElement): { app: PIXI.Application; spin: () => void } {
  const app = new PIXI.Application({ width: 800, height: 600, backgroundColor: 0x1099bb })
  container.appendChild(app.view)

  const REEL_WIDTH = 160
  const SYMBOL_SIZE = 150

  const reels: { container: PIXI.Container; symbols: PIXI.Text[]; position: number; previousPosition: number; blur: BlurFilter }[] = []
  const reelContainer = new PIXI.Container()
  app.stage.addChild(reelContainer)

  for (let i = 0; i < 3; i++) {
    const reel = {
      container: new PIXI.Container(),
      symbols: [] as PIXI.Text[],
      position: 0,
      previousPosition: 0,
      blur: new BlurFilter(),
    }

    reel.container.x = i * REEL_WIDTH
    reel.blur.blurX = 0
    reel.blur.blurY = 0
    reel.container.filters = [reel.blur] as any

    for (let j = 0; j < 4; j++) {
      const symbol = new PIXI.Text(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)], {
        fontSize: 100,
        fontFamily: "Arial",
        fill: 0xffffff,
        align: "center",
      })
      symbol.y = j * SYMBOL_SIZE
      reel.symbols.push(symbol)
      reel.container.addChild(symbol)
    }

    reels.push(reel)
    reelContainer.addChild(reel.container)
  }

  reelContainer.x = (app.screen.width - reelContainer.width) / 2
  reelContainer.y = (app.screen.height - reelContainer.height) / 2

  let spinning = false

  const tweenTo = (object: any, property: string, target: number, time: number, easing: (t: number) => number, onchange: (t: any) => void, oncomplete: (t: any) => void) => {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    }

    tweening.push(tween)
    return tween
  }

  const tweening: any[] = []

  const spin = () => {
    if (spinning) return
    spinning = true

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i]
      const extra = Math.floor(Math.random() * 3)
      const target = r.position + 10 + i * 5 + extra
      const time = 2500 + i * 600 + extra * 600

      tweenTo(r, "position", target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null)
    }
  }

  const reelsComplete = () => {
    spinning = false
  }

  app.ticker.add(() => {
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i]
      r.blur.blurY = (r.position - r.previousPosition) * 8
      r.previousPosition = r.position

      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j]
        const prevy = s.y

        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          s.text = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        }
      }
    }

    const now = Date.now()
    const remove = []

    for (let i = 0; i < tweening.length; i++) {
      const t = tweening[i]
      const phase = Math.min(1, (now - t.start) / t.time)

      t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase))
      if (t.change) t.change(t)
      if (phase === 1) {
        t.object[t.property] = t.target
        if (t.complete) t.complete(t)
        remove.push(t)
      }
    }

    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1)
    }
  })

  const lerp = (a1: number, a2: number, t: number) => a1 * (1 - t) + a2 * t
  const backout = (amount: number) => (t: number) => --t * t * ((amount + 1) * t + amount) + 1

  const stage: any = app.stage
  stage.eventMode = "static"
  app.stage.on("pointerdown", spin)

  return { app, spin }
}
