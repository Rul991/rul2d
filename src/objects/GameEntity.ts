import IPointerable from "../interfaces/IPointerable"
import ISimplePoint from "../interfaces/ISimplePoint"
import { NumberOrNull, PointType } from "../utils/types"
import GameObject from "./GameObject"
import Point from "./Point"

export default class GameEntity extends GameObject implements IPointerable {
    protected _position: Point

    constructor(x: NumberOrNull = null, y: NumberOrNull = null) {
        super()

        this._position = new Point(x, y)
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

    setPosition(x?: NumberOrNull, y?: NumberOrNull): void {
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
            
        })
    }

    update(delta: number): void {
        super.update(delta)
        this.updateObjectsPosition()
    }
}