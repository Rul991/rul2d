import Point from "./Point.js"
import Rectangle from "./Rectangle.js"
import Camera from "./Camera.js"
import GameWorld from "./GameWorld.js"

/**
 * Represents an interactive game object that responds to user input.
 * Inherits from the Rectangle class and adds functionality for handling interactions.
 * @extends Rectangle
 */

export default class InteractiveObject extends Rectangle {

    /**
     * Creates an instance of InteractiveObject at the specified position and size.
     * 
     * @param {number} x - The x-coordinate of the object.
     * @param {number} y - The y-coordinate of the object.
     * @param {number} width - The width of the object.
     * @param {number} height - The height of the object.
     */

    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.reset()
        this.setCamera()
        this.isReset = true
        this.isRenderingFromCameraView()
        this.setCallback()
        this.doIfNotInteracted()

        this.lastEvent = null
        this._isAddInteractives = true
        this.isPreventDefault = false
    }

    /**
     * Prevents the default behavior of an event if the flag is set.
     * 
     * @param {Event} [e] - The event to prevent default behavior on.
     */

    preventDefaultWhenNeed(e = new Event) {
        if(this.isPreventDefault) e.preventDefault()
    }

    /**
     * Sets the camera for the interactive object.
     * 
     * @param {Camera} [camera] - The camera to associate with this interactive object.
     */

    setCamera(camera = new Camera()) {
        this.camera = camera
    }

    /**
     * Sets whether the interactive object is rendered from the camera's view.
     * 
     * @param {boolean} [value] - True if the object should render from camera view, false otherwise.
     */

    isRenderingFromCameraView(value = true) {
        this.isRenderedFromCameraView = value
    }
    
    /**
     * Retrieves the canvas element associated with the camera.
     * 
     * @returns {HTMLCanvasElement|null} The canvas element or null if no camera is set.
     */

    getCanvasFromCamera() {
        if(this.camera) if(this.camera.ctx) 
                return this.camera.ctx.canvas

        return null
    }

    /**
    * Gets the canvas coordinates for a given point.
    * 
    * @param {Object} point - The point indicating the coordinates to convert.
    * @param {number} point.x - The x-coordinate of the point.
    * @param {number} point.y - The y-coordinate of the point.
    * @returns {Point} The adjusted point in canvas coordinates.
    */

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

    /**
     * Updates the point considering the camera's position and zoom level.
     * 
     * @param {Point} point - The point containing coordinates to update.
     * @param {number} point.x - The original x-coordinate.
     * @param {number} point.y - The original y-coordinate.
     * @returns {Point} The updated point adjusted for camera transformations.
     */

    updatePointWithCamera({x, y}) {
        let point = this.getPointOnCanvas({x, y})
        if(!this.isRenderedFromCameraView) return point
        if(!this.camera) return point
        else {
            let {x, y} = point
            const getUpdatedCoordinate = (position, cameraPosition) => position / this.camera.zoom - cameraPosition
            
            return new Point(getUpdatedCoordinate(x, this.camera.x), getUpdatedCoordinate(y, this.camera.y))
        }
    }

    /**
     * Resets the interaction state of the object.
     */

    reset() {
        this.isInteracted = false
    }

    /**
     * Sets the callback function to invoke when the interactive object is interacted with.
     * 
     * @param {(point = new Point) => {}} [callback=(point=new Point)=>{}] - The callback function to execute on interaction.
     */

    setCallback(callback = (point = new Point) => {}) {
        this.callback = callback
    }

    /**
     * Sets the callback function to invoke when the object is not interacted with.
     * 
     * @param {(point=new Point)=>{}} [callback=(point=new Point)=>{}] - The callback function to execute when not interacted.
     */

    doIfNotInteracted(callback = (point = new Point) => {}) {
        this.notInteractedCallback = callback
    }

    /**
     * Handles interaction with the interactive object at the given point.
     * 
     * @param {Point} [point] - The point of interaction.
     */

    interactive(point = new Point) {
        let updatedPoint = this.updatePointWithCamera(point)
        if(this.isPointInRect(updatedPoint)) {
            if(this._isAddInteractives) this.interactives++
            this.isInteracted = true
            this.callback(updatedPoint)
        }
        else this.notInteractedCallback(updatedPoint)
    }

    /**
     * Draws the outline of the object on the canvas, changing color if interacted with.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
     * @param {string|null} [color] - The color for the outline. Defaults to null.
     */

    drawOutline(ctx, color = null) {
        if(this.isInteracted) super.drawOutline(ctx, 'red')
        else super.drawOutline(ctx, color)
    }

    /**
     * Adds controls for the interactive object.
     * 
     * @param {HTMLCanvasElement} canvas - The canvas element for adding controls.
     * @returns {boolean} Indicates success or failure of adding controls.
     */

    addControls(canvas) {
        return false
    }

    /**
     * Initializes the interactive object with the canvas, camera, and world references.
     * 
     * @param {HTMLCanvasElement} canvas - The main canvas for rendering.
     * @param {Camera} camera - The camera to use for the interactive object.
     * @param {GameWorld} world - The game world reference, if applicable.
     */

    init(canvas, camera, world) {
        super.init(canvas, camera, world)
        this.addControls(canvas)
        this.setCamera(camera)
    }

    /**
     * Updates the interactive object's state based on the given point.
     * 
     * @param {Point} point - The point of interaction.
     */

    update(point) {
        this.reset()
        this.interactive(point)
    }
}