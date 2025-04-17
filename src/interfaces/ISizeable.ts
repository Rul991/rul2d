import { PointType } from "../utils/types"
import ISimplePoint from "./ISimplePoint"
import ISimpleSize from "./ISimpleSize"

export default interface ISizeable {
    set center(value: ISimplePoint)
    get center(): PointType

    set size(value: ISimpleSize)
    get size(): ISizeable

    setSize(width?: number, height?: number): void
}