import IRectangle from '../../interfaces/IRectangle'
import IShapeConfig from '../../interfaces/IShapeConfig'
import Color from '../../utils/Color'
import { Context, PointCallback } from '../../utils/types'
import ShapeableObject from './ShapeableObject'

export default class PointerableObject extends ShapeableObject implements IShapeConfig, IRectangle {
    protected _nonDownCallbackFactory(cb: PointCallback): PointCallback {
        return p => {
            if(this._isPressed && !this.isPressedInFrame) {
                this._isPressed = false
                this._upCallback(p)
            }
            cb(p)
        }
    }

    protected _hoverCallback: PointCallback
    protected _pressedCallback: PointCallback
    protected _downCallback: PointCallback
    protected _upCallback: PointCallback
    protected _nonInteractiveCallback: PointCallback
    protected _isPressed: boolean

    public isPressedInFrame: boolean
    
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height)

        this.isPressedInFrame = false
        this._isPressed = false

        this._downCallback = p => {}
        this._upCallback = p => {}
        this._hoverCallback = p => {}
        this._pressedCallback = p => {}
        this._nonInteractiveCallback = p => {}

        this.doWhenPressed(p => {})
        this.doWhenHover(p => {})
        this.doWhenNotInteracted(p => {})
    }

    get isPressed(): boolean {
        return this._isPressed
    }

    get hoverCallback(): PointCallback {
        return this._hoverCallback
    }

    get pressedCallback(): PointCallback {
        return this._pressedCallback
    }

    get nonInteractiveCallback(): PointCallback {
        return this._nonInteractiveCallback
    }

    doWhenDown(cb: PointCallback): void {
        this._downCallback = cb
    }

    doWhenUp(cb: PointCallback): void {
        this._upCallback = cb
    }

    doWhenPressed(cb: PointCallback): void {
        this._pressedCallback = p => {
            if(!this._isPressed && this.isPressedInFrame) {
                this._isPressed = true
                this._downCallback(p)
            }
            cb(p)
        }
    }

    doWhenHover(cb: PointCallback): void {
        this._hoverCallback = this._nonDownCallbackFactory(cb)
    }

    doWhenNotInteracted(cb: PointCallback): void {
        this._nonInteractiveCallback = this._nonDownCallbackFactory(cb)
    }

    drawOutline(ctx: Context, color?: Color): void {
        if(this._isPressed) this.shape.drawOutline(ctx, Color.Red)
        else this.shape.drawOutline(ctx, color)
    }
}