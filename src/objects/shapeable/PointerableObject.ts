import IRectangle from '../../interfaces/IRectangle'
import IShapeConfig from '../../interfaces/IShapeConfig'
import Color from '../../utils/Color'
import { Context, PointCallback } from '../../utils/types'
import ShapeableObject from './ShapeableObject'

export default class PointerableObject extends ShapeableObject implements IShapeConfig, IRectangle {
    private _nonDownCallbackFactory(cb: PointCallback): PointCallback {
        return p => {
            if(this.isPressed) this._upCallback(p)
            cb(p)
            this.isPressed = false
        }
    }

    private _hoverCallback: PointCallback
    private _pressedCallback: PointCallback
    private _downCallback: PointCallback
    private _upCallback: PointCallback
    private _nonAnyInteractiveCallback: PointCallback

    public isPressed: boolean
    
    constructor(x?: number, y?: number) {
        super(x, y)

        this.isPressed = false

        this._downCallback = p => {}
        this._upCallback = p => {}
        this._hoverCallback = p => {}
        this._pressedCallback = p => {}
        this._nonAnyInteractiveCallback = p => {}

        this.doWhenPressed(p => {})
        this.doWhenHover(p => {})
        this.doIfNotAnyInteracted(p => {})
    }

    get hoverCallback(): PointCallback {
        return this._hoverCallback
    }

    get pressedCallback(): PointCallback {
        return this._pressedCallback
    }

    get nonAnyInteractiveCallback(): PointCallback {
        return this._nonAnyInteractiveCallback
    }

    doWhenDown(cb: PointCallback): void {
        this._downCallback = cb
    }

    doWhenUp(cb: PointCallback): void {
        this._upCallback = cb
    }

    doWhenPressed(cb: PointCallback): void {
        this._pressedCallback = p => {
            if(!this.isPressed) this._downCallback(p)
            cb(p)
            this.isPressed = true
        }
    }

    doWhenHover(cb: PointCallback): void {
        this._hoverCallback = this._nonDownCallbackFactory(cb)
    }

    doIfNotAnyInteracted(cb: PointCallback): void {
        this._nonAnyInteractiveCallback = this._nonDownCallbackFactory(cb)
    }

    drawOutline(ctx: Context, color?: Color): void {
        if(this.isPressed) this.shape.drawOutline(ctx, Color.Red)
        else this.shape.drawOutline(ctx, color)
    }
}