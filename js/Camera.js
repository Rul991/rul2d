import { getNumberSign } from "./utils/numberWork.js"
import Point from "./Point.js"
import Rectangle from "./Rectangle.js"
import Vector2 from "./Vector2.js"
import { strokeRect } from "./utils/canvasWork.js"

export default class Camera extends Point {
    constructor(ctx) {
        super()

        this.setContext(ctx)
        this.setZoom()
        this.setSmoothing()
        this.setZoomLimit()

        this.limit = null
        this.isConsiderSize = false
        this.isLimitZoom = false
    }

    set zoom(value) {
        this._zoom = value
        this.limitZoom()
    }

    get zoom() {
        return this._zoom
    }

    setPosition(x, y) {
        super.setPosition(x, y)
        this.limitPosition()
    }

    setSmoothing(enabled = false, quality = 'low') {
        if(!this.ctx) return
        this.smoothingEnabled = enabled
        this.smoothingQuality = quality
    }

    setLimit(min = new Point, max = new Point, {isConsiderSize = this.isConsiderSize, isLimitZoom = this.isLimitZoom} = {}) {
        this.limit = {min, max}
        this.isConsiderSize = isConsiderSize
        this.isLimitZoom = isLimitZoom
    }

    limitZoom() {
        if(!this.isLimitZoom || !this.zoomLimit) return

        if(this.zoom > this.zoomLimit.max) this.zoom = this.zoomLimit.max
        else if(this.zoom < this.zoomLimit.min) this.zoom = this.zoomLimit.min
    }

    setZoomLimit(min = 0.01, max = 3) {
        this.zoomLimit = {min, max}
    }

    limitPosition() {
        if(!this.limit) return

        let {min, max} = this.limit
        let {width, height} = this.ctx.canvas

        if(this.isConsiderSize) {
            width /= this.zoom
            height /= this.zoom
        }
        else {
            width = 0
            height = 0
        }

        if(this.x + width > max.x && max !== NaN) this.x = max.x - width
        else if(this.x < min.x && min !== NaN) this.x = min.x

        if(this.y + height > max.y && max !== NaN) this.y = max.y - height
        else if(this.y < min.y && min !== NaN) this.y = min.y
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
        if(object.getBoundingBox) {
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

    update(callback = () => {}, delta) {
        if(!this.ctx) return
        this.initUpdatingCursorPosition()

        this.startRender()
        this.translate()
        this.scale()

        callback()
        this.endRender()
    }

    drawLimit(ctx, color = null) {
        if(!this.limit) return

        let {min, max} = this.limit

        ctx.lineWidth = this.lineWidth
        strokeRect(ctx, min.x, min.y, max.x - min.x, max.y - min.y, color ?? this.color)
    }
}