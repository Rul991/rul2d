import DrawMode from '../../enums/DrawMode'
import IManager from "../../interfaces/IManager"
import IRoot from "../../interfaces/IRoot"
import ISimpleDrawableObject from "../../interfaces/simple/ISimpleDrawableObject"
import ISimplePoint from "../../interfaces/simple/ISimplePoint"
import ISimpleRect from '../../interfaces/simple/ISimpleRect'
import Bounds from "../../utils/bounds/Bounds"
import Color from "../../utils/Color"
import Logging from '../../utils/static/Logging'
import { Callback, Context, CurrentRoot } from "../../utils/types"
import Camera from '../camera/Camera'
import CustomObject from "./CustomObject"
import EventEmitter from "../EventEmitter"
import GameWorld from './GameWorld'

export default abstract class DrawableObject extends CustomObject implements IRoot {
    static positiveNumberBounds: Bounds = new Bounds(Number.EPSILON, Number.MAX_SAFE_INTEGER)
    static normalizedBounds: Bounds = new Bounds(0, 1)

    protected _lineWidth: number
    protected _opacity: number
    protected _zIndex: number
    protected _currentRootId: number
    protected _offset: ISimplePoint
    protected _color: Color
    protected _isInitialized: boolean
    protected _drawMode: DrawMode
    
    public outlineColor: Color
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
        this._isInitialized = false

        this._lineWidth = 1
        this._color = Color.Black
        this.outlineColor = Color.Red
        this._currentRootId = 0
        this._opacity = 1
        this._zIndex = this.id
        this._offset = {x: 0, y: 0}
        this._drawMode = DrawMode.Fill
    }

    setDrawMode(mode: DrawMode): void {
        this._drawMode = mode
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
        Logging.engineLog('updated z-index', this)
    }

    get inheritOpacity(): number {
        let {root} = this

        if(!root) return this._opacity
        else return this._opacity * root.inheritOpacity
    }

    setVisibility(value: boolean): void {
        this.isVisible = value
        Logging.engineLog(`update visibility: ${value}`, this)
    }

    toggleVisibility(): boolean {
        this.setVisibility(!this.isVisible)
        return this.isVisible
    }

    setColor(color: Color): void {
        this._color = color
        Logging.engineLog(`update color: ${color}`, this)
    }

    setOffset(x: number, y: number): void {
        this._offset.x = x
        this._offset.y = y

        Logging.engineLog(`update offset: (${x} ${y})`, this)
    }

    abstract updatePositionByOffset(point: ISimplePoint): void 

    set offset({x, y}: ISimplePoint) {
        this.setOffset(x, y)
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
        this._opacity = DrawableObject.normalizedBounds.get(value)
        Logging.engineLog(`update opacity: (${this._opacity})`, this)
    }

    get opacity(): number {
        return this._opacity
    }
    
    set lineWidth(value: number) {
        this._lineWidth = DrawableObject.positiveNumberBounds.get(value)
        Logging.engineLog(`update opacity: (${this._lineWidth})`, this)
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

    updateColor(ctx: Context): void {
        ctx.fillStyle = this.color.toString()
        ctx.strokeStyle = this.outlineColor.toString()

        Logging.engineSpam(`update color for context: (${ctx.fillStyle})`, this)
    }

    updateContextParameters(ctx: Context): void {
        this.updateColor(ctx)

        ctx.lineWidth = this._lineWidth
        ctx.globalAlpha = this.inheritOpacity

        Logging.engineSpam(`update context parameters`, this)
    }

    protected _init(world: GameWorld): void {}

    init(world: GameWorld): void {
        if(this._isInitialized) return

        this._isInitialized = true
        this._init(world)
        Logging.engineSpam(`initialized`, this)
    }

    isNeedDraw(): boolean {
        return this.isInViewport && this.isVisible
    }

    update(delta: number): void {
        Logging.engineSpam(`updated(${delta})`, this)
    }

    protected _fill(ctx: Context): void {}

    protected _stroke(ctx: Context): void {}

    protected _drawDefault(ctx: Context): void {
        this.executeCallbackByDrawMode(
            () => this._fill(ctx),
            () => this._stroke(ctx),
        )
    }

    protected _draw(ctx: Context): void {
        this._drawDefault(ctx)
    }

    abstract isObjectInViewport(camera: Camera): boolean

    executeCallbackByDrawMode(fillCallback: Callback, strokeCallback: Callback): void {
        switch (this._drawMode) {
            case DrawMode.Fill:
                fillCallback()
                break

            case DrawMode.Stroke:
                strokeCallback()
                break

            case DrawMode.All:
                fillCallback()
                strokeCallback()
                break
        
            default:
                break
        }
    }

    draw(ctx: Context): void {
        if(!this.isNeedDraw()) return
        ctx.save()

        this.updateContextParameters(ctx)
        this._draw(ctx)

        ctx.restore()
        Logging.engineSpam(`drawed`, this)
    }
}