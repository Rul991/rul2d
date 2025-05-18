import JsonRelativeShape from '../../interfaces/jsons/JsonRelativeShape'
import { Context } from '../../utils/types'
import Point from '../Point'
import Shape from './Shape'

export default class DrawablePath extends Shape {
    protected _relativePoints: Point[]

    constructor(x?: number, y?: number) {
        super(x, y)

        this._relativePoints = []
    }
    
    get relativePoints(): Point[] {
        return Array.from(this._relativePoints)
    }

    clearPoints() {
        this._relativePoints = []
        this.needUpdate()
    }
    
    addPoints(...points: Point[]): void {
        this._relativePoints.push(...points)

        this.needUpdate()
    }

    removePoints(...points: Point[]): void {
        if(!this._relativePoints.length) return

        points.forEach(point => {
            let i = this._relativePoints.indexOf(point)
            if(i == -1) return

            this._relativePoints.splice(i, 1)
        })

        this.needUpdate()
    }

    protected async _loadJSONFromFile(result: JsonRelativeShape): Promise<void> {
        this.clearPoints()
        result.forEach(point => {
            this.addPoints(Point.fromSimplePoint(point))
        })
    }

    protected _updateCorners(): Point[] {
        const corners: Point[] = this._relativePoints.map(({x, y}) => {
            return new Point(
                x + this.x,
                y + this.y
            )
        })

        return Shape.rotatePoints(corners, this.angle, this.center)
    }

    protected _draw(ctx: Context): void {
        if(this._relativePoints.length > 2) super._draw(ctx)
        else this.drawOutline(ctx)
    }
}