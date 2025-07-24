import * as PIXI from "pixi.js"
import { NUMBER_OF_REELS, REEL_WIDTH, SYMBOL_SIZE, SYMBOL_SIZE_HEIGHT, SYMBOL_SIZE_WIDTH } from "./slot.const"
import { sound } from "@pixi/sound"
import { BlurFilter } from "@pixi/filter-blur"

export function createSlotMachine(container: HTMLElement, video: HTMLVideoElement, onWin: () => void): { app: PIXI.Application; spin: () => void; getReels: () => any[] } {
  const app = new PIXI.Application({ width: 1280, height: 1024, transparent: true })
  container.appendChild(app.view)

  const videoTexture = PIXI.Texture.from(video)
  const videoSprite = new PIXI.Sprite(videoTexture)
  videoSprite.width = app.screen.width
  videoSprite.height = app.screen.height
  app.stage.addChild(videoSprite)

  const slotSymbolTextures = [PIXI.Texture.from("/slot-one.png"), PIXI.Texture.from("/slot-two.png"), PIXI.Texture.from("/slot-three.png"), PIXI.Texture.from("/slot-four.png")]

  const reels: { container: PIXI.Container; symbols: PIXI.Sprite[]; position: number; previousPosition: number; blur: BlurFilter }[] = []
  const reelContainer = new PIXI.Container()
  app.stage.addChild(reelContainer)

  // Lever removed, handled by React SVG
  // Lever animation removed

  // Confetti container
  const confettiContainer = new PIXI.Container()
  app.stage.addChild(confettiContainer)

  const mask = new PIXI.Graphics()
  mask.beginFill(0xffffff)
  mask.drawRect(0, 0, REEL_WIDTH * NUMBER_OF_REELS, SYMBOL_SIZE * 3 - 10)
  mask.endFill()
  reelContainer.mask = mask
  reelContainer.addChild(mask)

  if (!sound.exists("slotDone")) {
    sound.add("slotDone", "./slot-in-2.mp3")
  }

  for (let i = 0; i < NUMBER_OF_REELS; i++) {
    const reel = {
      container: new PIXI.Container(),
      symbols: [] as PIXI.Sprite[],
      position: 0,
      previousPosition: 0,
      blur: new BlurFilter(),
    }
    reel.container.x = i * REEL_WIDTH
    reel.blur.blurX = 0
    reel.blur.blurY = 0
    reel.container.filters = [reel.blur] as any
    for (let j = 0; j < 6; j++) {
      const symbol = new PIXI.Sprite(slotSymbolTextures[Math.floor(Math.random() * slotSymbolTextures.length)])
      symbol.y = j * SYMBOL_SIZE
      symbol.width = SYMBOL_SIZE_WIDTH
      symbol.height = SYMBOL_SIZE_HEIGHT
      reel.symbols.push(symbol)
      reel.container.addChild(symbol)
    }
    reels.push(reel)
    reelContainer.addChild(reel.container)
  }

  reelContainer.x = (app.screen.width - reelContainer.width) / 2
  reelContainer.y = (app.screen.height - reelContainer.height) / 2 + 195

  let spinning = false
  let autoSpin = false // controlled externally
  let spinCount = 0

  const tweening: any[] = []

  // Confetti effect
  function showConfetti() {
    confettiContainer.removeChildren()
    for (let i = 0; i < 80; i++) {
      const conf = new PIXI.Graphics()
      conf.beginFill(Math.random() * 0xffffff)
      conf.drawRect(0, 0, 6, 12)
      conf.endFill()
      conf.x = Math.random() * app.screen.width
      conf.y = (Math.random() * app.screen.height) / 2 + app.screen.height / 4
      // @ts-ignore
      conf.vx = (Math.random() - 0.5) * 4
      // @ts-ignore
      conf.vy = Math.random() * 4 + 2
      confettiContainer.addChild(conf)
    }
    setTimeout(() => confettiContainer.removeChildren(), 2000)
  }

  // Lever animation
  // Lever animation removed

  // Tween helper
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

  // Spin logic
  const spin = (forceWin = false) => {
    if (spinning) return
    spinning = true
    spinCount++
    // If forceWin or spinCount is 3-5th spin, set up win
    let shouldWin = false
    if (forceWin) shouldWin = true
    if (spinCount % 3 === 0 || spinCount % 4 === 0 || spinCount % 5 === 0) shouldWin = true
    if (shouldWin) {
      // Set all middle row symbols to the same texture
      const middleIndex = Math.floor(reels[0].symbols.length / 2)
      const winTexture = slotSymbolTextures[Math.floor(Math.random() * slotSymbolTextures.length)]
      for (let r = 0; r < reels.length; r++) {
        reels[r].symbols[middleIndex].texture = winTexture
      }
    }
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i]
      const extra = Math.floor(Math.random() * 3)
      const target = r.position + 10 + i * 5 + extra
      const time = 2500 + i * 600 + extra * 600
      tweenTo(r, "position", target, time, backout(0.2), () => {}, i === reels.length - 1 ? reelsComplete : () => {})
    }
  }

  // Win check
  const reelsComplete = () => {
    spinning = false
    // Win if all symbols in the middle row are the same
    const middleIndex = Math.floor(reels[0].symbols.length / 2)
    const middleTextures = reels.map((r) => r.symbols[middleIndex].texture.baseTexture)
    const win = middleTextures.every((t) => t === middleTextures[0])
    if (win) {
      sound.play("slotDone")
      showConfetti()
      onWin()
    }
    // Auto-spin after short delay
    if (autoSpin) {
      setTimeout(() => spin(), 1200)
    }
  }

  // Main ticker
  app.ticker.add(() => {
    videoTexture.update()
    // Lever animation removed
    // Confetti animation
    for (let i = 0; i < confettiContainer.children.length; i++) {
      const conf = confettiContainer.children[i] as any
      // @ts-ignore
      conf.x += conf.vx
      // @ts-ignore
      conf.y += conf.vy
      // @ts-ignore
      conf.vy += 0.2
      if (conf.y > app.screen.height) conf.y = app.screen.height / 2
    }
    // Reels
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i]
      r.blur.blurY = (r.position - r.previousPosition) * 8
      r.previousPosition = r.position
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j]
        const prevy = s.y
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          s.texture = slotSymbolTextures[Math.floor(Math.random() * slotSymbolTextures.length)]
        }
      }
    }
    // Tweening
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

  // Math helpers
  const lerp = (a1: number, a2: number, t: number) => a1 * (1 - t) + a2 * t
  const backout = (amount: number) => (t: number) => --t * t * ((amount + 1) * t + amount) + 1

  // Disable pointer events on stage
  const stage: any = app.stage
  stage.eventMode = "none"
  // Only allow spin by lever click (optional, can remove if you want pointerdown anywhere)
  // Lever removed, handled by React

  // Start first auto-spin
  // No auto-spin by default

  // Expose getReels for React
  return { app, spin, getReels: () => reels }
}
