import IAngle from '../../interfaces/IAngle'
import IRectangle from '../../interfaces/IRectangle'
import ISimpleDrawableObject from "../../interfaces/simple/ISimpleDrawableObject"
import ISimplePoint from "../../interfaces/simple/ISimplePoint"
import ISimpleRect from "../../interfaces/simple/ISimpleRect"
import ISimpleShape from '../../interfaces/simple/ISimpleShape'
import ISimpleSize from "../../interfaces/simple/ISimpleSize"
import MathUtils from "../../utils/static/MathUtils"
import Sorting from "../../utils/static/Sorting"
import { Context } from "../../utils/types"
import Point from "../Point"
import Shape from "./Shape"

export default class Rectangle extends Shape implements IRectangle {
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y)
        this.setSize(width, height)
    }

    get bottom(): number {
        return this.y + this.size.height
    }

    get right(): number {
        return this.x + this.size.width
    }

    set rect({x, y, width, height}: ISimpleRect) {
        this.setPosition(x, y)
        this.setSize(width, height)
    }

    get rect(): Rectangle {
        return Rectangle.from(this, this.size)
    }

    set rotatedRectangle(rect: ISimpleRect & IAngle) {
        this.rect = rect
        this.angle.radians = rect.radians
    }

    get rotatedRectangle(): Rectangle {
        let rectangle = this.rect
        rectangle.setAngle(this.angle)

        return rectangle
    }

    protected _updateCorners(): Point[] {
        let {width, height} = this.size
        let {x, y, center} = this

        return Shape.rotatePoints([
            new Point(x, y),
            new Point(x + width, y),
            new Point(x + width, y + height),
            new Point(x, y + height),
        ], this.angle, center)
    }

    static from(position: ISimplePoint, size: ISimpleSize): Rectangle {
        let rect = new Rectangle
        rect.point = position
        rect.size = size

        return rect
    }

    static fromSimpleRectangle(rect: ISimpleRect): Rectangle {
        let result = new Rectangle()
        result.rect = rect

        return result
    }

    static fromPoints(first: Point, second: Point): Rectangle {
        const minX = Math.min(first.x, second.x)
        const maxX = Math.max(first.x, second.x)
        const minY = Math.min(first.y, second.y)
        const maxY = Math.max(first.y, second.y)

        return new Rectangle(minX, minY, maxX - minX, maxY - minY)
    }
}