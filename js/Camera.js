import { getNumberSign } from "./utils/numberWork.js"
import Point from "./Point.js"
import Rectangle from "./Rectangle.js"
import Vector2 from "./Vector2.js"

export default class Camera extends Point {
    constructor(ctx) {
        super()
        this.setContext(ctx)
        this.setZoom()
        this.setSmoothing()
        this.limit = null
    }

    setPosition(x, y) {
        super.setPosition(x, y)
        this.updateLimit()
    }

    setSmoothing(enabled = false, quality = 'low') {
        if(!this.ctx) return
        this.smoothingEnabled = enabled
        this.smoothingQuality = quality
    }

    setLimit(min = new Point, max = new Point) {
        this.limit = {min, max}
    }

    updateLimit() {
        if(!this.limit) return

        let {min, max} = this.limit

        if(this.x > max.x) this.x = max.x
        else if(this.x < min.x) this.x = min.x

        if(this.y > max.y) this.y = max.y
        else if(this.y < min.y) this.y = min.y
    }

    updateSmoothing() {
        this.ctx.imageSmoothingEnabled = this.smoothingEnabled
        this.ctx.imageSmoothingQuality = this.smoothingQuality
    }

    setContext(ctx) {
        this.ctx = ctx ?? null
    }

    setZoom(zoom = 1) {
        this.zoom = zoom
    }

    addZoom(zoom = 0) {
        this.setZoom(this.zoom + zoom)
    }

    startRender() {
        if(!this.ctx) return

        this.updateSmoothing()
        this.ctx.save()
    }

    endRender() {
        if(!this.ctx) return

        this.ctx.restore()
    }

    translate() {
        if(!this.ctx) return

        let {x, y, zoom} = this
        this.ctx.translate(x * zoom, y * zoom)
    }

    scale() {
        if(!this.ctx) return

        this.ctx.scale(this.zoom, this.zoom)
    }

    get viewport() {
        let viewport = new Rectangle()
        viewport.setPosition(-this.x, -this.y)

        if(!this.ctx) return viewport

        viewport.setSize(this.ctx.canvas.width / this.zoom, this.ctx.canvas.height / this.zoom)

        return viewport
    }

    isObjectInViewport(object = new Point) {
        let {x, y, right, bottom} = this.viewport
        if(object.width) {
            let boundingBox = object.getBoundingBox() 
            return boundingBox.right > x && boundingBox.x < right && boundingBox.bottom > y && boundingBox.y < bottom
        }
        else if(object.x !== undefined) return this.viewport.isPointInRect(object)
        
        return false
    }

    initUpdatingCursorPosition() {
        if(this.isInitUpdatingCursorPosition) return
        if(!this.ctx) return

        let canvas = this.ctx.canvas

        const updateCursorPosition = e => {
            if(!e.touches) this.cursorPosition = new Point(e.clientX, e.clientY)
            else {
                let {clientX, clientY} = e.touches[0]

                this.cursorPosition = new Point(clientX, clientY)
            }
        }

        canvas.addEventListener('mousedown', e => updateCursorPosition(e))
        canvas.addEventListener('mousemove', e => updateCursorPosition(e))

        canvas.addEventListener('touchstart', e => updateCursorPosition(e))
        canvas.addEventListener('touchmove', e => updateCursorPosition(e))

        this.isInitUpdatingCursorPosition = true
    }

    getPointOnCanvas() {
        if(!this.cursorPosition) return new Point(null)
        let {x, y} = this.cursorPosition

        let rect = {left: 0, top: 0}
        if(this.ctx) rect = this.ctx.canvas.getBoundingClientRect()

        let {left, top} = rect

        return new Point(x - left, y - top)
    }

    getCursorPosition() {
        if(!this.cursorPosition) return new Point(null)
        let cursorPointOnCanvas = this.getPointOnCanvas()

        if(!cursorPointOnCanvas) return new Point(null)
        let {x, y} = cursorPointOnCanvas

        const getUpdatedCoordinate = (cursorPosition, cameraPosition) => cursorPosition / this.zoom - cameraPosition
        
        return new Point(getUpdatedCoordinate(x, this.x), getUpdatedCoordinate(y, this.y))
    }

    culling(object = new Point, callback = (object = new Point) => {}) {
        if(this.isObjectInViewport(object)) callback(object)
    }

    update(callback = () => {}) {
        if(!this.ctx) return
        this.initUpdatingCursorPosition()

        this.startRender()
        this.translate()
        this.scale()

        callback()
        this.endRender()
    }
}