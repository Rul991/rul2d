import { PointType } from "../utils/types"
import ISimplePoint from "./simple/ISimplePoint"

export default interface IPointable {
    set point(value: ISimplePoint)
    get point(): PointType
    set x(value: number)
    get x(): number
    set y(value: number)
    get y(): number
    setPosition(x?: number, y?: number): void
    addPosition(x: number, y: number): void
    move(point: ISimplePoint, delta: number): void
}