import { fillRect, strokeRect } from "./canvasWork.js"
import { Point } from "./Point.js"

export class Rectangle extends Point {
    constructor(x,y,width,height) {
        super(x,y)
        this.setSize(width, height)
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

    setSize(width, height) {
        this.width = width ?? 1
        this.height = height ?? this.width
    }

    drawOutline(ctx, color = 'green') {
        strokeRect(ctx, this.x, this.y, this.width, this.height, color)
    }

    draw(ctx, color = 'green') {
        fillRect(ctx, this.x, this.y, this.width, this.height, color)
    }
}