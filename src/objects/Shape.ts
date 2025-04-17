import IAngleable from "../interfaces/IAngleable"
import IRectangle from '../interfaces/IRectangle'
import ISimpleDrawableObject from "../interfaces/ISimpleDrawableObject"
import ISimplePoint from "../interfaces/ISimplePoint"
import ISimpleRect from "../interfaces/ISimpleRect"
import ISimpleShape from "../interfaces/ISimpleShape"
import ISimpleSize from "../interfaces/ISimpleSize"
import ISizeable from "../interfaces/ISizeable"
import Angle from "../utils/Angle"
import Bounds from '../utils/Bounds'
import CachedValue from "../utils/CachedValue"
import Color from '../utils/Color'
import SimpleRect from '../utils/SimpleRect'
import Size from "../utils/Size"
import { Context, PointType } from "../utils/types"
import VectorUtils from '../utils/VectorUtils'
import Camera from './Camera'
import Point from "./Point"

export default class Shape extends Point implements IRectangle, IAngleable {
    static cosBounds: Bounds = new Bounds(-1, 1)

    protected _isCachedValueExist: boolean = false
    protected _size: Size
    protected _cachedPath: CachedValue<Path2D>
    protected _cachedBoundingBox: CachedValue<ISimpleRect>
    protected _cachedCorners: CachedValue<Point[]>
    protected _angle: Angle
    protected _flipDirection: Point

    constructor(x?: number, y?: number) {
        super(x, y)

        this._size = new Size()
        this._cachedPath = new CachedValue(new Path2D)
        this._cachedPath.setUpdateCallback(() => this._updatePath())
        this._cachedBoundingBox = new CachedValue({x: 0, y: 0, width: 0, height: 0})
        this._cachedBoundingBox.setUpdateCallback(() => this._updateBox())
        this._cachedCorners = new CachedValue([])
        this._cachedCorners.setUpdateCallback(() => this._updateCorners())
        this._angle = new Angle()
        this._isCachedValueExist = true
        this._flipDirection = new Point(1)
    }

    get bottom(): number {
        let {y, height} = this.getBox()
        return y + height
    }
    get right(): number {
        let {x, width} = this.getBox()
        return x + width
    }

    flip(x: boolean, y: boolean) {
        this.flipHorisontally(x)
        this.flipVertically(y)
    }

    flipHorisontally(value: boolean) {
        this._flipDirection.x = value ? 1 : -1
    }

    flipVertically(value: boolean) {
        this._flipDirection.y = value ? 1 : -1
    }

    protected _updateCorners(): Point[] {
        return [new Point(this.x, this.y)]
    }

    getCorners(): Point[] {
        return this._cachedCorners.get()
    }

    protected _updateBox(): ISimpleRect {
        let min = new Point(Infinity)
        let max = new Point(-Infinity)

        for (const {x, y} of this.getCorners()) {
            if(x > max.x) max.x = x
            if(y > max.y) max.y = y
            
            if(x < min.x) min.x = x
            if(y < min.y) min.y = y
        }

        return new SimpleRect(
            min.x,
            min.y,
            max.x - min.x,
            max.y - min.y
        )
    }

    getBox(): ISimpleRect {
        return this._cachedBoundingBox.get()
    }

    protected _updatePath(): Path2D {
        let path: Path2D = new Path2D()
        let [firstCorner, ...corners] = this.getCorners()

        path.moveTo(firstCorner.x, firstCorner.y)

        for (const {x, y} of corners) {
            path.lineTo(x, y)
        }

        path.lineTo(firstCorner.x, firstCorner.y)

        return path
    }

    getPath(): Path2D {
        return this._cachedPath.get()
    }

    set size(value: ISimpleSize) {
        this._size.size = value
    }

    get size(): Size {
        let {width, height} = this._size
        return new Size(width, height)
    }

    set center({x, y}: ISimplePoint) {
        let {x: cx, y: cy} = this._size.center
        this.setPosition(
            x - cx,
            y - cy
        )
    }

    get center(): PointType {
        let {x: cx, y: cy} = this._size.center
        return new Point(
            this.x + cx,
            this.y + cy
        )
    }

    needUpdate(value: boolean | null = true): void {
        if(!this._isCachedValueExist) return

        this._cachedBoundingBox.needUpdate(value)
        this._cachedCorners.needUpdate(value)
        this._cachedPath.needUpdate(value)
    }

    isObjectInViewport(camera: Camera): boolean {
        let {viewport} = camera
        let other = viewport.getBox()

        return this.isBoxesIntersects(other)
    }

    setPosition(x?: number, y?: number): void {
        super.setPosition(x, y)
        this.needUpdate()
    }

    setSize(width?: number, height?: number): void {
        this._size.setSize(width, height)
        this.needUpdate()
    }

    setAngle(angle: Angle): void {
        this._angle.setAngle(angle)
        this.needUpdate()
    }

    addAngle(angle: Angle): void {
        this._angle.addAngle(angle)
        this.needUpdate()
    }

    set angle(value: Angle) {
        this.setAngle(value)
    }

    get angle(): Angle {
        return this._angle
    }

    get factRect(): ISimpleRect {
        return this.getBox()
    }

    simplify(): ISimpleDrawableObject & ISimpleShape {
        return {
            ...super.simplify(),
            size: this._size.simplify(),
            angle: this._angle.simplify()
        }
    }

    stroke(ctx: Context, color?: Color): void {
        this.updateContextParameters(ctx, color)
        this.drawOutline(ctx, color)
    }

    fill(ctx: Context, color?: Color): void {
        this.updateContextParameters(ctx, color)
        ctx.fill(this.getPath())
    }

    clip(ctx: Context, callback: (path: Path2D) => void): void {
        ctx.save()
        ctx.clip(this.getPath())
        callback(this.getPath())
        ctx.restore()
    }

    drawOutline(ctx: Context, color?: Color): void {
        this.updateColor(ctx, color)
        ctx.stroke(this.getPath())
    }

    protected _draw(ctx: Context): void {
        this.fill(ctx)
    }

    isPointInBoundingBox(point: Point): boolean {
        let box = this.getBox()

        return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height
    }

    isBoxesIntersects(other: ISimpleRect): boolean {
        let box = this.getBox()

        return box.x < other.x + other.width && box.x + box.width > other.x && box.y < other.y + other.height && box.y + box.height > other.y
    }

    isPointInShape(point: Point): boolean {
        if(!this.isPointInBoundingBox(point)) return false

        let corners = this.getCorners()

        if(corners.length == 0) return false
        if(corners.length == 1) return (this.x == point.x) && (this.y == point.y)
        
        let totalAngle: number = 0

        for (let i = 0; i < corners.length; i++) {
            const a1 = corners[i]
            const a2 = corners[(i + 1) % corners.length]

            const v1 = new Point(a1.x - point.x, a1.y - point.y)
            const v2 = new Point(a2.x - point.x, a2.y - point.y)

            const dot = VectorUtils.dot(v1, v2)
            const mag1 = VectorUtils.magnitude(v1)
            const mag2 = VectorUtils.magnitude(v2)

            const cosTheta = Shape.cosBounds.get(dot / (mag1 * mag2))
            const cross = VectorUtils.cross(v1, v2)
            let angle = Math.acos(cosTheta)

            if(cross < 0) angle = -angle

            totalAngle += angle
        }

        let a = Math.abs(totalAngle - (2 * Angle.Pi))

        return a > 7
    }

    drawTransformed(ctx: Context, cb: (x: number, y: number, width: number, height: number) => void) {
        const {width, height} = this.size
        const {x, y} = this

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(+this.angle)
        ctx.scale(this._flipDirection.x, this._flipDirection.y)

        cb(-width / 2, -height / 2, width, height)

        ctx.restore()
    }
}