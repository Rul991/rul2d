import IMinMax from "../interfaces/IMinMax"
import CustomObject from "../objects/CustomObject"

export default class Bounds extends CustomObject implements IMinMax {
    public min: number
    public max: number

    constructor(min: number, max: number) {
        super()

        this.min = 0
        this.max = 0

        this.set(min, max)
    }

    set(min: number, max: number) {
        this.min = min
        this.max = max
    }

    get(value: number): number {
        if(value < this.min) return this.min
        else if(value > this.max) return this.max
        return value
    }

    simplify(): IMinMax {
        return {
            min: this.min,
            max: this.max
        }
    }
}