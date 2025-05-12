import IAngleable from '../../interfaces/IAngleable'
import IRectangle from '../../interfaces/IRectangle'
import IShapeConfig from '../../interfaces/IShapeConfig'
import ISimplePoint from '../../interfaces/simple/ISimplePoint'
import ISimpleRect from '../../interfaces/simple/ISimpleRect'
import ISimpleSize from '../../interfaces/simple/ISimpleSize'
import ISizeable from '../../interfaces/ISizeable'
import Angle from '../../utils/Angle'
import Size from '../../utils/Size'
import { Context, PointType } from '../../utils/types'
import Camera from '../camera/Camera'
import DrawableObject from '../core/DrawableObject'
import Point from '../Point'
import Rectangle from '../shapes/Rectangle'
import Shape from '../shapes/Shape'

export default class ShapeableObject extends DrawableObject implements IShapeConfig, IRectangle, IAngleable {
    protected _shape: Shape = new Rectangle
    
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super()
        this.setPosition(x, y)
        this.setSize(width, height)
    }

    get bottom(): number {
        return this.shape.bottom
    }

    get right(): number {
        return this.shape.right
    }

    set point(value: ISimplePoint) {
        this.shape.point = value
    }

    get point(): PointType {
        return this.shape.point
    }

    set x(value: number) {
        this.shape.x = value
    }

    get x(): number {
        return this.shape.x
    }

    set y(value: number) {
        this.shape.y = value
    }

    get y(): number {
        return this.shape.y
    }

    updatePositionByOffset(point: ISimplePoint): void {
        this.shape.updatePositionByOffset(point)
    }

    addPosition(x: number, y: number): void {
        this.shape.addPosition(x, y)
    }

    move(point: ISimplePoint, delta: number): void {
        this.shape.move(point, delta)
    }

    setPosition(x?: number, y?: number): void {
        this.shape.setPosition(x, y)
    }

    set center(value: PointType) {
        this.shape.center = value
    }

    get center(): PointType {
        return this.shape.center
    }

    set size(value: ISimpleSize) {
        this.shape.size = value
    }

    get size(): Size {
        return this.shape.size
    }

    setSize(width?: number, height?: number): void {
        this.shape.setSize(width, height)
    }

    isPointInShape(point: Point): boolean {
        return this.shape.isPointInShape(point)
    }
    
    setShape(shape: Shape): void {
        this._shape = shape
    }

    setAngle(angle: Angle): void {
        this.shape.setAngle(angle)
    }

    addAngle(angle: Angle): void {
        this.setAngle(Angle.fromRadians(+this.shape.angle + +angle))
    }

    set shape(shape: Shape) {
        this.setShape(shape)
    }

    get shape(): Shape {
        return this._shape
    }

    get factRect(): ISimpleRect {
        return this.shape.factRect
    }

    setOffset(x: number, y: number): void {
        this.shape.setOffset(x, y)
    }

    set offset({x, y}: ISimplePoint) {
        this.setOffset(x, y)
    }
    
    get offset(): ISimplePoint {
        return this.shape.offset
    }

    protected _draw(ctx: Context): void {
        this.shape.draw(ctx)
    }

    update(delta: number): void {
        this.shape.update(delta)
    }

    isObjectInViewport(camera: Camera): boolean {
        return this.shape.isObjectInViewport(camera)
    }
}