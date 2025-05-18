import IMinMax from '../../interfaces/IMinMax'
import Logging from '../../utils/static/Logging'
import Point from '../Point'
import DrawablePath from './DrawablePath'
import Shape from './Shape'

export default class RelativeShape extends DrawablePath {
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y)
        this.setSize(width, height)
    }

    get absolutePoints(): Point[] {
        return Array.from(this._cachedCorners.get())
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
}