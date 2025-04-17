import IAngle from '../interfaces/IAngle'
import IRectangle from '../interfaces/IRectangle'
import ISimpleDrawableObject from "../interfaces/ISimpleDrawableObject"
import ISimplePoint from "../interfaces/ISimplePoint"
import ISimpleRect from "../interfaces/ISimpleRect"
import ISimpleShape from '../interfaces/ISimpleShape'
import ISimpleSize from "../interfaces/ISimpleSize"
import MathUtils from "../utils/MathUtils"
import Sorting from "../utils/Sorting"
import { Context } from "../utils/types"
import Point from "./Point"
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
        let cos = Math.cos(+this._angle)
        let sin = Math.sin(+this._angle)
        let center = this.center

        let {width, height} = this.size.simplify()

        return [
            new Point(
                (-width / 2) * cos - (height / 2) * sin + center.x,
                (-width / 2) * sin + (height / 2) * cos + center.y
            ),

            new Point(
                (width / 2) * cos - (height / 2) * sin + center.x,
                (width / 2) * sin + (height / 2) * cos + center.y
            ),
            new Point(
                (width / 2) * cos - (-height / 2) * sin + center.x,
                (width / 2) * sin + (-height / 2) * cos + center.y
            ),
            new Point(
                (-width / 2) * cos - (-height / 2) * sin + center.x,
                (-width / 2) * sin + (-height / 2) * cos + center.y
            )
        ]
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