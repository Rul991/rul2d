import { fillRect, strokeRect } from "./canvasWork.js"
import { deg2rad, rad2deg } from "./numberWork.js"
import Point from "./Point.js"

export default class Rectangle extends Point {
    constructor(x,y,width,height) {
        super(x,y)
        this.setSize(width, height)
        this._radians = 0
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
        return {x: this.x, y: this.y, width: this.width, height: this.height}
    }

    get bottom() {
        return this.y + this.height
    }

    get right() {
        return this.x + this.width
    }

    get center() {
        return new Point(this.x + this.width / 2, this.y + this.height / 2)
    }

    setSize(width, height) {
        this.width = width ?? 1
        this.height = height ?? this.width
    }

    drawOutline(ctx, color = 'green') {
        strokeRect(ctx, this.x, this.y, this.width, this.height, color)
    }

    draw(ctx, color = 'green') {
        if(!this.isVisible) return
        fillRect(ctx, this.x, this.y, this.width, this.height, color)
    }
}