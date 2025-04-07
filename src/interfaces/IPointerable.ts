import { NumberOrNull } from "../utils/types"
import ISimplePoint from "./ISimplePoint"

export default interface IPointerable extends ISimplePoint {
    set point(value: ISimplePoint)
    get point(): IPointerable
    setPosition(x?: NumberOrNull, y?: NumberOrNull): void
    addPosition(x: number, y: number): void
    move(point: ISimplePoint, delta: number): void
}