import Point from "./Point.js"
import Rectangle from "./Rectangle.js"

/**
 * Represents a camera in a 2D space.
 * Camera can zoom, smooth rendering, and limit its position within certain bounds.
 * @extends Point
 */

export default class Camera extends Point {

    /**
     * Creates an instance of Camera.
     * @param {CanvasRenderingContext2D} ctx - rendering context of the canvas.
     */
    
    constructor(ctx) {
        super()

        this.setContext(ctx)
        this.setZoom()
        this.setSmoothing()
        this.setZoomLimit()

        this.limit = null
        this.isConsiderSize = false
        this.isLimitZoom = false
        this.isInitializedUpdatingCursorPosition = false
    }

    /**
     * Sets the zoom level of the camera.
     * @param {number} value - zoom level to set.
     */

    set zoom(value) {
        this._zoom = value
        this.limitZoom()
    }

    /**
     * Gets the current zoom level of the camera.
     * @returns {number} current zoom level.
     */

    get zoom() {
        return this._zoom
    }

    /**
     * Sets the position of the camera.
     * @param {number} x - left corner's coordinate.
     * @param {number} y - top corner's coordinate.
     */

    setPosition(x, y) {
        super.setPosition(x, y)
        this.limitPosition()
    }

    /**
     * Enables or disables smoothing for rendering.
     * @param {boolean} [enabled=false] - indicates whether smoothing should be enabled.
     * @param {'low' | 'medium' | 'high'} [quality='low'] - quality of smoothing.
     */

    setSmoothing(enabled = false, quality = 'low') {
        if(!this.ctx) return
        this.smoothingEnabled = enabled
        this.smoothingQuality = quality
    }

    /**
     * Sets the limits for the camera position.
     * @param {Point} [min=new Point] - minimum position limit.
     * @param {Point} [max=new Point] - maximum position limit.
     * @param {Object} [options] - options for considering size and limiting zoom.
     * @param {boolean} [options.isConsiderSize=this.isConsiderSize] - whether to consider the size during limiting.
     * @param {boolean} [options.isLimitZoom=this.isLimitZoom] - whether to limit the zoom level.
     */

    setLimit(min = new Point, max = new Point, {isConsiderSize = this.isConsiderSize, isLimitZoom = this.isLimitZoom} = {}) {
        this.limit = {min, max}
        this.isConsiderSize = isConsiderSize
        this.isLimitZoom = isLimitZoom
    }

    /**
     * Limits the zoom level to specified constraints.
     * @protected
     */

    limitZoom() {
        if(!this.isLimitZoom || !this.zoomLimit) return

        if(this.zoom > this.zoomLimit.max) this.zoom = this.zoomLimit.max
        else if(this.zoom < this.zoomLimit.min) this.zoom = this.zoomLimit.min
    }

    /**
     * Sets the limits for zoom level.
     * @param {number} [min=0.01] - The minimum zoom level.
     * @param {number} [max=3] - The maximum zoom level.
     */

    setZoomLimit(min = 0.01, max = 3) {
        this.isLimitZoom = true
        this.zoomLimit = {min, max}
    }

    /**
     * Limits the position of the camera within defined boundaries.
     * @protected
     */

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

    /**
     * Updates the smoothing settings in the rendering context.
     * @protected
     */

    updateSmoothing() {
        this.ctx.imageSmoothingEnabled = this.smoothingEnabled
        this.ctx.imageSmoothingQuality = this.smoothingQuality
    }

    /**
     * Sets the rendering context for the camera.
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */

    setContext(ctx) {
        this.ctx = ctx ?? null
    }

    /**
     * Sets the zoom level of the camera.
     * @param {number} [zoom=1] - The zoom level to set.
     */

    setZoom(zoom = 1) {
        this.zoom = zoom
    }

    /**
     * Adds to the current zoom level.
     * @param {number} [zoom=0] - The amount to add to the current zoom level.
     */

    addZoom(zoom = 0) {
        this.setZoom(this.zoom + zoom)
    }

    /**
     * Prepares the rendering context for drawing.
     * @protected
     */

    startRender() {
        if(!this.ctx) return

        this.updateSmoothing()
        this.ctx.save()
    }

    /**
     * Restores the rendering context after drawing.
     * @protected
     */

    endRender() {
        if(!this.ctx) return

        this.ctx.restore()
    }

    /**
     * Translates the context based on the camera's position and zoom level.
     * @protected
     */

    translate() {
        if(!this.ctx) return

        let {x, y, zoom} = this
        this.ctx.translate(x * zoom, y * zoom)
    }

    /**
     * Scales the context based on the camera's zoom level.
     * @protected
     */

    scale() {
        if(!this.ctx) return

        this.ctx.scale(this.zoom, this.zoom)
    }

    /**
     * Gets the viewport rectangle of the camera considering the current position and zoom.
     * @returns {Rectangle} The rectangle representing the current viewport.
     */

    get viewport() {
        let viewport = new Rectangle()
        viewport.setPosition(-this.x, -this.y)

        if(!this.ctx) return viewport

        viewport.setSize(this.ctx.canvas.width / this.zoom, this.ctx.canvas.height / this.zoom)

        return viewport
    }

    /**
     * Checks if a given object is within the viewport of the camera.
     * @param {Point} [object=new Point()] - The object to check against the viewport.
     * @returns {boolean} True if the object is within the viewport; otherwise, false.
     */

    isObjectInViewport(object = new Point) {
        let {x, y, right, bottom} = this.viewport
        if(object.getBoundingBox || object.width) {
            let boundingBox
            if(object.getBoundingBox) boundingBox = object.getBoundingBox()
            else {
                boundingBox = new Rectangle()
                boundingBox.rotatedRect = object
            }
            return boundingBox.right > x && boundingBox.x < right && boundingBox.bottom > y && boundingBox.y < bottom
        }
        else if(object.x !== undefined) return this.viewport.isPointInRect(object)
        
        return false
    }

    /**
     * Initializes the updating of the cursor position by adding necessary event listeners.
     * @protected
     */

    initUpdatingCursorPosition() {
        if(this.isInitializedUpdatingCursorPosition) return
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

        this.isInitializedUpdatingCursorPosition = true
    }

    /**
     * Gets the cursor position relative to the canvas.
     * @returns {Point} The cursor position on the canvas.
     */

    getPointOnCanvas() {
        if(!this.cursorPosition) return new Point(null)
        let {x, y} = this.cursorPosition

        let rect = {left: 0, top: 0}
        if(this.ctx) rect = this.ctx.canvas.getBoundingClientRect()

        let {left, top} = rect

        return new Point(x - left, y - top)
    }

    /**
     * Gets the cursor position adjusted by the camera's position and zoom level.
     * @returns {Point} The adjusted cursor position in the camera's coordinate system.
     */

    getCursorPosition() {
        if(!this.cursorPosition) return new Point(null)
        let cursorPointOnCanvas = this.getPointOnCanvas()

        if(!cursorPointOnCanvas) return new Point(null)
        let {x, y} = cursorPointOnCanvas

        const getUpdatedCoordinate = (cursorPosition, cameraPosition) => cursorPosition / this.zoom - cameraPosition
        
        return new Point(getUpdatedCoordinate(x, this.x), getUpdatedCoordinate(y, this.y))
    }

    /**
     * Executes a callback for an object if it is within the camera's viewport.
     * @param {Point} [object=new Point()] - The object to check for viewport inclusion.
     * @param {function(object: Point):void} [callback=(object=new Point) => {}] - The callback to execute if the object is in the viewport.
     */

    culling(object = new Point, callback = (object = new Point) => {}) {
        if(this.isObjectInViewport(object)) callback(object)
    }

    /**
     * Updates the camera state, rendering context, and invokes a provided callback.
     * @param {callback=() => {}} [callback=() => {}] - A callback function to be executed during the update.
     * @param {number} [delta] - The time delta for the update (optional).
     */

    update(callback = () => {}, delta) {
        if(!this.ctx) return
        this.initUpdatingCursorPosition()

        this.startRender()
        this.translate()
        this.scale()

        callback()
        this.endRender()
    }
}