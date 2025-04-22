import ISimpleDrawableObject from '../interfaces/ISimpleDrawableObject'
import ISimpleRect from '../interfaces/ISimpleRect'
import ISimpleShape from '../interfaces/ISimpleShape'
import Angle from '../utils/Angle'
import SimpleRect from '../utils/SimpleRect'
import VectorUtils from '../utils/VectorUtils'
import DrawableObject from './DrawableObject'
import Point from './Point'
import Rectangle from './Rectangle'
import Shape from './Shape'

export default class Circle extends Shape {
    private _radius: number

    constructor(x?: number, y?: number, radius?: number) {
        super(x, y)

        this._radius = 1
        this.setRadius(radius)
    }

    protected _updateCorners(): Point[] {
        let points: Point[] = []
        let {x, y} = this.center

        for (let angle = 0; angle <= Angle.Pi2; angle += Angle.Rad_1) {
            let sin = Math.sin(angle)
            let cos = Math.cos(angle)

            let point = new Point(
                x + this.radius * cos,
                y + this.radius * sin
            )

            points.push(point)
        }

        return points
    }

    protected _updateBox(): ISimpleRect {
        return new SimpleRect(
            this.x,
            this.y,
            this.radius * 2
        )
    }

    protected _updatePath(): Path2D {
        let {x, y} = this.center
        let path = new Path2D
        path.arc(x, y, this.radius, 0, Angle.Pi2)

        return path
    }

    isPointInShape(point: Point): boolean {
        return VectorUtils.isInDistance(this, point, this.radius)
    }

    setRadius(radius?: number): void {
        this._radius = DrawableObject.positiveNumberBounds.get(radius ?? 1)
        super.setSize(this._radius * 2)
        this.needUpdate()
    }

    set radius(radius: number) {
        this.setRadius(radius)
    }

    get radius(): number {
        return this._radius
    }

    setSize(width?: number, height?: number): void {
        let newWidth = width || 1
        let newHeight = height || newWidth

        this.setRadius(Math.min(newWidth, newHeight) / 2)
    }

    simplify(): ISimpleDrawableObject & ISimpleShape & {radius: number} {
        return {
            ...super.simplify(),
            radius: this.radius
        }
    }
}