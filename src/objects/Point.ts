import IPointerable from "../interfaces/IPointerable"
import ISimpleDrawableObject from "../interfaces/ISimpleDrawableObject"
import ISimplePoint from "../interfaces/ISimplePoint"
import Angle from "../utils/Angle"
import Color from "../utils/Color"
import { Context, NumberOrNull, PointType } from "../utils/types"
import DrawableObject from "./DrawableObject"

export default class Point extends DrawableObject implements IPointerable {
    static drawRadius: number = 3

    protected _x: number
    protected _y: number

    constructor(x: NumberOrNull = null, y: NumberOrNull = null) {
        super()

        this._x = 0
        this._y = 0

        this.setPosition(x, y)
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

    setPosition(x: NumberOrNull = null, y: NumberOrNull = null): void {
        this._x = x ?? 0
        this._y = y ?? this._x
    }

    addPosition(x: number, y: number): void {
        this.setPosition(this._x + x, this._y + y)
    }

    move({x, y}: ISimplePoint, delta: number): void {
        this.addPosition(x * delta, y * delta)
    }   
    
    simplify(): ISimpleDrawableObject & ISimplePoint {
        return {
            ...super.simplify(),
            x: this._x,
            y: this._y
        }
    }

    drawPoint(ctx: Context): void {
        const drawArc = (radius: number) => ctx.arc(this._x, this._y, radius, 0, Angle.Pi2)
        
        this.updateColor(ctx)
        drawArc(Point.drawRadius)

        this.updateColor(ctx, Color.White)
        drawArc(2)

        this.updateColor(ctx)
        drawArc(1)
    }

    protected _draw(ctx: Context): void {
        this.drawPoint(ctx)
    }
}