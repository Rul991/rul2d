import Point from './Point'
import Shape from './Shape'

export default class Triangle extends Shape {
    constructor(x?: number, y?: number) {
        super(x, y)
    }

    protected _updateCorners(): Point[] {
        let {width, height} = this.size
        let {x, y, center} = this
        let {x: cx} = center

        return Shape.rotatePoints([
            new Point(cx, y),
            new Point(x, y + height),
            new Point(x + width, y + height)
        ], this.angle, center)
    }
}