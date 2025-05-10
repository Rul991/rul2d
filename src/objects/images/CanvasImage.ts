import JsonCanvasImage from '../../interfaces/jsons/JsonCanvasImage'
import Angle from '../../utils/Angle'
import AssetsManager from '../../utils/AssetsManager'
import SimpleRect from '../../utils/SimpleRect'
import { Callback, Context } from '../../utils/types'
import Rectangle from '../shapes/Rectangle'
import Shape from '../shapes/Shape'
import ShapeableObject from '../ShapeableObject'

export default class CanvasImage extends ShapeableObject {
    protected _cuttedImageBox: Rectangle | null
    protected _image: HTMLImageElement
    protected _isLoaded: boolean

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y)
        this.setSize(width, height)

        this._isLoaded = false
        this._image = new Image

        this.eventEmitter.on('image-load', e => {
            this._isLoaded = true
        })

        this._cuttedImageBox = null

        this.log()
    }

    protected async _loadJSONFromFile(result: JsonCanvasImage): Promise<void> {
        await this.loadImage(result.src)
    }

    doWhenLoaded(cb: Callback): void {
        if(this.isLoaded()) {
            cb()
        }
        else {
            this.eventEmitter.once('image-load', e => {
                cb()
            })
        }
    }

    setShape(shape: Shape): void {
        shape.setPosition(this.x, this.y)
        shape.setSize(this.size.width, this.size.height)
        super.setShape(shape)
    }

    setAngle(angle: Angle): void {
        super.setAngle(angle)
        if(this._cuttedImageBox)
            this._cuttedImageBox.setAngle(angle)
    }

    cutImage({x, y, width, height}: SimpleRect): void {
        if(!this._cuttedImageBox) 
            this._cuttedImageBox = new Rectangle

        this._cuttedImageBox.setPosition(x, y)
        this._cuttedImageBox.setSize(width, height)
    }

    setImage(image: HTMLImageElement): void {
        this._image = image
    }

    async loadImage(src: string): Promise<void> {
        let assets = new AssetsManager()

        let image = await assets.loadImageFile(src)

        this.setImage(image)
        image.addEventListener('load', e => this.eventEmitter.emitDefault('image-load'))
    }

    isLoaded(): boolean {
        return this._isLoaded
    }

    protected _draw(ctx: Context): void {
        if(!this.isLoaded()) return

        let imageBox: Rectangle

        if(!this._cuttedImageBox!) 
            imageBox = new Rectangle(0, 0, this._image!.naturalWidth, this._image!.naturalHeight)
        else
            imageBox = this._cuttedImageBox

        let {x, y, size: {width, height}} = imageBox

        this.shape.clip(ctx, () => {
            this.shape.drawTransformed(ctx, (dx, dy, dw, dh) => {
                ctx.drawImage(
                    this._image!,   
                    x,              
                    y,              
                    width,          
                    height,         
                    dx,         
                    dy,         
                    dw,
                    dh
                )
            })
        })
    }
}