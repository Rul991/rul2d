import Angle from '../../utils/Angle'
import CachedValue from '../../utils/CachedValue'
import Color from '../../utils/Color'
import Size from '../../utils/Size'
import Logging from '../../utils/static/Logging'
import Search from '../../utils/static/Search'
import Sorting from '../../utils/static/Sorting'
import { ColorStop, Context } from '../../utils/types'
import DrawableObject from '../core/DrawableObject'
import CanvasManager from '../managers/CanvasManager'
import Shape from '../shapes/Shape'
import ShapeableObject from './ShapeableObject'

export default class LinearGradient extends ShapeableObject {
    protected _colorStops: ColorStop[]
    protected _image: HTMLImageElement
    protected _cachedImageUrl: CachedValue<void>
    protected _gradientAngle: Angle
    protected _step: number

    public isStatic: boolean

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height)

        this._colorStops = []
        this._image = new Image()
        this._gradientAngle = new Angle
        this._cachedImageUrl = new CachedValue(undefined)
        this._cachedImageUrl.setUpdateCallback(() => this._updateCachedImageUrl())

        this._step = 1
        this.isStatic = false
    }

    set step(value: number) {
        this._cachedImageUrl.needUpdate()
        this._step = DrawableObject.positiveNumberBounds.get(value)
    }

    get step(): number {
        return this._step
    }

    protected _drawGradient(ctx: Context, x = 0, y = 0): void {
        if(this._colorStops.length < 2) return

        const { width, height } = this.size

        const theta = +this._gradientAngle

        const box = new Size(
            Math.abs(width * Math.cos(theta)) + Math.abs(height * Math.sin(theta)),
            Math.abs(width * Math.sin(theta)) + Math.abs(height * Math.cos(theta))
        )

        const shape = new Shape(
            x + this.size.width / 2 - box.width / 2,
            y + this.size.height / 2 - box.height / 2
        )
        shape.size = box
        shape.angle = this._gradientAngle

        shape.drawTransformed(ctx, (startX, startY, w, h) => {
            const halfWidth = w / 2
            for (let x = startX; x < halfWidth; x += this._step) {
                const position = (x + halfWidth) / w

                let startStop = this._colorStops[0]
                let endStop = this._colorStops.at(-1)!

                for (let i = 0; i < this._colorStops.length - 1; i++) {
                    const [offset] = this._colorStops[i]
                    const [offset1] = this._colorStops[i + 1]

                    if (position >= offset && position <= offset1) {
                        startStop = this._colorStops[i]
                        endStop = this._colorStops[i + 1]
                        break
                    }
                }

                const factor = (position - startStop[0]) / (endStop[0] - startStop[0]) || 0
                
                ctx.fillStyle = Color.interpolate(startStop[1], endStop[1], factor).toString()
                ctx.fillRect(x, startY, this._step, h)
            }
        })
    }

    protected _updateCachedImageUrl(): void {
        const url = CanvasManager.createImageURLFromTempCanvas({
            size: this.size,
            callback: ctx => {
                this._drawGradient(ctx)
            }
        })

        this._image.src = url
    }

    setPosition(x?: number, y?: number): void {
        super.setPosition(x, y)

        if(this._cachedImageUrl)
            this._cachedImageUrl.needUpdate()
    }

    setSize(width?: number, height?: number): void {
        super.setSize(width, height)

        if(this._cachedImageUrl)
            this._cachedImageUrl.needUpdate()
    }

    setGradientAngle(angle: Angle): void {
        this._gradientAngle.setAngle(angle)
        this._cachedImageUrl.needUpdate()
    }

    addGradientAngle(angle: Angle): void {
        this.setGradientAngle(this._gradientAngle)
        this._gradientAngle.addAngle(angle)
    }

    addColorStop(offset: number, color: Color): void {
        if(offset < 0 || offset > 1) return Logging.engineWarn(`offset(${offset}) not in range 0..=1`, this)
        if(!this._colorStops.every(([num]) => num != offset)) return Logging.engineWarn(`Gradient contains color with offset: ${offset}`, this)

        Sorting.addToArray(this._colorStops, [offset, color], ([offset]) => offset as number)
        this._cachedImageUrl.needUpdate()
    }

    removeColorStop(offset: number): boolean {
        if(offset < 0 || offset > 1) return false

        let i = Search.binary(this._colorStops, [offset, new Color], ([offset]) => {
            return offset as number
        })

        let result = i != -1

        if(result) {
            this._colorStops.splice(i, 1)
        }

        this._cachedImageUrl.needUpdate()
        return result
    }

    protected _draw(ctx: Context): void {
        this.shape.clip(ctx, () => {
            this.shape.drawTransformed(ctx, (x, y, width, height) => {
                if(this.isStatic) {
                    this._cachedImageUrl.get()
                    ctx.drawImage(this._image, x, y, width, height)
                }
                else 
                    this._drawGradient(ctx, x, y)
            })
        })
    }
}