import IManager from "../interfaces/IManager"
import IRoot from "../interfaces/IRoot"
import ISimpleDrawableObject from "../interfaces/ISimpleDrawableObject"
import ISimplePoint from "../interfaces/ISimplePoint"
import ISimpleRect from '../interfaces/ISimpleRect'
import Bounds from "../utils/Bounds"
import Color from "../utils/Color"
import { Context, CurrentRoot, Dict, PointType } from "../utils/types"
import Camera from './Camera'
import CustomObject from "./CustomObject"
import EventEmitter from "./EventEmitter"
import GameWorld from './GameWorld'

export default abstract class DrawableObject extends CustomObject implements IRoot {
    static positiveNumberBounds: Bounds = new Bounds(Number.EPSILON, Number.MAX_SAFE_INTEGER)
    static opacityBounds: Bounds = new Bounds(0, 1)

    protected _lineWidth: number
    protected _opacity: number
    protected _zIndex: number
    protected _currentRootId: number
    protected _offset: ISimplePoint
    protected _color: Color

    public isVisible: boolean
    public isInViewport: boolean
    public managers: Set<IManager>
    public root: CurrentRoot
    public eventEmitter: EventEmitter

    constructor() {
        super()

        this.eventEmitter = new EventEmitter()
        this.root = null
        this.managers = new Set()

        this.isVisible = true
        this.isInViewport = true

        this._lineWidth = 1
        this._color = Color.Green
        this._currentRootId = 0
        this._opacity = 1
        this._zIndex = 1
        this._offset = {x: 0, y: 0}
    }

    abstract get factRect(): ISimpleRect

    get canBeSubObject(): boolean {
        return true
    }

    get zIndex(): number {
        let rootIndex = 0
        if(this.root) rootIndex = this.root.zIndex
        return this._zIndex + rootIndex
    }

    set zIndex(z: number) {
        this._zIndex = z
        for (const manager of this.managers) {
            manager.updateZIndex()
        }
    }

    get inheritOpacity(): number {
        let {root} = this

        if(!root) return this._opacity
        else return this._opacity * root.inheritOpacity
    }

    setVisibility(value: boolean): void {
        this.isVisible = value
    }

    setColor(color: Color): void {
        this._color = color
    }

    setOffset(x: number, y: number): void {
        this._offset.x = x
        this._offset.y = y
    }

    abstract updatePositionByOffset(point: ISimplePoint): void 

    set offset(point: ISimplePoint) {
        this.setOffset(point.x, point.y)
    }

    get offset(): ISimplePoint {
        return this._offset
    }

    set color(color: Color) {
        this.setColor(color)
    }

    get color(): Color {
        return this._color
    }

    set opacity(value: number) {
        this._opacity = DrawableObject.opacityBounds.get(value)
    }

    get opacity(): number {
        return this._opacity
    }

    set lineWidth(value: number) {
        this._lineWidth = DrawableObject.positiveNumberBounds.get(value)
    }

    get lineWidth(): number {
        return this._lineWidth
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

    init(world: GameWorld): void {
        
    }

    needDraw(): boolean {
        return this.isInViewport && this.isVisible
    }

    update(delta: number): void {}

    protected abstract _draw(ctx: Context): void
    abstract isObjectInViewport(camera: Camera): boolean

    draw(ctx: Context): void {
        if(!this.needDraw()) return
        ctx.save()

        this.updateContextParameters(ctx)
        this._draw(ctx)

        ctx.restore()
    }
}