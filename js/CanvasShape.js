import { fillPath, strokePath } from './utils/canvasWork.js'
import { deg2rad } from './utils/numberWork.js'
import Point from './Point.js'
import Rectangle from './Rectangle.js'

export default class CanvasShape extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.shapePoints = []
        this.drawablePoints = []
    }

    async loadFromJSON(src = '') {
        let response = await fetch(src)
        let data = await response.json()

        this.setPath(data)
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

    setSize(width, height) {
        super.setSize(width, height)
        this.updatePath()
    }

    setPosition(x, y) {
        super.setPosition(x, y)
        this.updatePath()
    }

    deleteAllPoints() {
        this.shapePoints = []
        this.drawablePoints = []
    }

    updatePath() {
        if(!this.shapePoints) return this.deleteAllPoints()
        if(!this.shapePoints.length) return this.deleteAllPoints()

        this.drawablePoints = this.shapePoints.map(({x, y}) => {
            let newX = x * this.width + this.x - this.center.x
            let newY = this.height * y + this.y - this.center.y

            return new Point(newX, newY)
        })
    }

    draw(ctx, color) {
        if(!this.drawablePoints) return
        if(!this.isNeedDraw()) return

        if(this.drawablePoints.length > 2) this.fill(ctx, color)
        else this.stroke(ctx, color)
    }

    drawPath(ctx, callback = () => {}) {
        if(!this.drawablePoints.length) return
        if(!this.isNeedDraw()) return

        this.doWithOpacity(ctx, () => {
            this.drawRotated(ctx, (x, y) => {
                callback()
            }, this.center)
        })
    }

    fill(ctx, color) {
        this.drawPath(ctx, () => {
            fillPath(ctx, this.drawablePoints, color ?? this.color)
        })
    }

    stroke(ctx, color) {
        this.drawPath(ctx, () => {
            strokePath(ctx, this.drawablePoints, color ?? this.color)
        })
    }

    drawPoints(ctx, color) {
        this.drawPath(ctx, () => {
            this.drawablePoints.forEach(point => {
                point.draw(ctx, color)
            })
        })
    }

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