import { fillPath, strokePath } from './utils/canvasWork.js'
import { deg2rad } from './utils/numberWork.js'
import Point from './Point.js'
import Rectangle from './Rectangle.js'
import Color from './Color.js'

/**
 * Represents a shape defined by points on a canvas that can be scaled, positioned, and drawn.
 * The shape can be loaded from a JSON source and supports various path manipulations.
 * @extends Rectangle
 */

export default class CanvasShape extends Rectangle {
    
    /**
     * Creates an instance of CanvasShape at the specified position with given dimensions.
     * 
     * @param {number} x - The x-coordinate of the shape's position.
     * @param {number} y - The y-coordinate of the shape's position.
     * @param {number} width - The width of the shape.
     * @param {number} height - The height of the shape.
     */

    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.shapePoints = []
        this.drawablePoints = []
    }

    /**
     * Loads shape points from a JSON file.
     * @async
     * @param {string} [src=''] - The URL to the JSON file containing shape data.
     */

    async loadFromJSON(src = '') {
        let response = await fetch(src)
        let data = await response.json()

        this.setPath(data)
    }

    /**
     * Sets the shape path using an array of points.
     * 
     * @param {Point[]} [points=[new Point]] - The array of points defining the shape.
     */

    setPath(points = [new Point]) {
        this.shapePoints = points
        this.updatePath()
    }

    /**
     * Sets the shape path based on degrees, allowing for circular paths.
     * 
     * @param {Object} options - Options to configure the path.
     * @param {function} [options.callback=(rad=0) => new Point(rad)] - Callback to generate points from radians.
     * @param {number} [options.minDegree=0] - Minimum degree for path generation.
     * @param {number} [options.maxDegree=360] - Maximum degree for path generation.
     * @param {number} [options.step=1] - Step increment for generating degrees.
     */

    setDegreesPath({callback = (rad = 0) => new Point(rad), minDegree = 0, maxDegree = 360, step = 1}) {
        let points = []

        for (let i = minDegree; i <= maxDegree; i += step) {
            points.push(callback(deg2rad(i)))           
        }

        this.setPath(points)
    }

    /**
     * Normalizes the shape's path to fit within its bounding box.
     */

    fitPath() {
        if(!this.shapePoints.length) return

        let xMin = 0, xMax = -0, yMin = 0, yMax = -0

        const {min, max} = Math

        for (const point of this.shapePoints) {
            xMin = min(xMin, point.x)
            xMax = max(xMax, point.x)
            yMin = min(yMin, point.y)
            yMax = max(yMax, point.y)
        }

        let xRange = xMax - xMin
        let yRange = yMax - yMin

        this.setPath(this.shapePoints.map(point => new Point((point.x - xMin) / xRange, (point.y - yMin) / yRange)))
    }

    /**
     * Sets the size of the shape and updates the drawable points accordingly.
     * 
     * @param {number} width - The new width of the shape.
     * @param {number} height - The new height of the shape.
     */

    setSize(width, height) {
        super.setSize(width, height)
        this.updatePath()
    }

    /**
     * Sets the position of the shape and updates the drawable points accordingly.
     * 
     * @param {number} x - The new x-coordinate.
     * @param {number} y - The new y-coordinate.
     */

    setPosition(x, y) {
        super.setPosition(x, y)
        this.updatePath()
    }

    /**
     * Deletes all points from the shape.
     */

    deleteAllPoints() {
        this.shapePoints = []
        this.drawablePoints = []
    }

    /**
     * Updates the drawable points based on the current shape points and their bounding box.
     */

    updatePath() {
        if(!this.shapePoints) return this.deleteAllPoints()
        if(!this.shapePoints.length) return this.deleteAllPoints()

        this.drawablePoints = this.shapePoints.map(({x, y}) => {
            let newX = x * this.width + this.x - this.center.x
            let newY = this.height * y + this.y - this.center.y

            return new Point(newX, newY)
        })
    }

    /**
     * Draws the shape on the canvas with the specified color.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
     * @param {Color} color - The color to fill or stroke the shape.
     */

    draw(ctx, color) {
        if(!this.drawablePoints) return
        if(!this.isNeedDraw()) return

        if(this.drawablePoints.length > 2) this.fill(ctx, color)
        else this.stroke(ctx, color)
    }

    /**
     * Draws the path of the shape using a callback function for custom rendering.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
     * @param {function} [callback=() => {}] - A callback function for drawing additional elements.
     */

    drawPath(ctx, callback = () => {}) {
        if(!this.drawablePoints.length) return
        if(!this.isNeedDraw()) return

        this.doWithOpacity(ctx, () => {
            this.updateContextParameters(ctx)
            this.drawRotated(ctx, (x, y) => {
                callback()
            }, this.center)
        })
    }

    /**
     * Fills the shape on the canvas with the specified color.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
     * @param {Color} color - The fill color.
     */

    fill(ctx, color) {
        this.drawPath(ctx, () => {
            fillPath(ctx, this.drawablePoints)
        })
    }

    /**
     * Strokes the shape on the canvas with the specified color.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
     * @param {Color} color - The stroke color.
     */

    stroke(ctx, color) {
        this.drawPath(ctx, () => {
            strokePath(ctx, this.drawablePoints, color ?? this.color)
        })
    }

    /**
     * Draws the individual points of the shape on the canvas.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
     * @param {Color} color - The color to draw the points.
     */

    drawPoints(ctx, color) {
        this.drawPath(ctx, () => {
            this.drawablePoints.forEach(point => {
                point.draw(ctx, color)
            })
        })
    }

    /**
     * Draws specific points by their indexes on the canvas.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context for the canvas.
     * @param {number[]} [indexes=[0]] - The indexes of points to draw.
     * @param {Color} color - The color to draw the points.
     */

    drawPointByIndex(ctx, indexes = [0], color) {
        if(!indexes.length || !this.drawablePoints.length) return

        this.drawPath(ctx, () => {
            indexes.forEach(index => {
                let point = this.drawablePoints.at(index)
                if(!point) return

                point.draw(ctx, color)
            })
        })
    }
}