import { getNumberSign } from "./numberWork.js"
import Point from "./Point.js"

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

    setLimit(x, y) {
        this.limit = new Point(x, y)
    }

    updateLimit() {
        if(!this.limit) return

        if(Math.abs(this.x) > this.limit.x) this.x = this.limit.x * getNumberSign(this.x)
        if(Math.abs(this.y) > this.limit.y) this.y = this.limit.y * getNumberSign(this.y)
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