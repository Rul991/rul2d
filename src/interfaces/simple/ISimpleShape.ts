import IAngle from "../IAngle"
import ISimplePoint from "./ISimplePoint"
import ISimpleSize from "./ISimpleSize"

export default interface ISimpleShape extends ISimplePoint {
    size: ISimpleSize,
    angle: IAngle
}