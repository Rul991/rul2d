import { Point } from "./Point.js"

export class Camera extends Point {
    constructor(ctx) {
        super()
        this.setContext(ctx)
        this.setScale()
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

    startRender() {
        if(!this.ctx) return

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