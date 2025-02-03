import Color from "./Color.js"

/**
 * Based class for drawable objects
 */

export default class DrawableObject {
    constructor() {
        this.lineWidth = 3
        this.opacity = 1
        this.root = null
        this.isInViewport = true
        this.isRenderedFromCameraView = true
        this.isInitialized = false
        this.offset = null
        this.isNeedCulling = true

        this.setVisibity()
        this.setColor()
    }

    /**
     * Returns is object is visible and is in viewport
     * @returns {boolean}
     */

    isNeedDraw() {
        return !this.isNeedCulling || (this.isVisible && this.isInViewport)
    }

    /**
     * Set color
     * 
     * if color equal null, object's color is green
     * @param {Color | null} color - color
     */

    setColor(color = null) {
        this.color = color ?? Color.Green
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
     * @param {number} delta - delta time
     */

    update(delta) {
        return
    }

    /**
     * Gets the inherited opacity of the current object.
     * The inherited opacity is calculated by multiplying the object's own opacity
     * with the opacity of its root object. If the object does not have a root,
     * it defaults to full opacity (1).
     * 
     * @returns {number} The calculated inherited opacity of the object, ranging from 0 (fully transparent)
     *                   to 1 (fully opaque).
     */

    get inheritOpacity() {
        let rootOpacity

        if(!this.root) rootOpacity = 1
        else rootOpacity = this.root.inheritOpacity

        return this.opacity * rootOpacity
    }

    /**
     * Change global alpha and do something
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {() => {}} callback - funciton, what happened when alpha changed
     */
    doWithOpacity(ctx, callback = () => {}) {
        let initAlpha = ctx.globalAlpha
        let opacity = this.inheritOpacity * initAlpha

        ctx.globalAlpha = opacity
        callback()
        ctx.globalAlpha = initAlpha
    }

    /**
     * Draw object on canvas without opacity, lineWidth and color support
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     */

    _draw(ctx) {
        return
    }

    /**
     * Draw object on canvas
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {Color} [color] - drawed color or null
     */

    draw(ctx, color = null) {
        if(!this.isNeedDraw()) return

        this.updateContextParameters(ctx, color)
        this.doWithOpacity(ctx, () => this._draw(ctx))
    }

    /**
     * Update lineWidth, fillStyle and strokeStyle
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {Color} color - color or null
     */
    updateContextParameters(ctx, color = null) {
        let usedColor = color ?? this.color
        let stringColor = usedColor.toString()

        ctx.lineWidth = this.lineWidth
        ctx.fillStyle = stringColor
        ctx.strokeStyle = stringColor

        return stringColor
    }

    /**
     * Return only need parameters
     * @returns {object}
     */
    simplify() {
        return {}
    }

    /**
     * Return value that will be used during conversion to JSON
     * @returns {this}
     */

    toJSON() {
        return this
    }

    /**
     * Set visibility
     * @param {boolean} isVisible - if true, object draw
     */

    setVisibity(isVisible = true) {
        this.isVisible = isVisible
    }
}