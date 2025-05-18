import ISimplePoint from '../../interfaces/simple/ISimplePoint'
import Bounds from '../../utils/bounds/Bounds'
import Logging from '../../utils/static/Logging'
import MathUtils from '../../utils/static/MathUtils'
import SimpleRect from '../../utils/SimpleRect'
import CanvasImage from './CanvasImage'
import Point from '../Point'
import Rectangle from '../shapes/Rectangle'
import JsonSpriteSheet from '../../interfaces/jsons/JsonSpriteSheet'

export default class SpriteSheet extends CanvasImage {
    protected _currentFrame: SimpleRect
    protected _rows: number
    protected _columns: number

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height)

        this._currentFrame = new SimpleRect()
        this._rows = 1
        this._columns = 1
        this.doWhenLoaded(() => {
            this.setCurrentFrame(new Point)
            this.setGrid(this._columns, this._rows)
        })
    }

    async loadImage(src: string): Promise<void> {
        await super.loadImage(src)
        this.setGrid(this._columns, this._rows)
    }

    protected async _loadJSONFromFile(result: JsonSpriteSheet): Promise<void> {
        await super._loadJSONFromFile(result)

        const {type, width, height} = result.size
        
        if(type == 'dimensions') {
            this.setGridBySize(width, height)
        }
        else if(type == 'grid') {
            this.setGrid(width, height)
        }
        else {
            Logging.engineWarn(`There is not supported type: ${type}`, this)
        }
    }

    setGrid(columns: number = 1, rows: number = 1): void {
        this.doWhenLoaded(() => {
            const {naturalWidth, naturalHeight} = this._image

            this.setGridBySize(
                naturalWidth / columns,
                naturalHeight / rows
            )
        })
    }

    setGridBySize(width: number, height: number): void {
        this.doWhenLoaded(() => {
            const {naturalWidth, naturalHeight} = this._image
            Logging.engineLog(naturalWidth, naturalHeight)
            Logging.engineLog(width, height)

            this._currentFrame.width = width
            this._currentFrame.height = height

            this._columns = MathUtils.ceil(naturalWidth / width)
            this._rows = MathUtils.ceil(naturalHeight / height)

            this.setCurrentFrame(this._currentFrame)
        })
    }

    getGridSize(): Point {
        return new Point(
            this._columns,
            this._rows
        )
    }

    setCurrentFrameByIndex(index: number): void {
        let point = new Point(
            index % this._columns,
            MathUtils.floor(index / this._columns)
        )

        this.setCurrentFrame(point)
    }

    setCurrentFrame({x, y}: ISimplePoint): void {
        if(x < 0 || x >= this._columns) Logging.engineWarn('x not in range', this)
        if(y < 0 || y >= this._rows) Logging.engineWarn('y not in range', this)

        this._currentFrame.x = new Bounds(0, this._columns).get(x)
        this._currentFrame.y = new Bounds(0, this._rows).get(y)

        this._cuttedImageBox = Rectangle.fromSimpleRectangle(this.getCurrentFrame())
    }

    getCurrentFrame(): SimpleRect {
        const { x, y, width, height } = this._currentFrame

        return new SimpleRect(
            x * width,
            y * height,
            width, 
            height
        )
    }
}