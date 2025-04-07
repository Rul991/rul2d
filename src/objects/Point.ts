import IPointerable from "../interfaces/IPointerable"
import ISimpleDrawableObject from "../interfaces/ISimpleDrawableObject"
import ISimplePoint from "../interfaces/ISimplePoint"
import Angle from "../utils/Angle"
import Color from "../utils/Color"
import { Context, NumberOrNull } from "../utils/types"
import DrawableObject from "./DrawableObject"

export default class Point extends DrawableObject implements IPointerable {
    static drawRadius: number = 3

    public x: number
    public y: number

    constructor(x: NumberOrNull = null, y: NumberOrNull = null) {
        super()

        this.x = 0
        this.y = 0

        this.setPosition(x, y)
    }

    set point({x, y}: ISimplePoint) {
        this.setPosition(x, y)
    }

    get point(): IPointerable {
        return new Point(this.x, this.y)
    }

    setPosition(x: NumberOrNull = null, y: NumberOrNull = null): void {
        this.x = x ?? 0
        this.y = y ?? this.x
    }

    addPosition(x: number, y: number): void {
        this.setPosition(this.x + x, this.y + y)
    }

    move({x, y}: ISimplePoint, delta: number): void {
        this.addPosition(x * delta, y * delta)
    }   
    
    simplify(): ISimpleDrawableObject & ISimplePoint {
        return {
            ...super.simplify(),
            x: this.x,
            y: this.y
        }
    }

    drawPoint(ctx: Context): void {
        const drawArc = (radius: number) => ctx.arc(this.x, this.y, radius, 0, Angle.Pi2)
        
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