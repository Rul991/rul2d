import Point from "./Point.js"
import Rectangle from "./Rectangle.js"
import Camera from "./Camera.js"

export default class InteractiveObject extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.reset()
        this.setCamera()
        this.isReset = true
        this.isRenderingFromCameraView()
    }

    setCamera(camera = new Camera()) {
        this.camera = camera
    }

    getPointOnCanvas({x, y}) {
        let rect = {left: 0, top: 0}
        if(this.camera)
            if(this.camera.ctx) 
                rect = this.camera.ctx.canvas.getBoundingClientRect()

        let {left, top} = rect

        return new Point(x - left, y - top)
    }

    isRenderingFromCameraView(value = true) {
        this.isRenderedFromCameraView = value
    }

    updatePointWithCamera({x, y}) {
        let point = this.getPointOnCanvas({x, y})
        if(!this.camera) return point
        if(!this.isRenderedFromCameraView) return point
        else {
            let {x, y} = point
            console.log(x, y)
            const getUpdatedCoordinate = (position, cameraPosition) => position / this.camera.cameraScale - cameraPosition
            return new Point(getUpdatedCoordinate(x, this.camera.x), getUpdatedCoordinate(y, this.camera.y))
        }
    }

    reset() {
        this.isInteracted = false
        this.interactives = 0
    }

    isPointInRect({x, y}) {
        if(x > this.right || x < this.x) return false
        if(y > this.bottom || y < this.y) return false

        return true
    }

    setCallback(callback = point => {}) {
        this.callback = callback
    }

    interactive(point = new Point) {
        let updatedPoint = this.updatePointWithCamera(point)
        if(this.isPointInRect(updatedPoint)) {
            this.interactives++
            this.isInteracted = true
            this.callback(updatedPoint)
        }
    }

    drawOutline(ctx, color) {
        if(this.isInteracted) super.drawOutline(ctx, 'red')
        else super.drawOutline(ctx, color)
    }

    addControls(canvas) {
        return false
    }

    update(point) {
        this.reset()
        this.interactive(point)
    }
}