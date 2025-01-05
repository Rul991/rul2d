/**
 * Based class
 */

export default class DrawableObject {
    constructor() {
        this.lineWidth = 3
        this.opacity = 1
        this.isInViewport = true
        this.isRenderedFromCameraView = true
        this.isInitialized = false
        this.offset = null

        this.setVisibity()
        this.setColor()
    }

    /**
     * Returns is object is visible and is in viewport
     * @returns {boolean}
     */

    isNeedDraw() {
        return this.isVisible && this.isInViewport
    }

    /**
     * Set color
     * 
     * if color equal null, object will use *this.color* like color
     * @param {string|null} color - hex/rgb/rgba/hsl/hsla string
     */

    setColor(color = null) {
        this.color = color ?? 'green'
    }

    /**
     * Init objects properties
     * @param {HTMLCanvasElement} canvas 
     * @param {Camera} camera 
     * @param {GameWorld} world 
     */

    init(canvas, camera, world) {
        this.canvas = canvas
        this.camera = camera
        this.world = world
        this.isInitialized = true
    }

    /**
     * Update object state
     * @param {number} delta
     */

    update(delta) {
        return
    }

    /**
     * Draw object on canvas
     * @param {CanvasRenderingContext2D} ctx
     */

    draw(ctx) {
        return
    }

    /**
     * Return JSON string of object
     * @returns {string}
     */

    toJSON() {
        return JSON.stringify(this)
    }

    /**
     * Set visibility
     * @param {boolean} isVisible 
     */

    setVisibity(isVisible = true) {
        this.isVisible = isVisible
    }
}