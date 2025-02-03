import DrawableObject from "./DrawableObject.js"
import { fillArc } from "./utils/canvasWork.js"

/**
 * Represents a point in 2D space, extending from DrawableObject.
 * Provides methods for geometric transformations and rendering.
 * @extends DrawableObject
 */

export default class Point extends DrawableObject {

    /**
     * Creates an instance of Point at the specified coordinates.
     * 
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     */

    constructor(x,y) {
        super()
        this.setPosition(x,y)
    }

    static drawRadius = 3

    /**
     * Calculates the angle in radians between this point and another point.
     * 
     * @param {Point} [point=new Point()] - The point to calculate the angle towards.
     * @returns {number} The angle in radians.
     */

    getAngle(point = new Point) {
        return Math.atan2(this.y - point.y, this.x - point.x)
    }

    /**
     * Calculates the distance to another point.
     * 
     * @param {Point} [{x, y} = new Point()] - The target point to distance from.
     * @returns {number} The distance to the target point.
     */

    getDistance({x, y} = new Point) {
        return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2)
    }

    /**
     * Rotates this point around a specified point by a given angle.
     * 
     * @param {Point} [{x, y} = new Point()] - The pivot point to rotate around.
     * @param {number} [radians=0] - The angle in radians to rotate.
     * @returns {Point} The updated point after rotation.
     */

    rotateAboutPoint({x, y} = new Point, radians = 0) {
        this.x = x + (this.x - x) * Math.cos(radians) - (this.y - y) * Math.sin(radians)
        this.y = y + (this.x - x) * Math.sin(radians) + (this.y - y) * Math.cos(radians)

        return this.point
    }

    /**
     * Moves this point in a circular orbit around a specified point.
     * 
     * @param {Point} [{x, y} = new Point()] - The center of the orbit.
     * @param {number} [radius=0] - The distance from the center of the orbit.
     * @param {number} [angleSpeed=0] - The rate at which to update the angle for orbiting.
     * @returns {Point} The updated point after orbiting.
     */

    rotateAboutPointOrbitally({x, y} = new Point, radius = 0, angleSpeed = 0) {
        if(!this.orbitRadians) {
            this.orbitRadians = this.getAngle({x, y})
        }

        this.x = x + Math.cos(this.orbitRadians) * radius
        this.y = y + Math.sin(this.orbitRadians) * radius

        this.orbitRadians += angleSpeed

        return this.point
    }

    /**
     * Sets the position of the point.
     * 
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     */

    set point({x,y}) {
        this.setPosition(x, y)
    }

    /**
     * Gets the current position as a new Point object.
     * 
     * @returns {Point} The current position as a new Point instance.
     */

    get point() {
        return new Point(this.x, this.y)
    }

    /**
     * Sets the position of the point with given coordinates.
     * 
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     */

    setPosition(x, y) {
        this.x = x !== undefined ? x : 0
        this.y = y !== undefined ? y : this.x
    }

    /**
     * Sets the position of the point relative to an offset.
     * 
     * @param {number} x - The x-offset.
     * @param {number} y - The y-offset.
     */

    setOffsetPosition(x, y) {
        if(this.offset)
            this.offset.setPosition(x, y)
        else
            this.setPosition(x, y)
    }

    /**
     * Adds an offset to the current position of the point.
     * 
     * @param {Point} {x, y} - The offset to add to the current position.
     */

    addPosition({x, y}) {
        this.setPosition(this.x + x, this.y + y)
    }

    /**
     * Draws the point on the given canvas context.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
     * @param {string|null} [color=null] - Optional color to use for drawing.
     */

    drawPoint(ctx, color = null) {
        let usedColor = this.updateContextParameters(ctx, color)
        fillArc(ctx, this.x, this.y, Point.drawRadius)
        
        ctx.fillStyle = 'white'
        fillArc(ctx, this.x, this.y, Point.drawRadius - 1)
        
        ctx.fillStyle = usedColor
        fillArc(ctx, this.x, this.y, 1)
    }

    /**
     * Draws the point on the given context if it's necessary to draw.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
     * @param {Color|null} [color=null] - Optional color for drawing.
     * @protected
     */

    _draw(ctx, color = null) {
        if(!this.isNeedDraw()) return
        this.drawPoint(ctx, color)
    }

    /**
     * Moves the point based on the given velocity and delta time.
     * 
     * @param {Point} {x, y} - The velocity components.
     * @param {number} [delta=1/60] - The delta time to apply to the movement.
     */

    move({x, y}, delta = 1/60) {
        this.addPosition(new Point(x * delta, y * delta))
    }

    /**
     * Simplifies the point into a plain object.
     * 
     * @returns {{x: number, y: number}} An object representation of the point with x and y properties.
     */

    simplify() {
        return {x: this.x, y: this.y}
    }
}