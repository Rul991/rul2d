import Point from "./Point.js"
import Rectangle from "./Rectangle.js"

/**
 * Represents a drawable path defined by a set of points on a canvas.
 * The path can be filled or stroked, and its position can be updated based on the contained points.
 * @extends Rectangle
 */

export default class CanvasPath extends Rectangle {

    /**
     * Creates an instance of CanvasPath with a specified starting position.
     *
     * @param {number} x - The x-coordinate of the path's initial position.
     * @param {number} y - The y-coordinate of the path's initial position.
     */

    constructor(x, y) {
        super(x, y, 1, 1)
        this.points = new Set()
    }

    /**
     * Removes all points from the path.
     */

    removeAllPoints() {
        this.points = new Set()
    }

    /**
     * Removes a specified point from the path.
     * 
     * @param {Point} [point=new Point] - The point to remove from the path.
     */

    removePoint(point = new Point) {
        this.points.delete(point)
    }

    /**
     * Adds a point to the path.
     * 
     * @param {Point} [point=new Point] - The point to add to the path.
     */

    addPoint(point = new Point) {
        point.offset = new Point()
        point.offset.point = point
        this.points.add(point)
        this.updatePosition()
    }

    /**
     * Removes multiple points from the path.
     * 
     * @param {...Point} points - The points to remove from the path.
     */

    removePoints(...points) {
        points.forEach(point => this.removePoint(point))
    }

    /**
     * Adds multiple points to the path.
     * 
     * @param {...Point} points - The points to add to the path.
     */

    addPoints(...points) {
        points.forEach(point => this.addPoint(point))
    }

    /**
     * Updates the position and size of the path based on its points.
     */

    updatePosition() {
        if(!this.points) return
        if(!this.points.size) return

        let right = this.x
        let bottom = this.y

        this.points.forEach(point => {
            point.setPosition(this.x + point.offset.x, this.y + point.offset.y)
            if(point.x > right) right = point.x
            if(point.y > bottom) bottom = point.y
        })

        this.setSize(right - this.x, bottom - this.y)
    }

    /**
     * Sets the position of the path and updates its location based on contained points.
     * 
     * @param {number} x - The new x-coordinate.
     * @param {number} y - The new y-coordinate.
     */

    setPosition(x, y) {
        super.setPosition(x, y)
        this.updatePosition()
    }

    /**
     * Draws the path on the canvas using the specified context.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context on which to draw.
     * @param {string|null} color - The color for the path.
     * @param {string} [type='stroke'] - The type of line to draw ('fill' or 'stroke').
     */

    drawLine(ctx, color = null, type = 'stroke') {
        if(!this.isNeedDraw()) return
        this.drawRotated(ctx, () => {
            if(!this.points) return
            if(!this.points.size) return
        
            ctx[`${type}Style`] = color
            ctx.beginPath()

            for (const point of this.points) 
                ctx.lineTo(point.x - this.center.x, point.y - this.center.y)

            ctx[type]()
            ctx.closePath()
        })
    }

    /**
     * Fills the path on the canvas with the specified color.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context on which to fill.
     * @param {string|null} color - The fill color.
     */

    fill(ctx, color = null) {
        this.drawLine(ctx, color, 'fill')
    }

    /**
     * Strokes the path on the canvas with the specified color.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context on which to stroke.
     * @param {string|null} color - The stroke color.
     */

    stroke(ctx, color = null) {
        this.drawLine(ctx, color, 'stroke')
    }

    /**
     * Draws the path using stroke method and color.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context on which to draw.
     * @param {string|null} color - The stroke color. Defaults to the object’s color.
     * @protected
     */

    _draw(ctx, color = null) {
        this.stroke(ctx, color ?? this.color)
    }
}