import ISimplePoint from "../interfaces/ISimplePoint"
import ISize from "../interfaces/ISize"
import { Canvas, Context } from "../utils/types"
import CustomObject from "./CustomObject"

export default class CanvasManager extends CustomObject {
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

    resize({width, height}: ISize): void {
        if(!this.isCanvasExist) return

        this._canvas!.width = width
        this._canvas!.height = height
    }

    resizeToClientRect(): void {
        if(!this.isCanvasExist) return
        this.resize(this._canvas!.getBoundingClientRect())
    }

    create({root = document.body, size = null}: {root?: HTMLElement, size?: ISize | null} = {}): Canvas {
        let canvas = document.createElement('canvas')
        root.appendChild(canvas)
        this.setCanvas(canvas)

        if(size) this.resize(size)
        else this.addStandardResizeHandler()

        return canvas
    }

    clear({x: x, y: y}: ISimplePoint = {x: 0, y: 0}) {
        if(!this.isCanvasExist) return

        const {width, height} = this.canvas!
        
        this.ctx!.clearRect(x, y, width, height)
    }

    addStandardResizeHandler(): void {
        this.resizeToClientRect()
        addEventListener('resize', e => this.resizeToClientRect())
    }

    simplify(): {} {
        return {}
    }
}