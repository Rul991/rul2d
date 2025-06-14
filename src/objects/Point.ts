import IPointable from "../interfaces/IPointable"
import ISimplePoint from "../interfaces/simple/ISimplePoint"
import ISimpleRect from '../interfaces/simple/ISimpleRect'
import Angle from "../utils/Angle"
import Color from "../utils/Color"
import SimpleRect from '../utils/SimpleRect'
import Logging from '../utils/static/Logging'
import { Context, PointType } from "../utils/types"
import Camera from './camera/Camera'
import DrawableObject from "./core/DrawableObject"

export default class Point extends DrawableObject implements IPointable {
    static get NaN(): Point {
        return new Point(NaN)
    }

    static fromSimplePoint({x, y}: ISimplePoint): Point {
        return new Point(x, y)
    }
    
    static drawRadius: number = 3

    protected _x: number
    protected _y: number

    constructor(x?: number, y?: number) {
        super()

        this._x = 0
        this._y = 0

        this.setPosition(x, y)
    }

    get factRect(): ISimpleRect {
        let halfRadius = Point.drawRadius / 2
        return new SimpleRect(this._x - halfRadius, this._y - halfRadius, Point.drawRadius * 2)
    }

    set x(value: number) {
        this.setPosition(value, this._y)
    }

    get x(): number {
        return this._x
    }

    set y(value: number) {
        this.setPosition(this._x, value)
    }

    get y(): number {
        return this._y
    }

    set point({x, y}: ISimplePoint) {
        this.setPosition(x, y)
    }

    get point(): PointType {
        return new Point(this._x, this._y)
    }

    updatePositionByOffset({x, y}: ISimplePoint): void {
        this.setPosition(
            x + this.offset.x,
            y + this.offset.y
        )

        Logging.engineSpam('new position by offset', this.point, this, this.offset)
    }

    setPosition(x?: number, y?: number): void {
        this._x = x ?? 0
        this._y = y ?? this._x
        this.eventEmitter.emit('update-position')
    }

    addPosition(x: number, y: number): void {
        this.setPosition(this._x + x, this._y + y)
    }

    move({x, y}: ISimplePoint, delta: number): void {
        this.addPosition(x * delta, y * delta)
    }   
    
    simplify() {
        return {
            ...super.simplify(),
            x: this._x,
            y: this._y
        }
    }

    drawPoint(ctx: Context): void {
        this._fill(ctx)
    }

    drawOutline(ctx: Context): void {
        this._stroke(ctx)
    }

    private _drawArc(ctx: Context, radius: number): void {
        ctx.beginPath()
        this.updateColor(ctx)
        ctx.arc(this._x, this._y, radius, 0, Angle.Pi2)
        ctx.closePath()
    }

    protected _fill(ctx: Context): void {
        this._drawArc(ctx, Point.drawRadius)
        ctx.fill()
        this._drawArc(ctx, 2)
        ctx.fill()
        this._drawArc(ctx, 1)
        ctx.fill()
    }

    protected _stroke(ctx: Context): void {
        this._drawArc(ctx, Point.drawRadius)
        ctx.stroke()
    }

    isObjectInViewport(camera: Camera): boolean {
        const {viewport} = camera
        return viewport.isPointInShape(this)
    }
}