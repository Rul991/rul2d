import IRectangle from '../interfaces/IRectangle'
import IShapeConfig from '../interfaces/IShapeConfig'
import ISimplePoint from '../interfaces/ISimplePoint'
import ISimpleRect from '../interfaces/ISimpleRect'
import ISimpleSize from '../interfaces/ISimpleSize'
import ISizeable from '../interfaces/ISizeable'
import Color from '../utils/Color'
import { Callback, Context, PointerCallback, PointType } from '../utils/types'
import Camera from './Camera'
import DrawableObject from './DrawableObject'
import Point from './Point'
import Rectangle from './Rectangle'
import Shape from './Shape'
import ShapeableObject from './ShapeableObject'

export default class PointerableObject extends ShapeableObject implements IShapeConfig, IRectangle {
    private _nonDownCallbackFactory(cb: PointerCallback): PointerCallback {
        return p => {
            if(this._isDown) this._upCallback(p)
            cb(p)
            this.isPressed = false
            this._isDown = false
        }
    }

    private _hoverCallback: PointerCallback
    private _pressedCallback: PointerCallback
    private _downCallback: PointerCallback
    private _upCallback: PointerCallback
    private _nonAnyInteractiveCallback: PointerCallback

    public isPressed: boolean
    
    private _isDown: boolean
    
    constructor(x?: number, y?: number) {
        super(x, y)

        this._isDown = false
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

    get hoverCallback(): PointerCallback {
        return this._hoverCallback
    }

    get pressedCallback(): PointerCallback {
        return this._pressedCallback
    }

    get nonAnyInteractiveCallback(): PointerCallback {
        return this._nonAnyInteractiveCallback
    }

    doWhenDown(cb: PointerCallback): void {
        this._downCallback = cb
    }

    doWhenUp(cb: PointerCallback): void {
        this._upCallback = cb
    }

    doWhenPressed(cb: PointerCallback): void {
        this._pressedCallback = p => {
            if(!this._isDown) this._downCallback(p)
            cb(p)
            this.isPressed = true
            this._isDown = true
        }
    }

    doWhenHover(cb: PointerCallback): void {
        this._hoverCallback = this._nonDownCallbackFactory(cb)
    }

    doIfNotAnyInteracted(cb: PointerCallback): void {
        this._nonAnyInteractiveCallback = this._nonDownCallbackFactory(cb)
    }

    drawOutline(ctx: Context, color?: Color): void {
        if(this.isPressed) this.shape.drawOutline(ctx, Color.Red)
        else this.shape.drawOutline(ctx, color)
    }
}