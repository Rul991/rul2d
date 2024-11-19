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
        this.setCallback()
        this.doIfNotInteracted()

        this._isAddInteractives = true
    }

    setCamera(camera = new Camera()) {
        this.camera = camera
    }

    getPointOnCanvas({x, y}) {
        if(this.camera) return this.camera.getPointOnCanvas()

        return new Point(x, y)
    }

    isRenderingFromCameraView(value = true) {
        this.isRenderedFromCameraView = value
    }

    isPointInRect(point = new Point) {
        if(!point) return false
        let newPoint = new Point()
        
        if(this.radians) {
            let sin = Math.sin(-this.radians)
            let cos = Math.cos(-this.radians)
            let center = this.center

            newPoint = new Point(point.x - center.x, point.y - center.y)
            newPoint = new Point(newPoint.x * cos - newPoint.y * sin, newPoint.x * sin + newPoint.y * cos)
            newPoint = new Point(newPoint.x + center.x, newPoint.y + center.y)
        }
        else newPoint.point = point
        
        return newPoint.x >= this.x && newPoint.x <= this.right && newPoint.y >= this.y && newPoint.y <= this.bottom
    }

    updatePointWithCamera({x, y}) {
        let point = this.getPointOnCanvas({x, y})
        if(!this.camera) return point
        if(!this.isRenderedFromCameraView) return point
        else {
            return this.camera.getCursorPosition()
        }
    }

    reset() {
        this.isInteracted = false
    }

    setCallback(callback = (point = new Point) => {}) {
        this.callback = callback
    }

    doIfNotInteracted(callback = (point = new Point) => {}) {
        this.notInteractedCallback = callback
    }

    interactive(point = new Point) {
        let updatedPoint = this.updatePointWithCamera(point)
        if(this.isPointInRect(updatedPoint)) {
            if(this._isAddInteractives) this.interactives++
            this.isInteracted = true
            this.callback(updatedPoint)
        }
        else this.notInteractedCallback(updatedPoint)
    }

    drawOutline(ctx, color = null) {
        if(this.isInteracted) super.drawOutline(ctx, 'red')
        else super.drawOutline(ctx, color)
    }

    addControls(canvas) {
        return false
    }

    init(canvas, camera) {
        this.addControls(canvas)
        this.setCamera(camera)
    }

    update(point) {
        this.reset()
        this.interactive(point)
    }
}