import { fillArc } from "./utils/canvasWork.js"

export default class Point {
    constructor(x,y) {
        this.setPosition(x,y)
        this.setColor()
        this.setVisibity(true)
        this.lineWidth = 3
        this.isInViewport = false
    }

    setColor(color) {
        this.color = color ?? 'green'
    }

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

    setVisibity(isVisible = true) {
        this.isVisible = isVisible
    }

    set point({x,y}) {
        this.setPosition(x, y)
    }

    get point() {
        return new Point(this.x, this.y)
    }

    setPosition(x, y) {
        this.x = x ?? 0
        this.y = y ?? this.x
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
        fillArc(ctx, this.x, this.y, 3, color ?? this.color)
        fillArc(ctx, this.x, this.y, 2, 'white')
        fillArc(ctx, this.x, this.y, 1, color ?? this.color)
    }

    draw(ctx, color = null) {
        if(!this.isInViewport || !this.isVisible) return
        this.drawPoint(ctx, color)
    }

    toJSON() {
        return JSON.stringify(this)
    }

    move({x, y}, delta = 1/60) {
        this.addPosition(new Point(x * delta, y * delta))
    }
}