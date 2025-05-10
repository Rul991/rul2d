import { PointType } from "../utils/types"
import ISimplePoint from "./simple/ISimplePoint"
import ISimpleSize from "./simple/ISimpleSize"

export default interface ISizeable {
    set center(value: ISimplePoint)
    get center(): PointType

    set size(value: ISimpleSize)
    get size(): ISizeable

    setSize(width?: number, height?: number): void
}