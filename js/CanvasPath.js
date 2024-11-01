import Point from "./Point.js"
import Rectangle from "./Rectangle.js"
import { fillPath, strokePath } from "./utils/canvasWork.js"

export default class CanvasPath extends Rectangle {
    constructor(x, y) {
        super(x, y, 1, 1)
        this.points = new Set()
    }

    removeAllPoints() {
        this.points = new Set()
    }

    removePoint(point = new Point) {
        this.points.delete(point)
    }

    addPoint(point = new Point) {
        point.offset = new Point()
        point.offset.point = point
        this.points.add(point)
        this.updatePosition()
    }

    removePoints(...points) {
        points.forEach(point => this.removePoint(point))
    }

    addPoints(...points) {
        points.forEach(point => this.addPoint(point))
    }

    updatePosition() {
        if(!this.points) return
        if(!this.points.size) return

        let right = this.x
        let bottom = this.y

        this.points.forEach(point => {
            point.setPosition(this.x + point.offset.x, this.y + point.offset.y)
            if(point.x > right) right = point.x
            if(point.y > bottom) bottom = point.y
        })

        this.setSize(right - this.x, bottom - this.y)
    }

    set point(value) {
        super.point = value
        this.updatePosition()
    }
    
    get point() {
        return super.point
    }

    drawLine(ctx, color = null, type = 'stroke') {
        this.drawRotated(ctx, () => {
            if(!this.points) return
            if(!this.points.size) return
        
            ctx[`${type}Style`] = color
            ctx.beginPath()

            for (const point of this.points) 
                ctx.lineTo(point.x - this.center.x, point.y - this.center.y)

            ctx[type]()
            ctx.closePath()
        })
    }

    fill(ctx, color = null) {
        this.drawLine(ctx, color, 'fill')
    }

    stroke(ctx, color = null) {
        this.drawLine(ctx, color, 'stroke')
    }

    draw(ctx, color = null) {
        this.stroke(ctx, color ?? this.color)
    }
}