import IAngleable from "../../interfaces/IAngleable"
import IRectangle from '../../interfaces/IRectangle'
import ISimpleDrawableObject from "../../interfaces/simple/ISimpleDrawableObject"
import ISimplePoint from "../../interfaces/simple/ISimplePoint"
import ISimpleRect from "../../interfaces/simple/ISimpleRect"
import ISimpleShape from "../../interfaces/simple/ISimpleShape"
import ISimpleSize from "../../interfaces/simple/ISimpleSize"
import Angle from "../../utils/Angle"
import Bounds from '../../utils/bounds/Bounds'
import CachedValue from "../../utils/CachedValue"
import Color from '../../utils/Color'
import SimpleRect from '../../utils/SimpleRect'
import Size from "../../utils/Size"
import { Context } from "../../utils/types"
import VectorUtils from '../../utils/static/VectorUtils'
import Camera from '../camera/Camera'
import Point from "../Point"
import SAT from '../../utils/static/SAT'
import Logging from '../../utils/static/Logging'

export default class Shape extends Point implements IRectangle, IAngleable {
    static rotatePoints(corners: Point[], angle: Angle, center: Point): Point[] {
        if(+angle == 0) return corners
        
        const radians = +angle
        const cos = Math.cos(radians)
        const sin = Math.sin(radians)

        return corners.map(point => {
            const translated = VectorUtils.minus(point, center)
            const rotated = new Point(
                translated.x * cos - translated.y * sin,
                translated.x * sin + translated.y * cos
            )

            return Point.fromSimplePoint(VectorUtils.plus(rotated, center))
        })
    }

    static cosBounds: Bounds = new Bounds(-1, 1)

    protected _isCachedValueExist: boolean = false
    protected _size: Size
    protected _cachedPath: CachedValue<Path2D>
    protected _cachedBoundingBox: CachedValue<ISimpleRect>
    protected _cachedCorners: CachedValue<Point[]>
    protected _angle: Angle
    protected _flipDirection: Point

    constructor(x?: number, y?: number, width?: number, height?: number) {
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
        this.setSize(width, height)
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
        let allCorners = this.getCorners()

        if(!allCorners.length) {
            Logging.engineWarn('no corners', this)
            return path
        }

        let [firstCorner, ...corners] = allCorners

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

    get center(): Point {
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

    protected _stroke(ctx: Context): void {
        ctx.stroke(this.getPath())
    }

    protected _fill(ctx: Context): void {
        ctx.fill(this.getPath())
    }

    clip(ctx: Context, callback: (path: Path2D) => void): void {
        ctx.save()
        ctx.clip(this.getPath())
        callback(this.getPath())
        ctx.restore()
    }

    isShapesIntersects(shape: Shape): boolean {
        if(!this.isBoxesIntersects(shape.getBox())) return false

        for (const point of shape.getCorners()) {
            if(this.isPointInShape(point))
                return true
        }

        return SAT.checkIntersections(this, shape)
    }

    isPointInBoundingBox(point: Point): boolean {
        let box = this.getBox()

        return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height
    }

    isBoxesIntersects(other: ISimpleRect): boolean {
        let box = this.getBox()

        return box.x <= other.x + other.width && box.x + box.width >= other.x && box.y <= other.y + other.height && box.y + box.height >= other.y
    }

    isPointInShape(point: Point): boolean {
        if(!this.isPointInBoundingBox(point)) return false

        let corners = this.getCorners()

        if(corners.length == 0) return false
        if(corners.length == 1) return (this.x == point.x) && (this.y == point.y)
        
        const {x, y} = point
        let inside = false

        for (let i = 0, j = corners.length - 1; i < corners.length; j = i++) {

            const {x: xi, y: yi} = corners[i]
            const {x: xj, y: yj} = corners[j]
        
            const intersect =
              ((yi > y) !== (yj > y)) &&
              (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
        
            if (intersect) {
              inside = !inside
            }
          }
        
          return inside
    }

    drawTransformed(ctx: Context, cb: (x: number, y: number, width: number, height: number) => void) {
        const {width, height} = this.size
        const {x, y} = this.center

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(+this.angle)
        ctx.scale(this._flipDirection.x, this._flipDirection.y)

        cb(-width / 2, -height / 2, width, height)

        ctx.restore()
    }
}