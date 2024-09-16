import { getContext2d } from "./canvasWork.js"
import Point from "./Point.js"

export default class Camera extends Point {
    constructor(ctx) {
        super()
        this.setContext(ctx)
        this.setScale()
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

    setScale(scale = 1) {
        this.cameraScale = scale
    }

    addScale(scale = 0) {
        this.setScale(this.cameraScale + scale)
    }
    
    setPosition(x, y) {
        super.setPosition(-x, -y)
    }

    addPosition({x, y}) {
        this.setPosition(this.x - x, this.y - y)
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

        let {x, y, cameraScale} = this
        this.ctx.translate(x * cameraScale, y * cameraScale)
    }

    scale() {
        if(!this.ctx) return

        this.ctx.scale(this.cameraScale, this.cameraScale)
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