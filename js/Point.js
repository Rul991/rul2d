import { fillArc } from "./canvasWork.js"

export default class Point {
    constructor(x,y) {
        this.setPosition(x,y)
        this.isVisible = true
    }

    setVisibity(isVisible = true) {
        this.isVisible = isVisible
    }

    set point({x,y}) {
        this.x = x ?? 0
        this.y = y ?? this.x
    }

    get point() {
        return {x: this.x, y: this.y}
    }

    setPosition(x, y) {
        this.point = {x,y}
    }

    addPosition({x, y}) {
        this.setPosition(this.x + x, this.y + y)
    }

    drawPoint(ctx, color = 'red') {
        fillArc(ctx, this.x, this.y, 1, color)
    }

    draw(ctx, color = 'red') {
        if(!this.isVisible) return
        this.drawPoint(ctx, color)
    }

    addEventListener(type = '', callback = e => {}) {
        window.addEventListener(type, callback)
    }

    dispatchEvent(event) {
        if(!event.detail) event.detail = {}
        if(!event.detail.object) event.detail.object = this
        
        window.dispatchEvent(event)
    }

    move({x, y}, delta = 1/60) {
        this.addPosition(new Point(x * delta, y * delta))
    }
}