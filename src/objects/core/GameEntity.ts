import IPointable from "../../interfaces/IPointable"
import ISimplePoint from "../../interfaces/simple/ISimplePoint"
import ISimpleRect from '../../interfaces/simple/ISimpleRect'
import CachedValue from '../../utils/CachedValue'
import SimpleRect from '../../utils/SimpleRect'
import { DrawablePointerable, PointType } from "../../utils/types"
import Camera from '../camera/Camera'
import GameObject from "./GameObject"
import Point from "../Point"

export default abstract class GameEntity extends GameObject implements IPointable {
    protected _position: Point
    protected _factRect: CachedValue<ISimpleRect>

    constructor(x?: number, y?: number) {
        super()

        this._position = new Point(x, y)
        this._factRect = new CachedValue(new SimpleRect())
        this._factRect.setUpdateCallback(() => this._updateFactRect())
    }

    addObject(object: DrawablePointerable): boolean {
        let isAdded = super.addObject(object)
        if(isAdded) {
            object.offset = object.point
        }

        return isAdded
    }

    removeObject(object: DrawablePointerable): boolean {
        let isRemoved = super.removeObject(object)

        if(!isRemoved) return false
        
        object.setOffset(0, 0)
        return true
    }

    get factRect(): ISimpleRect {
        return this._factRect.get()
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

    set point(point: ISimplePoint) {
        this._position.point = point
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

    updateObjectsPosition(): void {
        this.forEach(obj => {
            obj.updatePositionByOffset(this._position)
        })
    }

    protected _updateFactRect(): ISimpleRect {
        let x: number = Infinity
        let right: number = -Infinity

        let y: number = Infinity
        let bottom: number = -Infinity

        this.forEach(obj => {
            let factRect = obj.factRect

            let {x: fx, y: fy} = factRect

                x = Math.min(fx, x)
                y = Math.min(fy, y)

                let {width, height} = factRect

                right = Math.max(fx + width, right)
                bottom = Math.max(fy + height, bottom) 
        })

        let width: number = right - x
        let height: number = bottom - y

        return new SimpleRect(
            isFinite(x) ? x : 0,
            isFinite(y) ? y : 0,
            isFinite(width) ? width : 1,
            isFinite(height) ? height : 1,
        )
    }

    isObjectInViewport(camera: Camera): boolean {
        const {factRect} = this
        const {viewport} = camera

        return viewport.isBoxesIntersects(factRect)
    }

    updatePositionByOffset(point: ISimplePoint): void {
        this._position.updatePositionByOffset(point)

        this.updateObjectsPosition()
    }

    update(delta: number): void {
        this._factRect.needUpdate(true)
        this._update(delta)
        this.updateObjectsPosition()
    }
}