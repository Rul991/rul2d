import IPointerable from "../interfaces/IPointerable"
import ISimplePoint from "../interfaces/ISimplePoint"
import ISimpleRect from '../interfaces/ISimpleRect'
import CachedValue from '../utils/CachedValue'
import SimpleRect from '../utils/SimpleRect'
import Size from '../utils/Size'
import { DrawablePointerable, PointType } from "../utils/types"
import Camera from './Camera'
import DrawableObject from './DrawableObject'
import GameObject from "./GameObject"
import Point from "./Point"
import Rectangle from './Rectangle'

export default class GameEntity extends GameObject implements IPointerable {
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
        if(isAdded) 
            object.offset = this._position

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

        let width: number = right - x
        let height: number = bottom - y

        return new SimpleRect(
            x,
            y,
            isFinite(width) ? width : 1,
            isFinite(height) ? height : 1,
        )
    }

    isObjectInViewport(camera: Camera): boolean {
        const {factRect} = this
        const {viewport} = camera

        return viewport.isBoxesIntersects(factRect)
    }

    updatePositionByOffset({x, y}: ISimplePoint): void {
        this._position.setPosition(
            x + this._offset.x,
            y + this._offset.y
        )
    }

    update(delta: number): void {
        this._update(delta)
        this.updateObjectsPosition()
    }
}