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

    isRenderingFromCameraView(value = true) {
        this.isRenderedFromCameraView = value
    }
    
    getCanvasFromCamera() {
        if(this.camera) if(this.camera.ctx) 
                return this.camera.ctx.canvas

        return null
    }

    getPointOnCanvas({x, y}) {
        let rect = {left: 0, top: 0}

        let canvas = this.getCanvasFromCamera()
        if(canvas) rect = canvas.getBoundingClientRect()

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
            const getUpdatedCoordinate = (position, cameraPosition) => position / this.camera.zoom - cameraPosition
            
            return new Point(getUpdatedCoordinate(x, this.camera.x), getUpdatedCoordinate(y, this.camera.y))
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