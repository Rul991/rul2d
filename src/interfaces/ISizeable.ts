import IPointerable from "./IPointerable"
import ISimplePoint from "./ISimplePoint"
import ISize from "./ISize"

export default interface ISizeable extends ISize {
    set center(value: ISimplePoint)
    get center(): IPointerable

    set size(value: ISize)
    get size(): ISizeable
}