import ICornerRadii from '../interfaces/ICornerRadii'
import Angle from '../utils/Angle'
import CachedValue from '../utils/CachedValue'
import MathUtils from '../utils/static/MathUtils'
import { PointType } from '../utils/types'
import DrawableObject from './DrawableObject'
import Point from './Point'
import Shape from './Shape'

export default class RoundedRectangle extends Shape {
    static createArc(center: Point, radius: number, startAngle: Angle, endAngle: Angle, segments: number = 8): Point[] {
        let corners: Point[] = []

        const angleStep = (+endAngle - +startAngle) / segments

        for(let i = 1; i <= segments; i++) {
            const rad = +startAngle + i * angleStep

            const x = center.x + radius * Math.cos(rad)
            const y = center.y + radius * Math.sin(rad)

            corners.push(new Point(x, y))
        }

        return corners
    }

    protected _rawRadii: ICornerRadii
    protected _radii: CachedValue<ICornerRadii>
    protected _arcSegmentsCount: number

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height)

        this._rawRadii = {
            leftTop: 0,
            leftBottom: 0,
            rightTop: 0,
            rightBottom: 0
        }

        this._arcSegmentsCount = 8

        this._radii = new CachedValue(this._rawRadii)
        this._radii.setUpdateCallback(() => this._normalizeRadii())
    }

    set arcSegmentsCount(value: number) {
        this._arcSegmentsCount = Math.floor(DrawableObject.positiveNumberBounds.get(value))
        this._radii.needUpdate()
        this.needUpdate()
    }

    get arcSegmentsCount(): number {
        return this._arcSegmentsCount
    }

    setRadii(leftTop: number, leftBottom: number, rightTop: number, rightBottom: number): void {
        this._rawRadii = { leftTop, leftBottom, rightTop, rightBottom }
        this._radii.needUpdate()
    }

    setSize(width?: number, height?: number): void {
        super.setSize(width, height)
        
        if(this._radii)
            this._radii.needUpdate()
    }

    get maxRadius(): PointType {
        return this.size.center
    }

    protected _normalizeRadii(): ICornerRadii {
        let {x, y} = this.maxRadius
        return this._rawRadii = {
            leftTop: Math.min(this._rawRadii.leftTop, x, y),
            leftBottom: Math.min(this._rawRadii.leftBottom, x, y),
            rightTop: Math.min(this._rawRadii.rightTop, x, y),
            rightBottom: Math.min(this._rawRadii.rightBottom, x, y)
        }
    }

    protected _updateCorners(): Point[] {
        let corners: Point[] = []
        let {width, height} = this.size

        const { 
            leftTop,
            leftBottom,
            rightTop,
            rightBottom
        } = this._radii.get()
        
        corners.push(
            new Point(
                this.x + leftTop,
                this.y
            ),

            new Point(
                this.x + width - rightTop,
                this.y
            )
        )

        if(rightTop > 0) {
            corners.push(
                ...RoundedRectangle.createArc(
                    new Point(
                        this.x + width - rightTop,
                        this.y + rightTop
                    ),
                    rightTop,
                    Angle.fromDegrees(270),
                    Angle.fromDegrees(359.99), 
                    this._arcSegmentsCount
                )
            )
        }

        corners.push(new Point(
            this.x + width,
            this.y + height - rightBottom
        ))

        if(rightBottom > 0) {
            corners.push(
                ...RoundedRectangle.createArc(
                    new Point(
                        this.x + width - rightBottom,
                        this.y + height - rightBottom
                    ),
                    rightBottom,
                    Angle.fromDegrees(0),
                    Angle.fromDegrees(90), 
                    this._arcSegmentsCount
                )
            )
        }

        corners.push(new Point(
            this.x + leftBottom,
            this.y + height
        ))

        if(leftBottom > 0) {
            corners.push(
                ...RoundedRectangle.createArc(
                    new Point(
                        this.x + leftBottom,
                        this.y + height - leftBottom
                    ),
                    leftBottom,
                    Angle.fromDegrees(90),
                    Angle.fromDegrees(180), 
                    this._arcSegmentsCount
                )
            )
        }

        corners.push(new Point(
            this.x, 
            this.y + leftTop
        ))

        if(leftTop > 0) {
            corners.push(
                ...RoundedRectangle.createArc(
                    new Point(
                        this.x + leftTop,
                        this.y + + leftTop
                    ),
                    leftTop,
                    Angle.fromDegrees(180),
                    Angle.fromDegrees(270), 
                    this._arcSegmentsCount
                )
            )
        }

        return RoundedRectangle.rotatePoints(corners, this.angle, this.center)
    }
}