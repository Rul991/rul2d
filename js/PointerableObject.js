import InteractiveObject from "./InteractiveObject.js"
import Point from "./Point.js"

/**
 * Represents an object that can be interacted with using pointer events.
 * Extends from InteractiveObject to provide interactive capabilities.
 * @extends InteractiveObject
 */

export default class PointerableObject extends InteractiveObject {

    /**
     * Creates an instance of PointerableObject at specified position and dimensions.
     * 
     * @param {number} x - The x-coordinate of the object.
     * @param {number} y - The y-coordinate of the object.
     * @param {number} width - The width of the object.
     * @param {number} height - The height of the object.
     */

    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.pointerPosition = new Point()

        this.setHoverCallback()
        this.setStartCallback()
        this.setEndCallback()
    }

    /**
     * Sets the callback function to be called when the pointer hovers over the object.
     * 
     * @param {(point=new Point) => {}} [callback] - The callback function for hover events.
     */

    setHoverCallback(callback = (point = new Point) => {}) {
        this.hoverCallback = callback
    }

    /**
     * Sets the callback function to be called when the pointer starts interacting with the object.
     * 
     * @param {(point=new Point) => {}} [callback] - The callback function for start interactions.
     */

    setStartCallback(callback = (point = new Point) => {}) {
        this.startCallback = (point = new Point) => {
            if(this.isPointInRect(point)) callback(point)
        }
    }

    /**
     * Sets the callback function to be called when the pointer ends interaction with the object.
     * 
     * @param {(point=new Point) => {}} [callback] - The callback function for end interactions.
     */

    setEndCallback(callback = (point = new Point) => {}) {
        this.endCallback = (point = new Point) => {
            if(this.isPointInRect(point)) callback(point)
        }
    }

    /**
     * Resets the state of the object, including hover state.
     */

    reset() {
        super.reset()
        this.isHovered = false
    }

    /**
     * Processes interaction with the pointer, updating states and invoking callbacks.
     * 
     * @param {Point} [point] - The point representing the current pointer position.
     */

    interactive(point = new Point) {
        let updatedPoint = this.updatePointWithCamera(point)

        if(this.isPointInRect(updatedPoint)) {
            if(this.isPressed) {
                if(this._isAddInteractives) this.interactives++
                this.isInteracted = true
                this.callback(updatedPoint)
            }
            else {
                this.isHovered = true
                this.hoverCallback(updatedPoint)
            }
        }
        else this.notInteractedCallback(updatedPoint)
    }

    /**
     * Adds pointer event controls to the specified canvas.
     * 
     * @param {HTMLCanvasElement} [canvas=new HTMLCanvasElement()] - The canvas element to attach pointer controls to.
     */

    addControls(canvas = new HTMLCanvasElement) {
        const getPointerPosition = e => {
            this.lastEvent = e
            let {clientX, clientY} = e
            let pointerPosition = new Point(clientX, clientY)
            this.pointerPosition.point = pointerPosition

            return pointerPosition
        }

        const upCallback = e => {
            this.preventDefaultWhenNeed(e)
            this.lastEvent = e
            this.isPressed = false
            this.endCallback(this.pointerPosition)
        }

        canvas.addEventListener('pointerdown', e => {
            this.preventDefaultWhenNeed(e)
            let {clientX, clientY} = e
            let pointerPosition = new Point(clientX, clientY)
            this.isPressed = true

            getPointerPosition(e)
            this.startCallback(this.updatePointWithCamera(pointerPosition))
        })

        canvas.addEventListener('pointermove', e => {
            this.preventDefaultWhenNeed(e)
            getPointerPosition(e)
        })

        canvas.addEventListener('pointerup', upCallback)
        canvas.addEventListener('pointercancel', upCallback)
    }

    /**
     * Updates the pointerable object's state based on the current pointer position.
     */

    update() {
        super.update(this.pointerPosition)
    }
}