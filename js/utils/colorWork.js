import { randomRange } from "./numberWork.js"

export const hsla = (h, s = 100, l = 50, a = 1) => `hsla(${h}, ${s}%, ${l}%, ${a})`
export const rgba = (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`

export const randomRGBA = () => rgba(randomRange(0, 255), randomRange(0, 255), randomRange(0, 255), 1)