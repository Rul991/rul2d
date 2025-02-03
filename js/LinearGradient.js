import { fillRect } from "./utils/canvasWork.js"
import Rectangle from "./Rectangle.js"
import Color from "./Color.js"

/**
 * Represents a rectangle filled with a linear gradient. 
 * Inherits from the Rectangle class and allows for custom gradient colors and angles.
 * @extends Rectangle
 */

export default class LinearGradient extends Rectangle {

    /**
     * Creates an instance of LinearGradient.
     * 
     * @param {number} x - The x-coordinate of the rectangle.
     * @param {number} y - The y-coordinate of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     */

    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.gradient = null
        this.gradientRadians = 0
        this.isNeedUpdateGradient = true

        this.colors = {}
    }

    /**
     * Sets a color at a specified offset for the gradient.
     * 
     * @param {Color} color - The color to set at the offset (e.g., '#FF0000').
     * @param {number} [offset=0.1] - The offset position (0 to 1) for the color stop.
     */

    setColor(color, offset = 0.1) {
        this.colors[offset] = color
        this.isNeedUpdateGradient = true
    }

    /**
     * Gets or sets the angle of the gradient in radians.
     * 
     * @param {number} value - The angle of the gradient in radians.
     */

    set gradientRadians(value) {
        this._gradientRadians = value
        this.isNeedUpdateGradient = true
    }

    /**
     * Retrieves the angle of the gradient in radians.
     * 
     * @returns {number} The current angle of the gradient in radians.
     */

    get gradientRadians() {
        return this._gradientRadians
    }

    /**
     * Updates the linear gradient object based on the current gradient properties.
     * 
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context to create the gradient.
     * @returns {CanvasGradient} The updated gradient object.
     */

    updateGradient(ctx) {
        let [x1, y1, x2, y2] = this.rotateGradient()
        this.gradient = ctx.createLinearGradient(x1, y1, x2, y2)

        Object.entries(this.colors).forEach(([offset, color]) => {
            this.gradient.addColorStop(offset, color)
        })

        this.isNeedUpdateGradient = false

        return this.gradient
    }

    /**
     * Calculates the coordinates for the gradient based on the rotation angle.
     * 
     * @returns {number[]} An array containing the start and end coordinates of the gradient.
     */

    rotateGradient() {
        let radiansCos = Math.cos(this.gradientRadians)
        let radiansSin = Math.sin(this.gradientRadians)

        return [
            this.x * radiansCos,
            this.y * radiansSin,
            this.right * radiansCos,
            this.bottom * radiansSin
        ]
    }

    /**
     * Draws the linear gradient rectangle on the specified context.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
     * @protected
     */

    _draw(ctx = new CanvasRenderingContext2D) {
        if(!this.isNeedDraw()) return
        if(!this.gradient) return

        if(this.isNeedUpdateGradient) this.updateGradient(ctx)
        
        this.drawRotated(ctx, (x, y, width, height) => {
            ctx.fillStyle = this.gradient
            fillRect(ctx, x, y, width, height)
        })
    }
}