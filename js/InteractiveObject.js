import { Point } from "./Point.js"
import { Rectangle } from "./Rectangle.js"
import { Camera } from "./Camera.js"

export class InteractiveObject extends Rectangle {
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

    isRenderingFromCameraView(value = true) {
        this.isRenderedFromCameraView = value
    }

    updatePointWithCamera(point) {
        if(!this.camera) return point
        if(!this.isRenderedFromCameraView) return point
        else {
            let {x, y} = point
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
            this.callback(updatedPoint)
            this.interactives++
            this.isInteracted = true
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