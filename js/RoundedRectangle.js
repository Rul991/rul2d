import Color from "./Color.js"
import Rectangle from "./Rectangle.js"

/**
 * Represents a rectangle with rounded corners.
 * Extends the Rectangle class to provide additional functionality for drawing.
 * @extends Rectangle
 */

export default class RoundedRectangle extends Rectangle {

    /**
     * Creates an instance of RoundedRectangle at the specified position and dimensions.
     * 
     * @param {number} x - The x-coordinate of the rectangle.
     * @param {number} y - The y-coordinate of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     */

    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.setRadius(10)
    }

    /**
     * Sets the corner radius for the rounded rectangle.
     * If more than four radii are provided, excess values are discarded.
     * 
     * @param {...number} radiuses - The radii for the corners of the rectangle.
     */

    setRadius(...radiuses) {
        this.radius = radiuses
        while(this.radius.length > 4) this.radius.pop()
    }

    /**
     * Draws the rounded rectangle onto the specified canvas context.
     * 
     * @param {CanvasRenderingContext2D} [ctx=new CanvasRenderingContext2D()] - The rendering context to draw on.
     * @param {string|null} [color=null] - Optional color to use for drawing.
     * @param {string} [type='fill'] - The type of drawing operation ('fill' or 'stroke').
     * @private
     */

    _drawRoundedRect(ctx = new CanvasRenderingContext2D, color = null, type = 'fill') {
        if(!this.isNeedDraw()) return
        this.doWithOpacity(ctx, () => {
            this.updateContextParameters(ctx, color)
            this.drawRotated(ctx, (x, y, width, height) => {
                ctx.beginPath()
                ctx.roundRect(x, y, width, height, this.radius)
                ctx[type]()
                ctx.closePath()
            })
        })
    }

    /**
     * Fills the rounded rectangle with the specified color on the canvas context.
     * 
     * @param {CanvasRenderingContext2D} [ctx=new CanvasRenderingContext2D()] - The rendering context to fill on.
     * @param {Color|null} [color=null] - Optional color to use for filling.
     */

    fill(ctx = new CanvasRenderingContext2D, color = null) {
        this._drawRoundedRect(ctx, color, 'fill')
    }

    /**
     * Draws the rounded rectangle, filling it with the specified color.
     * @param {CanvasRenderingContext2D} [ctx=new CanvasRenderingContext2D()] - The rendering context to draw on.
     * @param {Color|null} [color=null] - Optional color to use for drawing.
     */

    draw(ctx = new CanvasRenderingContext2D, color = null) {
        this.fill(ctx, color)
    }

    /**
     * Draws the outline of the rounded rectangle on the canvas context.
     * 
     * @param {CanvasRenderingContext2D} [ctx=new CanvasRenderingContext2D()] - The rendering context to draw on.
     * @param {Color|null} [color=null] - Optional color to use for stroking.
     */

    stroke(ctx = new CanvasRenderingContext2D, color = null) {
        this._drawRoundedRect(ctx, color, 'stroke')
    }
}