import { rgba } from "./utils/colorWork.js"
import { randomRange } from "./utils/numberWork.js"

/**
 * Represents color in rul2d
 */
export default class Color {
    constructor() {
        this.r = 0
        this.g = 0
        this.b = 0
        this.a = 255

        this.rgbaString = ''
        this.updateRGBAString()
    }

    /**
     * Update rgbaString 
     * @returns {this}
     */

    updateRGBAString() {
        this.rgbaString = rgba(this.r, this.g, this.b, this.a / 255)

        return this
    }

    /**
     * Set Red, Green, Blue and Alpha color's components.
     * @param {number} r - Red component (0..=255)
     * @param {number} g - Green component (0..=255)
     * @param {number} b - Blue component (0..=255)
     * @param {number} [a] - Alpha component (0..=255)
     * @returns {this}
     */

    fromRGBA(r, g, b, a = 255) {
        this.r = Math.min(255, Math.max(r, 0))
        this.g = Math.min(255, Math.max(g, 0))
        this.b = Math.min(255, Math.max(b, 0))
        this.a = Math.min(255, Math.max(a, 0))
        
        return this.updateRGBAString()
    }

    /**
     * Set Hue, Saturation, Lightness and Alpha for color
     * @param {number} h - Hue (0..=360)
     * @param {number} s - Saturation (0..=100)
     * @param {number} l - Lightness (0..=100)
     * @param {number} [a] - Alpha (0..=255)
     * @returns {this}
     */

    fromHSLA(h, s, l, a = 255) {
        s /= 100
        l /= 100

        let c = (1 - Math.abs(2 * l - 1)) * s
        let x = c * (1 - Math.abs((h / 60) % 2 - 1))
        let m = l - c / 2
        let r, g, b

        if (h < 60) {
            r = c
            g = x
            b = 0
        } 
        else if (h < 120) {
            r = x
            g = c
            b = 0
        } 
        else if (h < 180) {
            r = 0
            g = c
            b = x
        } 
        else if (h < 240) {
            r = 0
            g = x
            b = c
        } 
        else if (h < 300) {
            r = x
            g = 0
            b = c
        } 
        else {
            r = c
            g = 0
            b = x
        }

        r = Math.round((r + m) * 255)
        g = Math.round((g + m) * 255)
        b = Math.round((b + m) * 255)
        a = Math.round(a * 255)

        return this.fromRGBA(r, g, b, a)
    }

    /**
     * Returns RGBA in string
     * @returns {string}
     */

    toString() {
        return this.rgbaString
    }

    /**
     * Create color from RGBA
     * @param {number} r - Red component (0..=255)
     * @param {number} g - Green component (0..=255)
     * @param {number} b - Blue component (0..=255)
     * @param {number} [a] - Alpha component (0..=255)
     * @returns {Color}
     */

    static fromRGBA(r, g, b, a = 255) {
        return new Color().fromRGBA(r, g, b, a)
    }

    /**
     * Create a random color
     * 
     * If a is number, alpha component is static
     * 
     * Else if a is null, alpha component is random
     * 
     * @param {number | null} [a] - Alpha component (default: 255)
     * @returns {Color}
     */

    static random(a = 255) {
        return Color.fromRGBA(
            randomRange(0, 255), 
            randomRange(0, 255), 
            randomRange(0, 255), 
            a ?? randomRange(0, 255)
        )
    }

    /**
     * Create a black color
     */
    static get Black() {
        return new Color
    }

    /**
     * Create a white color
     */
    static get White() {
        return Color.fromRGBA(255, 255, 255, 255)
    }

    /**
     * Create a Red color
     */
    static get Red() {
        return Color.fromRGBA(255, 0, 0, 255)
    }

    /**
     * Create a Blue color
     */
    static get Blue() {
        return Color.fromRGBA(0, 0, 255, 255)
    }

    /**
     * Create a Green color
     */
    static get Green() {
        return Color.fromRGBA(0, 255, 0, 255)
    }
}