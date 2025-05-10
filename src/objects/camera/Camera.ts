import IAngleable from "../../interfaces/IAngleable"
import IPointable from "../../interfaces/IPointable"
import ISimpleCamera from "../../interfaces/simple/ISimpleCamera"
import ISimplePoint from "../../interfaces/simple/ISimplePoint"
import Angle from "../../utils/Angle"
import Bounds from "../../utils/bounds/Bounds"
import Logging from '../../utils/static/Logging'
import MathUtils from '../../utils/static/MathUtils'
import { Canvas, Context, PointType, SmoothingQuality } from "../../utils/types"
import VectorUtils from '../../utils/static/VectorUtils'
import CustomObject from "../core/CustomObject"
import DrawableObject from '../core/DrawableObject'
import Point from "../Point"
import Rectangle from '../shapes/Rectangle'
import LocalStorageManager from '../managers/LocalStorageManager'
import CachedValue from '../../utils/CachedValue'

export default class Camera extends CustomObject implements IPointable, IAngleable {
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

        Logging.engineLog('added standard wheel listener for', camera)

        return true
    }

    static loadCameraFromStorage(storage: LocalStorageManager<ISimpleCamera>, camera: Camera): void {
        const x = storage.get('x', 0)!
        const y = storage.get('y', 0)!
        const zoom = storage.get('zoom', 1)!
        
        camera.zoom = zoom
        camera.setPositionInstant(x, y)
    }

    static addStandardCameraSaver(storageName: string, camera: Camera): void {
        const storage = new LocalStorageManager<ISimpleCamera>(storageName)

        this.loadCameraFromStorage(storage, camera)

        const {canvas} = camera

        if(!canvas) return Logging.engineWarn('Camera hasnt canvas')

        canvas.addEventListener('wheel', e => {
            const {x, y} = camera.target
            storage.set('x', x)
            storage.set('y', y)
            storage.set('zoom', camera.zoom)
        })
    }

    protected _ctx: Context | null
    protected _zoom: number
    protected _zoomLimit: Bounds

    protected _position: Point
    protected _targetPosition: Point
    protected _angle: Angle

    protected _smoothingEnabled: boolean
    protected _smoothingQuality: SmoothingQuality
    protected _lerpFactor: number

    protected _cachedViewport: CachedValue<Rectangle>

    constructor(ctx?: Context) {
        super()

        this._zoomLimit = new Bounds(0.5, 5)
        this._zoom = 1
        this._ctx = null
        this._position = new Point
        this._targetPosition = new Point
        this._angle = new Angle()
        this._smoothingEnabled = false
        this._smoothingQuality = 'low'
        this._lerpFactor = 0.5
        this._cachedViewport = new CachedValue(new Rectangle)
        this._cachedViewport.setUpdateCallback(() => this._updateViewport())

        if(ctx) this.setContext(ctx)
    }

    setSmoothFactor(factor: number) {
        this._lerpFactor = DrawableObject.normalizedBounds.get(factor)
        Logging.engineLog('set smooth factor', this._lerpFactor, this)
    }

    setSmoothing(enabled: boolean, quality: SmoothingQuality): void {
        this._smoothingEnabled = enabled ?? this._smoothingEnabled
        this._smoothingQuality = quality ?? this._smoothingQuality
        Logging.engineLog('set smoothing', this)
    }

    updateSmoothing(): void {
        if(!this._ctx) return

        const ctx: Context = this._ctx!

        ctx.imageSmoothingEnabled = this._smoothingEnabled
        ctx.imageSmoothingQuality = this._smoothingQuality
        Logging.engineLog('update smoothing', ctx)
    }

    setAngle(angle: Angle): void {
        this._angle.setAngle(angle)
        this._cachedViewport.needUpdate()
    }

    addAngle(angle: Angle): void {
        this._angle.addAngle(angle)
        this._cachedViewport.needUpdate()
    }

    get canvas(): Canvas | null {
        if(!this._ctx) return null
        return this._ctx.canvas
    }

    setZoomLimit(min: number, max: number): void {
        this._zoomLimit.set(min, max)
    }

    protected _updateViewport(): Rectangle {
        let rect = new Rectangle(-this.x, -this.y, 1)
        let angle: Angle = Angle.fromRadians(+this._angle)
        rect.setAngle(angle)    

        if(!this._ctx) return rect

        const {width, height} = this._ctx.canvas

        rect.setSize(
            width  / this._zoom,
            height / this._zoom
        )

        Logging.engineLog(`update viewport`, rect, this)

        return rect
    }

    get viewport(): Rectangle {
        return this._cachedViewport.get()
    }

    set x(value: number) {
        let {y} = this._position
        this._targetPosition.setPosition(value, y)
    }

    get x(): number {
        return this._position.x
    }

    set y(value: number) {
        let {x} = this._position
        this._targetPosition.setPosition(x, value)
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
        this._targetPosition.point = value
    }

    get point(): PointType {
        return this._position.point
    }

    updatePosition(): void {
        this._cachedViewport.needUpdate()
        const t = this._lerpFactor
        let {x, y} = VectorUtils.minus(
            this._targetPosition,
            this._position
        )

        if(t == 1) {
            this._position.point = this._targetPosition
        }
        else {
            this._position.setPosition(
                MathUtils.lerp(this.x, x, t),
                MathUtils.lerp(this.y, y, t),
            )
        }
    }

    get position(): Point {
        return this._position
    }

    get target(): Point {
        return this._targetPosition
    }

    setPositionInstant(x?: number, y?: number): void {
        this._position.setPosition(x, y)
        this.setPosition(x, y)
    }

    setPosition(x?: number, y?: number): void {
        this._targetPosition.setPosition(x, y)
    }

    addPosition(x: number, y: number): void {
        this._targetPosition.addPosition(x, y)
    }

    move(point: ISimplePoint, delta: number): void {
        this._targetPosition.move(point, delta)
    }

    doIfContextExist(cb: (ctx: Context) => void): void {
        if(this._ctx)
            cb(this._ctx)
    }

    setContext(ctx: Context): void {
        this._ctx = ctx
        this._cachedViewport.needUpdate()
        this._ctx.canvas.addEventListener('resize', e => this._cachedViewport.needUpdate())
        // Я занимался тем, что делал кэширование для viewport
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