import ISimplePoint from "../interfaces/ISimplePoint"
import Angle from "./Angle"

export default class VectorUtils {
    static getAngle({x, y}: ISimplePoint, {x: x1, y: y1}: ISimplePoint): Angle {
        return Angle.from(Math.atan2(y1 - y, x1 - x))
    }

    static getDoubleDistance({x, y}: ISimplePoint, {x: x1, y: y1}: ISimplePoint): number {
        return (x - x1) ** 2 + (y - y1) ** 2
    }

    static getDistance(first: ISimplePoint, second: ISimplePoint): number {
        return Math.sqrt(this.getDoubleDistance(first, second))
    }

    static magnitude(vector: ISimplePoint): number {
        return this.getDistance(vector, {x: 0, y: 0})
    }

    static cross(first: ISimplePoint, second: ISimplePoint): number {
        return first.x * second.y - first.y * second.x
    }

    static dot(first: ISimplePoint, second: ISimplePoint): number {
        return first.x * second.x + first.y * second.y
    }
}