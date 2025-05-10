import IMinMax from '../../interfaces/IMinMax'
import JsonRelativeShape from '../../interfaces/jsons/JsonRelativeShape'
import Logging from '../../utils/static/Logging'
import { Context } from '../../utils/types'
import Point from '../Point'
import Shape from './Shape'

export default class RelativeShape extends Shape {
    protected _relativePoints: Point[]

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y)
        this.setSize(width, height)

        this._relativePoints = []
    }

    get relativePoints(): Point[] {
        return Array.from(this._relativePoints)
    }

    get absolutePoints(): Point[] {
        return Array.from(this._cachedCorners.get())
    }

    protected async _loadJSONFromFile(result: JsonRelativeShape): Promise<void> {
        this.clearPoints()
        result.forEach(point => {
            this.addPoints(Point.fromSimplePoint(point))
        })
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

    fitPoints(): void {
        if(!this._relativePoints.length) return

        const x: IMinMax = {
            min: Infinity,
            max: -Infinity
        }

        const y: IMinMax = {
            min: Infinity,
            max: -Infinity
        }

        const {min, max} = Math

        for (const point of this.getCorners()) {
            x.min = min(x.min, point.x)
            x.max = max(x.max, point.x)

            y.min = min(y.min, point.y)
            y.max = max(y.max, point.y)
        }

        const range = new Point(
            x.max - x.min,
            y.max - y.min
        )

        this._relativePoints = this._relativePoints.map((point) => {
            let newX = (point.x - x.min) / range.x
            let newY = (point.y - y.min) / range.y
            return new Point(
                isFinite(newX) ? newX: 0,
                isFinite(newY) ? newY: 0
            )
        })

        Logging.engineLog(this._relativePoints)
        Logging.engineLog('fitted relative shape', this)

        this.needUpdate()
    }

    protected _updateCorners(): Point[] {
        const {width, height} = this.size
        const corners: Point[] = this._relativePoints.map(({x, y}) => {
            return new Point(
                x * width + this.x,
                y * height + this.y
            )
        })

        return Shape.rotatePoints(corners, this.angle, this.center)
    }

    protected _draw(ctx: Context): void {
        if(this._relativePoints.length > 2) super._draw(ctx)
        else this.drawOutline(ctx)
    }
}