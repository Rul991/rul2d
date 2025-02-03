import { randomRange } from "./numberWork.js"

/**
 * Converts HSL values to an HSLA color string.
 * 
 * @param {number} h - The hue value (0-360).
 * @param {number} [s=100] - The saturation value (0-100).
 * @param {number} [l=50] - The lightness value (0-100).
 * @param {number} [a=1] - The alpha (opacity) value (0-1).
 * @returns {string} The HSLA color string.
 */

export const hsla = (h, s = 100, l = 50, a = 1) => `hsla(${h}, ${s}%, ${l}%, ${a})`

/**
 * Converts RGB values to an RGBA color string.
 * 
 * @param {number} r - The red value (0-255).
 * @param {number} g - The green value (0-255).
 * @param {number} b - The blue value (0-255).
 * @param {number} [a=1] - The alpha (opacity) value (0-1).
 * @returns {string} The RGBA color string.
 */

export const rgba = (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`

/**
 * Generates a random RGBA color string with full opacity (alpha = 1).
 * 
 * @returns {string} A random RGBA color string.
 */

export const randomRGBA = () => rgba(randomRange(0, 255), randomRange(0, 255), randomRange(0, 255), 1)