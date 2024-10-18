import { fillPath, strokePath } from './utils/canvasWork.js'
import { deg2rad } from './utils/numberWork.js'
import Point from './Point.js'
import Rectangle from './Rectangle.js'

export default class CanvasShape extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.shapePoints = []
        this.drawPoints = []
    }

    setPath(points = [new Point]) {
        this.shapePoints = points
        this.updatePath()
    }

    setDegreesPath({callback = (rad = 0) => new Point(rad), minDegree = 0, maxDegree = 360, step = 1}) {
        let points = []

        for (let i = minDegree; i <= maxDegree; i += step) {
            points.push(callback(deg2rad(i)))           
        }

        this.setPath(points)
    }

    fitPath() {
        if(!this.shapePoints) if(!this.shapePoints.length) return

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

    setSize(width, height) {
        super.setSize(width, height)
        this.updatePath()
    }

    set point(value) {
        super.point = value
        this.updatePath()
    }

    get point() {
        return super.point
    }

    updatePath() {
        if(this.shapePoints) if(this.shapePoints.length) {
            this.drawPoints = this.shapePoints.map(({x, y}) => {
                let newX = x * this.width + this.x - this.center.x
                let newY = this.height * y + this.y - this.center.y

                return new Point(newX, newY)
            })
        }
    }

    rotatePath(x, y) {
        return this.drawPoints.map(p => new Point(p.x + x, p.y + y))
    }

    draw(ctx, color) {
        if(!this.isVisible) return
        if(!this.drawPoints) return

        if(this.drawPoints.length > 2) this.fill(ctx, color)
        else this.stroke(ctx, color)
    }

    fill(ctx, color) {
        if(!this.drawPoints) return

        this.drawRotated(ctx, (x, y) => {
            fillPath(ctx, this.drawPoints, color)
        }, this.center)
    }

    stroke(ctx, color) {
        if(!this.drawPoints) return
        ctx.lineWidth = this.lineWidth

        this.drawRotated(ctx, (x, y) => {
            strokePath(ctx, this.drawPoints, color)
        }, this.center)
    }
}