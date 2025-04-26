import ISimpleRect from '../interfaces/ISimpleRect'
import CustomObject from '../objects/CustomObject'

export default class SimpleRect extends CustomObject implements ISimpleRect {
    public x: number
    public y: number
    public width: number
    public height: number

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super()
        this.x = x ?? 0
        this.y = y ?? this.x
        
        this.width = width || 1
        this.height = height || this.width
    }

    simplify() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        }
    }
}