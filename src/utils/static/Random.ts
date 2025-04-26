import MathUtils from "./MathUtils"
import IMinMax from "../../interfaces/IMinMax"

export default class Random {
    static number(max: number, afterDot: number = 0): number {
        return MathUtils.floor(Math.random() * max + 1, afterDot)
    }

    static range(min: number, max: number, afterDot = 0): number {
        return MathUtils.floor(Math.random() * (max - min + 1), afterDot) + min
    }

    static chance(value: number, max: number): boolean {
        return Random.range(0, max) < value
    }

    static array(count: number, {min, max}: IMinMax = {min: 0, max: 100}, afterDot = 0): number[] {
        let arr = new Array(count)

        for (let i = 0; i < arr.length; i++) {
            arr[i] = Random.range(min, max, afterDot)
        }

        return arr
    }
}