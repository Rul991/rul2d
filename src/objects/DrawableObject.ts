import IManager from "../interfaces/IManager"
import IRoot from "../interfaces/IRoot"
import ISimpleDrawableObject from "../interfaces/ISimpleDrawableObject"
import ISimplePoint from "../interfaces/ISimplePoint"
import Bounds from "../utils/Bounds"
import Color from "../utils/Color"
import { Context, CurrentRoot, Dict, PointType } from "../utils/types"
import CustomObject from "./CustomObject"

export default abstract class DrawableObject extends CustomObject implements IRoot {
    static positiveNumberBounds: Bounds = new Bounds(Number.EPSILON, Number.MAX_SAFE_INTEGER)
    static opacityBounds: Bounds = new Bounds(0, 1)

    protected _lineWidth: number
    protected _opacity: number
    protected _zIndex: number
    protected _currentRootId: number
    protected _offset: ISimplePoint
    protected _color: Color

    public managers: Set<IManager>
    public roots: Map<number, IRoot>

    constructor() {
        super()

        this.managers = new Set()
        this.roots = new Map()
        this._lineWidth = 1
        this._color = Color.Green
        this._currentRootId = 0
        this._opacity = 1
        this._zIndex = 0
        this._offset = {x: 0, y: 0}
    }

    get zIndex(): number {
        return this._zIndex
    }

    set zIndex(z: number) {
        this._zIndex = z
        for (const manager of this.managers) {
            manager.updateZIndex()
        }
    }

    get inheritOpacity(): number {
        let root: CurrentRoot = this.getCurrentRoot()

        if(!root) return this._opacity
        else return this._opacity * root.inheritOpacity
    }

    setCurrentRoot(id: number): void {
        this._currentRootId = id
    }

    getCurrentRoot(): CurrentRoot {
        return this.roots.get(this._currentRootId) ?? null
    }

    setColor(color: Color) {
        this._color = color
    }

    simplify(): ISimpleDrawableObject {
        return {
            color: this._color.simplify(),
            lineWidth: this._lineWidth,
            opacity: this._opacity,
            zIndex: this.zIndex
        }
    }

    updateColor(ctx: Context, color: Color = this._color): void {
        let colorString: string = color.toString()

        ctx.fillStyle = colorString
        ctx.strokeStyle = colorString
    }

    updateContextParameters(ctx: Context, color: Color = this._color): void {
        this.updateColor(ctx, color)

        ctx.lineWidth = this._lineWidth
        ctx.globalAlpha = this.inheritOpacity
    }

    update(delta: number): void {}

    protected abstract _draw(ctx: Context): void

    draw(ctx: Context): void {
        ctx.save()

        this.updateContextParameters(ctx)
        this._draw(ctx)

        ctx.restore()
    }
}