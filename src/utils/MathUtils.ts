import IMinMax from '../interfaces/IMinMax';

export default class MathUtils {
    static floor(x: number, afterDot: number = 0): number {
        return MathUtils.updateWithAfterDotNumber(x, afterDot, Math.floor)
    }

    static ceil(x: number, afterDot: number = 0): number {
        return MathUtils.updateWithAfterDotNumber(x, afterDot, Math.ceil)
    }

    static round(x: number, afterDot: number = 0): number {
        return MathUtils.updateWithAfterDotNumber(x, afterDot, Math.round)
    }

    static updateWithAfterDotNumber(x: number, afterDot: number, callback: (power: number) => number): number {
        if (!afterDot) return callback(x)
        let power = 10 ** afterDot
        return callback(x * power) / power
    }

    static percents(value: number, { min, max }: IMinMax = { min: 0, max: 100 }): number {
        return (value - min) / (max - min)
    }

    static getArrayValueByCondition<T>(array: T[], conditionCallback: (value: number, last: number) => boolean, valueCallback = (value: T) => +value): T | null {
        if (array.length == 0) return null
        if (array.length == 1) return array[0]

        let conditionValue = array[0]
        let conditionCallbackValue = valueCallback(conditionValue)

        for (const value of array) {
            let callbackValue = valueCallback(value)
            if (conditionCallback(callbackValue, conditionCallbackValue)) {
                conditionValue = value
                conditionCallbackValue = callbackValue
            }
        }

        return conditionValue
    }

    static min<T>(values: T[], valueCallback = (value: T) => +value) {
        return MathUtils.getArrayValueByCondition(values, (value, last) => {
            return value < last
        }, valueCallback)
    }

    static max<T>(values: T[], valueCallback = (value: T) => +value) {
        return MathUtils.getArrayValueByCondition(values, (value, last) => {
            return value > last
        }, valueCallback)
    }
}