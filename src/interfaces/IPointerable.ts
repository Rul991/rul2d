import { NumberOrNull, PointType } from "../utils/types"
import ISimplePoint from "./ISimplePoint"

export default interface IPointerable {
    set point(value: ISimplePoint)
    get point(): PointType
    set x(value: number)
    get x(): number
    set y(value: number)
    get y(): number
    setPosition(x?: NumberOrNull, y?: NumberOrNull): void
    addPosition(x: number, y: number): void
    move(point: ISimplePoint, delta: number): void
}