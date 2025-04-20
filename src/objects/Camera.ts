import IAngleable from "../interfaces/IAngleable"
import IPointerable from "../interfaces/IPointerable"
import ISimpleCamera from "../interfaces/ISimpleCamera"
import ISimplePoint from "../interfaces/ISimplePoint"
import Angle from "../utils/Angle"
import Bounds from "../utils/Bounds"
import { Callback, Canvas, Context, PointType, SmoothingQuality } from "../utils/types"
import CustomObject from "./CustomObject"
import Point from "./Point"
import Rectangle from './Rectangle'

export default class Camera extends CustomObject implements IPointerable, IAngleable {
    static addStandardWheelListener(camera: Camera): boolean {
        let { canvas } = camera

        if(!canvas) return false

        canvas.addEventListener('wheel', e => {
            e.preventDefault()

            let {deltaX, deltaY, shiftKey, ctrlKey} = e

            if(ctrlKey) {
                camera.zoom += -deltaY / 100 * camera.zoom
            }

            else {
                if(shiftKey) {
                    deltaX = deltaY
                    deltaY = 0
                }

                camera.addPosition(-deltaX / camera.zoom, -deltaY / camera.zoom)
            }
        })

        return true
    }

    protected _ctx: Context | null
    protected _zoom: number
    protected _zoomLimit: Bounds
    protected _position: Point
    protected _angle: Angle

    protected _smoothingEnabled: boolean
    protected _smoothingQuality: SmoothingQuality

    constructor(ctx?: Context) {
        super()

        this._zoomLimit = new Bounds(0.5, 5)
        this._zoom = 1
        this._ctx = null
        this._position = new Point
        this._angle = new Angle()
        this._smoothingEnabled = false
        this._smoothingQuality = 'low'

        if(ctx) this.setContext(ctx)
    }

    setSmoothing(enabled: boolean, quality: SmoothingQuality): void {
        this._smoothingEnabled = enabled ?? this._smoothingEnabled
        this._smoothingQuality = quality ?? this._smoothingQuality
    }

    updateSmoothing(): void {
        if(!this._ctx) return

        const ctx: Context = this._ctx!

        ctx.imageSmoothingEnabled = this._smoothingEnabled
        ctx.imageSmoothingQuality = this._smoothingQuality
    }

    setAngle(angle: Angle): void {
        this._angle.setAngle(angle)
    }

    addAngle(angle: Angle): void {
        this._angle.addAngle(angle)
    }

    get canvas(): Canvas | null {
        if(!this._ctx) return null
        return this._ctx.canvas
    }

    get viewport(): Rectangle {
        let rect = new Rectangle(-this.x, -this.y, 1)
        let angle: Angle = Angle.fromRadians(+this._angle)
        rect.setAngle(angle)    

        if(!this._ctx) return rect

        const {width, height} = this._ctx.canvas

        rect.setSize(
            width  / this._zoom,
            height / this._zoom
        )

        return rect
    }

    set x(value: number) {
        let {y} = this._position
        this._position.setPosition(value, y)
    }

    get x(): number {
        return this._position.x
    }

    set y(value: number) {
        let {x} = this._position
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

    setPosition(x?: number, y?: number): void {
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
        let {x, y} = this._position
        this.doIfContextExist(ctx => {
            ctx.translate(x * this.zoom, y * this.zoom)
        })
    }

    scale(): void {
        this.doIfContextExist(ctx => {
            ctx.scale(this.zoom, this.zoom)
        })
    }

    rotate(): void {
        if(!this._angle.radians) return
        this.doIfContextExist(ctx => {
            let {center: {x, y}} = this.viewport
            ctx.translate(x, y)
            ctx.rotate(+this._angle)
            ctx.translate(-x, -y)
        })
    }

    end(): void {
        this.doIfContextExist(ctx => {
            ctx.restore()
        })
    }

    update(callback: (ctx: Context) => void): void {
        if(!this._ctx) return

        this.begin()
        this.translate()
        this.scale()
        this.rotate()
        this.updateSmoothing()
        callback(this._ctx)
        this.end()
    }

    simplify(): ISimpleCamera {
        let {x, y} = this._position
        return {
            zoom: this.zoom,
            x,
            y,
            zoomLimit: this._zoomLimit.simplify()
        }
    }
}