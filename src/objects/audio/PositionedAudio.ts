import IPointable from '../../interfaces/IPointable'
import ISimplePoint from '../../interfaces/simple/ISimplePoint'
import ISimpleRect from '../../interfaces/simple/ISimpleRect'
import Logging from '../../utils/static/Logging'
import VectorUtils from '../../utils/static/VectorUtils'
import { Context, PointType } from '../../utils/types'
import BaseAudio from './BaseAudio'
import Circle from '../shapes/Circle'

export default class PositionedAudio extends BaseAudio implements IPointable {
    public circle: Circle

    protected _listenedObject?: IPointable
    protected _maxVolume: number

    constructor(x?: number, y?: number, radius?: number) {
        super()

        this.circle = new Circle(x, y, radius)
        this._maxVolume = 1
        this.setVisibility(false)
    }

    set point(value: ISimplePoint) {
        this.circle.point = value
    }

    get point(): PointType {
        return this.circle.point
    }

    set x(value: number) {
        this.circle.x = value
    }

    get x(): number {
        return this.circle.x
    }

    set y(value: number) {
        this.circle.y = value
    }

    get y(): number {
        return this.circle.y
    }

    setPosition(x?: number, y?: number): void {
        this.circle.setPosition(x, y)
    }

    set radius(radius: number) {
        this.circle.setRadius(radius)
    }

    get radius(): number {
        return this.circle.radius
    }

    setListenedObject(obj: IPointable): void {
        this._listenedObject = obj
    }

    addPosition(x: number, y: number): void {
        this.circle.addPosition(x, y)
    }

    move(point: ISimplePoint, delta: number): void {
        this.circle.move(point, delta)
    }

    protected _draw(ctx: Context): void {
        this.circle.drawOutline(ctx)
        this.circle.center.drawPoint(ctx)
    }

    protected set factVolume(value: number) {
        super.volume = value
    }

    get factVolume(): number {
        return super.volume
    }

    set volume(value: number) {
        this._maxVolume = PositionedAudio.volumeBounds.get(value)
    }

    get volume(): number {
        return this._maxVolume
    }
    
    get factRect(): ISimpleRect {
        return this.circle.factRect
    }

    update(delta: number): void {
        if(!this._listenedObject) return

        const distance = VectorUtils.getDistance(this.circle.center, this._listenedObject)
        const volume = Math.max(this.volume - (distance / this.radius * this.volume), 0)
        
        if(!isFinite(volume)) return Logging.engineWarn(this, `volume isnt finite: ${volume}`)
        this.factVolume = volume
    }

    updatePositionByOffset(point: ISimplePoint): void {
        this.circle.updatePositionByOffset(point)
    }

    simplify() {
        return {
            ...super.simplify(),
            radius: this.circle.radius
        }
    }
}