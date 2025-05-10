import IFont from '../interfaces/IFont'
import CachedValue from '../utils/CachedValue'
import { Context } from '../utils/types'
import CanvasManager from './CanvasManager'
import DynamicText from './DynamicText'

export default class StaticText extends DynamicText {
    protected _cachedTextImageUrl: CachedValue<string>
    protected _image: HTMLImageElement

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height)
        
        this._image = new Image()
        
        this._cachedTextImageUrl = new CachedValue('')
        this._cachedTextImageUrl.setUpdateCallback(() => this._updateTextImageUrl())
    }
    
    protected _updateTextImageUrl(): string {
        const url = CanvasManager.createImageURLFromTempCanvas({
            size: this.size,
            callback: ctx => {
                this._drawText(ctx)
            }
        })

        this._image.src = url
        return url
    }

    protected _needUpdateText(value?: boolean | null): void {
        super._needUpdateText(value)
        
        if(this._cachedTextImageUrl)
            this._cachedTextImageUrl.needUpdate(value)
    }

    set font(value: Partial<IFont>) {
        super.font = value
        this._cachedTextImageUrl.needUpdate()
    }

    protected _draw(ctx: Context): void {
        let url = this._cachedTextImageUrl.get()
        if(!url) return

        this.shape.clip(ctx, () => {
            this.shape.drawTransformed(ctx, (x, y) => {
                ctx.drawImage(this._image, x, y)
            })
        })
    }
}