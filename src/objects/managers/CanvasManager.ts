import ISimplePoint from '../../interfaces/simple/ISimplePoint'
import ISimpleSize from '../../interfaces/simple/ISimpleSize'
import ITempCanvasOptions from '../../interfaces/options/ITempCanvasOptions'
import Logging from '../../utils/static/Logging'
import { Canvas, Context } from '../../utils/types'
import CustomObject from '../core/CustomObject'

export default class CanvasManager extends CustomObject {
    static tempCanvasManager: CanvasManager | null = null

    static createImageURLFromTempCanvas({size, quality = 0.9, mimeImageType: imageType = 'image/jpeg', callback = ctx => {}}: ITempCanvasOptions): string {
        if(!CanvasManager.tempCanvasManager) 
            CanvasManager.tempCanvasManager = CanvasManager.createTempCanvasManager(document.body, size)
        
        else 
            CanvasManager.tempCanvasManager.resize(size)

        CanvasManager.tempCanvasManager.clear()
        
        const canvas = CanvasManager.tempCanvasManager.canvas!
        const ctx = CanvasManager.tempCanvasManager.getContext()

        let result = ''
        
        if(!ctx) {
            Logging.engineWarn('no temp canvas\'s context')
            result = ''
        }
        else {
            callback(ctx)
            result = canvas.toDataURL(imageType, quality)
        }

        return result
    }

    static createTempCanvasManager(root: HTMLElement, size: ISimpleSize): CanvasManager {
        const canvasManager = new CanvasManager()
        const canvas = canvasManager.create({root, size})
        canvasManager.getContext()

        canvas.style.position = 'fixed'
        canvas.style.top = '-9999%'

        return canvasManager
    }

    private _canvas: Canvas | null
    private _ctx: Context | null
    private _isContextNeedUpdate: boolean

    constructor() {
        super()

        this._canvas = null
        this._ctx = null
        this._isContextNeedUpdate = true
    }

    get canvas(): Canvas | null {
        return this._canvas
    }

    get ctx(): Context | null {
        return this._ctx
    }

    get isCanvasExist(): boolean {
        return Boolean(this._canvas)
    }

    setCanvas(canvas: Canvas): void {
        this._canvas = canvas
        this._isContextNeedUpdate = true
    }

    getContext(): Context | null {
        if(!this.isCanvasExist) return null

        if(!this._ctx || this._isContextNeedUpdate) {
            this._ctx = this._canvas!.getContext('2d')
            this._isContextNeedUpdate = false
        }

        return this._ctx
    }

    resize({width, height}: ISimpleSize): void {
        if(!this.isCanvasExist) return

        if(this._canvas!.width != width) this._canvas!.width = width
        if(this._canvas!.height != height) this._canvas!.height = height
    }

    resizeToClientRect(): void {
        if(!this.isCanvasExist) return
        this.resize(this._canvas!.getBoundingClientRect())
    }

    create({root = document.body, size = null}: {root?: HTMLElement, size?: ISimpleSize | null} = {}): Canvas {
        let canvas = document.createElement('canvas')
        root.appendChild(canvas)
        this.setCanvas(canvas)

        if(size) this.resize(size)
        else this.addStandardResizeHandler()

        return canvas
    }

    clear({x, y}: ISimplePoint = {x: 0, y: 0}) {
        if(!this.isCanvasExist) return

        const {width, height} = this.canvas!
        
        this.ctx!.clearRect(x, y, width, height)
    }

    addStandardResizeHandler(): void {
        this.resizeToClientRect()
        addEventListener('resize', e => this.resizeToClientRect())
    }

    simplify() {
        return {
            isContextNeedUpdate: this._isContextNeedUpdate
        }
    }
}