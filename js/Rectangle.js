import { fillRect, strokeRect } from "./utils/canvasWork.js"
import { deg2rad, rad2deg } from "./utils/numberWork.js"
import Point from "./Point.js"

/**
 * Represents a rectangle defined by position, size, and rotation.
 * @extends Point
 */

export default class Rectangle extends Point {

    /**
     * Creates an instance of Rectangle with specified position and size.
     * 
     * @param {number} x - The x-coordinate of the rectangle's top-left corner.
     * @param {number} y - The y-coordinate of the rectangle's top-left corner.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     */

    constructor(x,y,width,height) {
        super(x,y)
        this.setSize(width, height)

        this._radians = 0
        this.isFlip = new Point(1, 1)

        this.cachedBoundingBox = null
        this.isNeedUpdateGeometry = true
        this.getBoundingBox()

        this.cachedCorners = null
        this.corners // caching corners
    }

    /**
     * Setter for the geometry update flag.
     * @param {boolean} value - If true, geometry will be marked for update.
     */

    set isNeedUpdateGeometry(value) {
        this.isNeedUpdateCorners = value
        this.isNeedUpdateBoundingBox = value
    }

    /**
     * Checks if a given point is inside the rectangle.
     * Takes into account the current rotation of the rectangle.
     * 
     * @param {Point} [point=new Point] - The point to check.
     * @returns {boolean} True if the point is in the rectangle, false otherwise.
     */

    isPointInRect(point = new Point) {
        if(!point) return false
        let newPoint = new Point()
        
        if(this.radians) {
            let sin = Math.sin(-this.radians)
            let cos = Math.cos(-this.radians)
            let center = this.center
            
            newPoint = new Point(point.x - center.x, point.y - center.y)
            newPoint = new Point(newPoint.x * cos - newPoint.y * sin, newPoint.x * sin + newPoint.y * cos)
            newPoint = new Point(newPoint.x + center.x, newPoint.y + center.y)
        }
        else newPoint.point = point
        
        return newPoint.x >= this.x && newPoint.x <= this.right && newPoint.y >= this.y && newPoint.y <= this.bottom
    }

    /**
     * Calculates the bounding box of the rectangle, updating if necessary.
     * 
     * @returns {Rectangle} The bounding box of the rectangle.
     */

    getBoundingBox() {
        if(!this.isNeedUpdateBoundingBox) return this.cachedBoundingBox
        if(!this.radians) return this

        this.isNeedUpdateBoundingBox = false
        let temp = new Rectangle()

        let corners = new Point(
            this.cornersArray.map(({x}) => x),
            this.cornersArray.map(({y}) => y)
        )

        let right = Math.max(...corners.x)
        let bottom = Math.max(...corners.y)
        
        temp.x = Math.min(...corners.x)
        temp.y = Math.min(...corners.y)

        temp.setSize(right - temp.x, bottom - temp.y)

        this.cachedBoundingBox = temp

        return this.cachedBoundingBox
    }

    /**
     * Retrieves the maximum bounding box for a rotated rectangle.
     * 
     * @returns {Rectangle} The maximum bounding box of the rotated rectangle.
     */

    getMaxBoundingBox() {
        let rect = this.rect
        rect.degrees = 45
        return rect.getBoundingBox()
    }

    /**
     * Sets the rotated rectangle.
     * 
     * @param {Rectangle} rect - The rectangle to set as rotated.
     */

    set rotatedRect(rect) {
        let {radians} = rect

        this.rect = rect
        this.radians = radians
    }

    /**
     * Gets the current rotated rectangle.
     * 
     * @returns {Rectangle} The rotated rectangle.
     */

    get rotatedRect() {
        let rect = new Rectangle()
        rect.rect = this.rect
        rect.radians = this.radians

        return rect
    }

    /**
     * Setter for the rotation in radians.
     * Automatically updates geometry when set.
     * 
     * @param {number} value - The rotation in radians.
     */

    set radians(value) {
        this._radians = value % deg2rad(360)
        this.isNeedUpdateGeometry = true
    }

    /**
     * Getter for the rotation in radians.
     * 
     * @returns {number} The rotation in radians.
     */

    get radians() {
        return this._radians
    }

    /**
     * Setter for the rotation in degrees.
     * 
     * @param {number} value - The rotation in degrees.
     */

    set degrees(value) {
        this.radians = deg2rad(value)
    }

    /**
     * Getter for the rotation in degrees.
     * 
     * @returns {number} The rotation in degrees.
     */

    get degrees() {
        return rad2deg(this.radians)
    }

    /**
     * Setter for the size of the rectangle.
     * 
     * @param {{width: number, height: number}} size - The new size of the rectangle.
     */

    set size({width, height}) {
        this.setSize(width, height)
    }

    /**
     * Getter for the size of the rectangle.
     * 
     * @returns {Rectangle} A new rectangle representing the size.
     */

    get size() {
        let {width, height} = this
        return new Rectangle(0, 0, width, height)
    }

    /**
     * Setter for the scale of the rectangle.
     * Adjusts the position and size based on the scale factor.
     * 
     * @param {number} value - The scale factor to apply to the rectangle.
     */

    set scale(value) {
        this.addPosition(new Point(this.width / 2, this.height / 2))
        this.setSize(this.width / this.scale, this.height / this.scale)
        this._scale = value
        this.setSize(this.width * this.scale, this.height * this.scale)
        this.addPosition(new Point(-this.width / 2, -this.height / 2))
    }

    /**
     * Getter for the scale of the rectangle.
     * 
     * @returns {number} The current scale of the rectangle.
     */

    get scale() {
        return this._scale ?? 1
    }

    /**
     * Sets the rectangle's position and size.
     * 
     * @param {Rectangle} rect - An object containing x, y, width, and height.
     */

    set rect({x, y, width, height}) {
        this.point = {x,y}
        this.setSize(width, height)
    }

    /**
     * Gets the rectangle as a new Rectangle object.
     * 
     * @returns {Rectangle} A new Rectangle object based on current position and size.
     */

    get rect() {
        return new Rectangle(this.x, this.y, this.width, this.height)
    }

    /**
     * Gets the bottom position of the rectangle.
     * 
     * @returns {number} The bottom edge of the rectangle.
     */

    get bottom() {
        return this.y + this.height
    }

    /**
     * Gets the right position of the rectangle.
     * 
     * @returns {number} The right edge of the rectangle.
     */

    get right() {
        return this.x + this.width
    }

    /**
     * Sets the center position of the rectangle.
     * 
     * @param {Point} center - An object containing new center coordinates.
     */

    set center({x, y}) {
        this.setPosition(x - (this.width / 2), y - (this.height / 2))
    }

    /**
     * Gets the center position of the rectangle.
     * 
     * @returns {Point} A new Point representing the center of the rectangle.
     */

    get center() {
        return new Point(this.x + this.width / 2, this.y + this.height / 2)
    }

    /**
     * Gets the corners of the rectangle considering the rotation.
     * 
     * @returns {Object} An object representing the four corners as Point instances.
     */

    get corners() {
        if(!this.isNeedUpdateCorners) return this.cachedCorners
        this.isNeedUpdateCorners = false

        let cos = Math.cos(this.radians)
        let sin = Math.sin(this.radians)
        let center = this.center

        this.cachedCorners = {
            leftBottom: new Point(
                (-this.width / 2) * cos - (this.height / 2) * sin + center.x,
                (-this.width / 2) * sin + (this.height / 2) * cos + center.y
            ),
            rightBottom: new Point(
                (this.width / 2) * cos - (this.height / 2) * sin + center.x,
                (this.width / 2) * sin + (this.height / 2) * cos + center.y
            ),
            rightTop: new Point(
                (this.width / 2) * cos - (-this.height / 2) * sin + center.x,
                (this.width / 2) * sin + (-this.height / 2) * cos + center.y
            ),
            leftTop: new Point(
                (-this.width / 2) * cos - (-this.height / 2) * sin + center.x,
                (-this.width / 2) * sin + (-this.height / 2) * cos + center.y
            )
        }

        return this.cachedCorners
    }

    /**
     * Gets an array of the rectangle's corners.
     * 
     * @returns {Point[]} An array of corner Point instances.
     */

    get cornersArray() {
        return Object.entries(this.corners).map(([key, point]) => point)
    }

    /**
     * Sets the position of the rectangle.
     * 
     * @param {number} x - The new x-coordinate.
     * @param {number} y - The new y-coordinate.
     */

    setPosition(x, y) {
        this.isNeedUpdateGeometry = true
        super.setPosition(x, y)
    }

    /**
     * Sets the size of the rectangle.
     * 
     * @param {number} width - The new width of the rectangle.
     * @param {number} height - The new height of the rectangle.
     */

    setSize(width, height) {
        this.isNeedUpdateGeometry = true
        this.width = width || 1
        this.height = height || this.width
    }

    /**
     * Flips the rectangle horizontally and/or vertically.
     * 
     * @param {boolean} [x=false] - If true, flip horizontally.
     * @param {boolean} [y=false] - If true, flip vertically.
     */

    flip(x = false, y = false) {
        this.flipHorizontally(x)
        this.flipVertically(y)
    }

    /**
     * Flips the rectangle vertically.
     * 
     * @param {boolean} [isFlip=false] - If true, flip vertically.
     */

    flipVertically(isFlip = false) {
        this.isFlip.y = isFlip ? -1 : 1
    }

    /**
     * Flips the rectangle horizontally.
     * 
     * @param {boolean} [isFlip=false] - If true, flip horizontally.
     */

    flipHorizontally(isFlip = false) {
        this.isFlip.x = isFlip ? -1 : 1
    }

    /**
     * Draws the rectangle with rotation.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {function} [callback=(x=0, y=0, width=0, height=0) => {}] - A callback function to execute with the drawn rectangle's dimensions.
     * @param {{x: number, y: number}} [{x, y}=this.center] - The position to draw around, defaults to the rectangle's center.
     */

    drawRotated(ctx, callback = (x = 0, y = 0, width = 0, height = 0) => {}, {x, y} = this.center) {
        const width = this.width
        const height = this.height

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(this.radians)
        ctx.scale(this.isFlip.x, this.isFlip.y)

        callback(-width / 2, -height / 2, width, height)

        ctx.restore()
    }

    /**
     * Draws the outline of the rectangle.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {string|null} [color=null] - Optional color for the outline.
     */

    drawOutline(ctx, color = null) {
        this.drawRotated(ctx, (x, y, width, height) => {
            this.updateContextParameters(ctx, color)
            strokeRect(ctx, x, y, width, height)
        })
    }

    /**
     * Draws the center point of the rectangle.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {string|null} [color=null] - Optional color for the center point.
     */

    drawCenter(ctx, color = null) {
        this.center.drawPoint(ctx, color)
    }

    /**
     * Internal method to handle drawing of the rectangle.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */

    _draw(ctx) {
        if(!this.isNeedDraw()) return

        this.drawRotated(ctx, (x, y, width, height) => {
            fillRect(ctx, x, y, width, height)
        })
    }

    /**
     * Returns a simplified representation of the rectangle.
     * 
     * @returns {{x: number, y: number, width: number, height: number}} A simpler object representation.
     */

    simplify() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }

    /**
     * Creates a rectangle from two points.
     * 
     * @param {Point} [first=new Point()] - The first point.
     * @param {Point} [second=new Point()] - The second point.
     * @returns {Rectangle} A new rectangle defined by the two points.
     */

    static createFromPoints(first = new Point, second = new Point) {
        let start = new Point
        let end = new Point

        if(first.x < second.x) {
            start.x = first.x
            end.x = second.x
        }
        else {
            start.x = second.x
            end.x = first.x
        }

        if(first.y < second.y) {
            start.y = first.y
            end.y = second.y
        }
        else {
            start.y = second.y
            end.y = first.y
        }

        let width = end.x - start.x
        let height = end.y - start.y

        return new Rectangle(start.x, start.y, width, height)
    }
}