import { getContext2d } from "./canvasWork.js"
import Point from "./Point.js"

export default class Camera extends Point {
    constructor(ctx) {
        super()
        this.setContext(ctx)
        this.setZoom()
        this.setSmoothing()
    }

    setSmoothing(enabled = false, quality = 'low') {
        if(!this.ctx) return
        this.smoothingEnabled = enabled
        this.smoothingQuality = quality
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

    update(callback = () => {}) {
        if(!this.ctx) return

        this.startRender()
        this.translate()
        this.scale()

        callback()
        this.endRender()
    }
}