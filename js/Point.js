import DrawableObject from "./DrawableObject.js"
import { fillArc } from "./utils/canvasWork.js"

export default class Point extends DrawableObject {
    constructor(x,y) {
        super()
        this.setPosition(x,y)
    }

    static drawRadius = 3

    getAngle(point = new Point) {
        return Math.atan2(this.y - point.y, this.x - point.x)
    }

    getDistance({x, y} = new Point) {
        return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2)
    }

    rotateAboutPoint({x, y} = new Point, radians = 0) {
        this.x = x + (this.x - x) * Math.cos(radians) - (this.y - y) * Math.sin(radians)
        this.y = y + (this.x - x) * Math.sin(radians) + (this.y - y) * Math.cos(radians)

        return this.point
    }

    rotateAboutPointOrbitally({x, y} = new Point, radius = 0, angleSpeed = 0) {
        if(!this.orbitRadians) {
            this.orbitRadians = this.getAngle({x, y})
            console.log(this.orbitRadians)
        }

        this.x = x + Math.cos(this.orbitRadians) * radius
        this.y = y + Math.sin(this.orbitRadians) * radius

        this.orbitRadians += angleSpeed

        return this.point
    }

    set point({x,y}) {
        this.setPosition(x, y)
    }

    get point() {
        return new Point(this.x, this.y)
    }

    setPosition(x, y) {
        this.x = x !== undefined ? x : 0
        this.y = y !== undefined ? y : this.x
    }

    setOffsetPosition(x, y) {
        if(this.offset)
            this.offset.setPosition(x, y)
        else
            this.setPosition(x, y)
    }

    smoothSetPosition(x, y, step = 60, time = 1000) {
        let stepX = (x - this.x) / step
        let stepY = (y - this.y) / step

        let interval = setInterval(() => {
            this.addPosition(new Point(stepX, stepY))
        }, time / step)

        setTimeout(() => {
            clearInterval(interval)
            this.setPosition(x, y)
        }, time)
    }

    addPosition({x, y}) {
        this.setPosition(this.x + x, this.y + y)
    }

    drawPoint(ctx, color = null) {
        fillArc(ctx, this.x, this.y, Point.drawRadius, color ?? this.color)
        fillArc(ctx, this.x, this.y, Point.drawRadius - 1, 'white')
        fillArc(ctx, this.x, this.y, 1, color ?? this.color)
    }

    _draw(ctx, color = null) {
        if(!this.isNeedDraw()) return
        this.drawPoint(ctx, color)
    }

    move({x, y}, delta = 1/60) {
        this.addPosition(new Point(x * delta, y * delta))
    }

    simplify() {
        return {x: this.x, y: this.y}
    }
}