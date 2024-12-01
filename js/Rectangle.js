import { fillRect, strokeRect } from "./utils/canvasWork.js"
import { deg2rad, rad2deg } from "./utils/numberWork.js"
import Point from "./Point.js"

export default class Rectangle extends Point {
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

    set isNeedUpdateGeometry(value) {
        this.isNeedUpdateCorners = value
        this.isNeedUpdateBoundingBox = value
    }

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

    getMaxBoundingBox() {
        let rect = this.rect
        rect.degrees = 45
        return rect.getBoundingBox()
    }

    set rotatedRect(rect) {
        let {radians} = rect

        this.rect = rect
        this.radians = radians
    }

    get rotatedRect() {
        let rect = new Rectangle()
        rect.rect = this.rect
        rect.radians = this.radians

        return rect
    }

    set radians(value) {
        this._radians = value % deg2rad(360)
        this.isNeedUpdateGeometry = true
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
        return new Rectangle(0, 0, width, height)
    }

    set scale(value) {
        this.addPosition(new Point(this.width / 2, this.height / 2))
        this.setSize(this.width / this.scale, this.height / this.scale)
        this._scale = value
        this.setSize(this.width * this.scale, this.height * this.scale)
        this.addPosition(new Point(-this.width / 2, -this.height / 2))
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

    get cornersArray() {
        return Object.entries(this.corners).map(([key, point]) => point)
    }

    get diagonal() {
        return Math.sqrt(this.width ** 2 + this.height ** 2)
    }

    setPosition(x, y) {
        this.isNeedUpdateGeometry = true
        super.setPosition(x, y)
    }

    setSize(width, height) {
        this.isNeedUpdateGeometry = true
        this.width = width || 1
        this.height = height || this.width
    }

    flip(x = false, y = false) {
        this.flipHorizontally(x)
        this.flipVertically(y)
    }

    flipVertically(isFlip = false) {
        this.isFlip.y = isFlip ? -1 : 1
    }

    flipHorizontally(isFlip = false) {
        this.isFlip.x = isFlip ? -1 : 1
    }

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

    drawOutline(ctx, color = null) {
        ctx.lineWidth = this.lineWidth
        this.drawRotated(ctx, (x, y, width, height) => {
            strokeRect(ctx, x, y, width, height, color ?? this.color)
        })
    }

    drawCenter(ctx, color = null) {
        this.center.drawPoint(ctx, color ?? this.color)
    }

    draw(ctx, color = null) {
        if(!this.isInViewport || !this.isVisible) return
        if(!this.isVisible) return

        this.drawRotated(ctx, (x, y, width, height) => {
            fillRect(ctx, x, y, width, height, color ?? this.color)
        })
    }
}