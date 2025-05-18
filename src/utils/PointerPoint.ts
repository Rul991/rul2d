import Point from '../objects/Point'

export default class PointerPoint extends Point {
    public pointerId: number

    constructor(x?: number, y?: number, id: number = 0) {
        super(x, y)
        this.pointerId = id
    }
}