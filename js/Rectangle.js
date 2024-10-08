import { fillRect, strokeRect } from "./canvasWork.js"
import { deg2rad, rad2deg } from "./numberWork.js"
import Point from "./Point.js"

export default class Rectangle extends Point {
    constructor(x,y,width,height) {
        super(x,y)
        this.setSize(width, height)
        this._radians = 0
        this.lineWidth = 3
    }

    isPointInRect(point = new Point) {
        let sin = Math.sin(this.radians)
        let cos = Math.cos(this.radians)
        
        let newPoint = new Point(point.x - this.center.x, point.y - this.center.y)
        newPoint = new Point(newPoint.x * cos - newPoint.y * sin, newPoint.x * sin + newPoint.y * cos)
        newPoint = new Point(newPoint.x + this.center.x, newPoint.y + this.center.y)
    
        return newPoint.x >= this.x && newPoint.x <= this.right && newPoint.y >= this.y && newPoint.y <= this.bottom
    }

    set radians(value) {
        this._radians = value % deg2rad(360)
    }

    get radians() {
        return this._radians
    }

    set degrees(value) {
        this.radians = deg2rad(value)
    }

    get degrees() {
        return rad2deg(this.radians)
    }

    set size({width, height}) {
        this.setSize(width, height)
    }

    get size() {
        let {width, height} = this
        return {x: 0, y: 0, width, height}
    }

    set scale(value) {
        this.setSize(this.width / this.scale, this.height / this.scale)
        this._scale = value
        this.setSize(this.width * this.scale, this.height * this.scale)
    }

    get scale() {
        return this._scale ?? 1
    }

    set rect({x, y, width, height}) {
        this.point = {x,y}
        this.setSize(width, height)
    }

    get rect() {
        return new Rectangle(this.x, this.y, this.width, this.height)
    }

    get bottom() {
        return this.y + this.height
    }

    get right() {
        return this.x + this.width
    }

    set center({x, y}) {
        this.setPosition(x - (this.width / 2), y - (this.height / 2))
    }

    get center() {
        return new Point(this.x + this.width / 2, this.y + this.height / 2)
    }

    get corners() {
        let cos = Math.cos(this.radians)
        let sin = Math.sin(this.radians)

        return {
            leftTop: new Point(
                (-this.width / 2) * cos - (this.height / 2) * sin + this.center.x,
                (-this.width / 2) * sin + (this.height / 2) * cos + this.center.y
            ),
            rightTop: new Point(
                (this.width / 2) * cos - (this.height / 2) * sin + this.center.x,
                (this.width / 2) * sin + (this.height / 2) * cos + this.center.y
            ),
            leftBottom: new Point(
                (this.width / 2) * cos - (-this.height / 2) * sin + this.center.x,
                (this.width / 2) * sin + (-this.height / 2) * cos + this.center.y
            ),
            rightBottom: new Point(
                (-this.width / 2) * cos - (-this.height / 2) * sin + this.center.x,
                (-this.width / 2) * sin + (-this.height / 2) * cos + this.center.y
            )
        }
    }

    get cornersArray() {
        return Object.entries(this.corners).map(([key, point]) => point)
    }

    get diagonal() {
        return Math.sqrt(this.width ** 2 + this.height ** 2)
    }

    setSize(width, height) {
        this.width = width ?? 1
        this.height = height ?? this.width
    }

    drawRotated(ctx, callback = (x = 0, y = 0, width = 0, height = 0) => {}, {x, y} = this.center) {
        const width = this.width
        const height = this.height

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(this.radians)

        callback(-width / 2, -height / 2, width, height)

        ctx.restore()
    }

    drawOutline(ctx, color = null) {
        ctx.lineWidth = this.lineWidth
        this.drawRotated(ctx, (x, y, width, height) => {
            strokeRect(ctx, x, y, width, height, color ?? this.color)
        })
    }

    drawCenter(ctx, color = null) {
        this.center.drawPoint(ctx, color ?? this.color)
    }

    getAngle(rect = new Rectangle) {
        
    }

    draw(ctx, color = null) {
        if(!this.isVisible) return

        this.drawRotated(ctx, (x, y, width, height) => {
            fillRect(ctx, x, y, width, height, color ?? this.color)
        })
    }
}