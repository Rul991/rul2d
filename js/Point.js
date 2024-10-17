import { fillArc } from "./utils/canvasWork.js"

export default class Point {
    constructor(x,y) {
        this.setPosition(x,y)
        this.setColor()
        this.setVisibity(true)
    }

    setColor(color) {
        this.color = color ?? 'red'
    }

    getAngle(point = new Point) {
        return Math.atan2(this.y - point.y, this.x - point.x)
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

    static clamp({x, y} = new Point, min = new Point, max = new Point) {
        let point = new Point(x, y)

        if(point.x > max.x) point.x = max.x
        else if(point.x < min.x) point.x = min.x

        if(point.y > max.y) point.y = max.y
        else if(point.y < min.y) point.y = min.y

        return point
    }

    setVisibity(isVisible = true) {
        this.isVisible = isVisible
    }

    set point({x,y}) {
        this.x = x ?? 0
        this.y = y ?? this.x
    }

    get point() {
        return new Point(this.x, this.y)
    }

    multiplyOnNumber(number = 0) {
        return this.multiplyOnPoint(new Point(number))
    }

    multiplyOnPoint({x, y} = new Point) {
        this.x *= x
        this.y *= y

        return this.point
    }

    multiply(value = 0 || new Point) {
        if(typeof value == 'number') return this.multiplyOnNumber(value)
        else if(value.x !== undefined) return this.multiplyOnPoint(value)

        return null
    }

    summarizeOnPoint({x, y} = new Point) {
        this.x += x
        this.y += y

        return this.point
    }

    summarizeOnNumber(number = 0) {
        return this.summarizeOnPoint(new Point(number))
    }

    summarize(value = 0 || new Point) {
        if(typeof value == 'number') return this.summarizeOnNumber(value)
        else if(value.x !== undefined) return this.summarizeOnPoint(value)

        return null
    }

    setPosition(x, y) {
        this.point = {x,y}
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
        if(!this.isVisible) return
        this.drawPoint(ctx, color)
    }

    addEventListener(type = '', callback = e => {}) {
        window.addEventListener(type, callback)
    }

    dispatchEvent(event) {
        if(!event.detail) event.detail = {}
        if(!event.detail.object) event.detail.object = this
        
        window.dispatchEvent(event)
    }

    move({x, y}, delta = 1/60) {
        this.addPosition(new Point(x * delta, y * delta))
    }
}