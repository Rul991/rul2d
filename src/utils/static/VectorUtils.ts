import ISimplePoint from "../../interfaces/ISimplePoint"
import Angle from "../Angle"

export default class VectorUtils {
    static getAngle({x, y}: ISimplePoint, {x: x1, y: y1}: ISimplePoint): Angle {
        return Angle.from(Math.atan2(y1 - y, x1 - x))
    }

    static getPerpendicular({x, y}: ISimplePoint): ISimplePoint {
        return {
            x: -y,
            y: x
        }
    }

    static getDoubleDistance({x, y}: ISimplePoint, {x: x1, y: y1}: ISimplePoint): number {
        return (x - x1) ** 2 + (y - y1) ** 2
    }

    static getDistance(first: ISimplePoint, second: ISimplePoint): number {
        return Math.sqrt(this.getDoubleDistance(first, second))
    }

    static isInDistance(first: ISimplePoint, second: ISimplePoint, maxDistance: number): boolean {
        return VectorUtils.getDoubleDistance(first, second) < (maxDistance * maxDistance)
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

    static normalize(point: ISimplePoint): ISimplePoint {
        let {x, y} = point

        let length = VectorUtils.magnitude(point)
        if(!length) return {x: 0, y: 0}

        return {
            x: x / length,
            y: y / length
        }
    }

    static createPointByCallback(first: ISimplePoint, second: ISimplePoint, callback: (first: number, second: number) => number): ISimplePoint {
        return {
            x: callback(first.x, second.x),
            y: callback(first.y, second.y)
        }
    }

    static plus(first: ISimplePoint, second: ISimplePoint): ISimplePoint {
        return this.createPointByCallback(first, second, (f, s) => f + s)
    }

    static minus(first: ISimplePoint, second: ISimplePoint): ISimplePoint {
        return this.createPointByCallback(first, second, (f, s) => f - s)
    }

    static multiply(first: ISimplePoint, second: ISimplePoint): ISimplePoint {
        return this.createPointByCallback(first, second, (f, s) => f * s)
    }

    static div(first: ISimplePoint, second: ISimplePoint): ISimplePoint {
        return this.createPointByCallback(first, second, (f, s) => f / s)
    }

    static negative({x, y}: ISimplePoint): ISimplePoint {
        return {
            x: -x,
            y: -y
        }
    }

    static multiplyOnNumber({x, y}: ISimplePoint, num: number): ISimplePoint {
        return {
            x: x * num,
            y: y * num
        }
    }
}