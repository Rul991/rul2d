import IPointerable from "../interfaces/IPointerable"
import ISimpleCamera from "../interfaces/ISimpleCamera"
import ISimplePoint from "../interfaces/ISimplePoint"
import Bounds from "../utils/Bounds"
import { Callback, Context, NumberOrNull, PointType } from "../utils/types"
import CustomObject from "./CustomObject"
import Point from "./Point"

export default class Camera extends CustomObject implements IPointerable {
    protected _ctx: Context | null
    protected _zoom: number
    protected _zoomLimit: Bounds
    protected _position: Point

    constructor(ctx: Context | null = null) {
        super()

        this._zoomLimit = new Bounds(0.5, 5)
        this._zoom = 1
        this._ctx = null
        this._position = new Point

        if(ctx) this.setContext(ctx)
    }

    set x(value: number) {
        let {y}: ISimplePoint = this._position
        this._position.setPosition(value, y)
    }

    get x(): number {
        return this._position.x
    }

    set y(value: number) {
        let {x}: ISimplePoint = this._position
        this._position.setPosition(x, value)
    }

    get y(): number {
        return this._position.y
    }

    set zoom(value: number) {
        this._zoom = this._zoomLimit.get(value)
    }

    get zoom(): number {
        return this._zoom
    }

    set point(value: PointType) {
        this._position.point = value
    }

    get point(): PointType {
        return this._position.point
    }

    setPosition(x?: NumberOrNull, y?: NumberOrNull): void {
        this._position.setPosition(x, y)
    }

    addPosition(x: number, y: number): void {
        this._position.addPosition(x, y)
    }

    move(point: ISimplePoint, delta: number): void {
        this._position.move(point, delta)
    }

    doIfContextExist(cb: (ctx: Context) => void): void {
        if(this._ctx)
            cb(this._ctx)
    }

    setContext(ctx: Context): void {
        this._ctx = ctx
    }

    begin(): void {
        this.doIfContextExist(ctx => {
            ctx.save()
        })
    }

    translate(): void {
        let {x, y} = this.simplify()
        this.doIfContextExist(ctx => {
            ctx.translate(-x, -y)
        })
    }

    scale(): void {

    }

    rotate(): void {

    }

    end(): void {
        this.doIfContextExist(ctx => {
            ctx.restore()
        })
    }

    update(callback: Callback): void {
        if(!this._ctx) return

        this.begin()
        this.translate()
        this.scale()
        this.rotate()
        callback()
        this.end()
    }

    simplify(): ISimpleCamera {
        let {x, y} = this._position.simplify()
        return {
            zoom: this.zoom,
            x,
            y,
            zoomLimit: this._zoomLimit.simplify()
        }
    }
}