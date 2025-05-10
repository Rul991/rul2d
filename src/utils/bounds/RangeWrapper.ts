import Bounds from './Bounds'

export default class RangeWrapper extends Bounds {
    constructor(min: number, max: number) {
        super(min, max)
    }

    get(value: number): number {
        const range = this.max - this.min
        
        if (value < this.min) 
            return this.max - (this.min - value) % range
        
        if (value > this.max) 
            return this.min + (value - this.max) % range
        
        return value
    }
}