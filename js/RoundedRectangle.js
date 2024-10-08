import CanvasShape from "./CanvasShape.js"
import { deg2rad, rad2deg, randomRange } from "./numberWork.js"
import Point from "./Point.js"
import Rectangle from "./Rectangle.js"

export default class RoundedRectangle extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.setRadius(10)
    }

    setRadius(...radiuses) {
        this.radius = radiuses
        while(this.radius.length > 4) this.radius.pop()
    }

    _drawRoundedRect(ctx = new CanvasRenderingContext2D, color = 'green', type = 'fill') {
        this.drawRotated(ctx, (x, y, width, height) => {
            ctx.beginPath()
            ctx[`${type}Style`] = color
            ctx.roundRect(x, y, width, height, this.radius)
            ctx[type]()
            ctx.closePath()
        })
    }

    fill(ctx = new CanvasRenderingContext2D, color = 'green') {
        this._drawRoundedRect(ctx, color, 'fill')
    }

    draw(ctx = new CanvasRenderingContext2D, color = 'green') {
        this.fill(ctx, color)
    }

    stroke(ctx = new CanvasRenderingContext2D, color = 'green') {
        this._drawRoundedRect(ctx, color, 'stroke')
    }
}