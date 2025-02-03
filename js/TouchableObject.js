import InteractiveObject from "./InteractiveObject.js"

/**
 * Represents an interactive object that responds to touch events.
 * Extends the InteractiveObject class to handle touch input.
 * @extends InteractiveObject
 */

export default class TouchableObject extends InteractiveObject {

    /**
     * Creates an instance of TouchableObject at the specified position and dimensions.
     * 
     * @param {number} x - The x-coordinate of the touchable object.
     * @param {number} y - The y-coordinate of the touchable object.
     * @param {number} width - The width of the touchable object.
     * @param {number} height - The height of the touchable object.
     */

    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.previousTouches = []
    }

    /**
     * Resets the state of the touchable object, including touch points.
     */

    reset() {
        super.reset()
        this.touches = []
    }

    /**
     * Retrieves the previous touch points stored before the current update.
     * 
     * @returns {{x: number, y: number}[]} An array of previous touch points.
     */

    getPreviousTouches() {
        this.previousTouches = []
        this.touches.forEach(touch => {
            this.previousTouches.push(touch)
        })

        return this.previousTouches
    }

    /**
     * Collects all current touch points from the given TouchEvent.
     * 
     * @param {TouchEvent} [{touches}] - The touch event containing touch points.
     * @returns {{x: number, y: number}[]} An array of current touch points.
     */

    getAllTouches({touches} = new TouchEvent) {
        this.getPreviousTouches()
        this.reset()

        for (const {clientX: x, clientY: y} of touches) {
            this.touches.push({x, y})
        }

        return this.touches
    }

    /**
     * Updates the interactive states of the object based on current touch points.
     */

    interactive() {
        this.interactives = 0

        this.touches.forEach(point => {
            super.interactive(point)
        })
    }

    /**
     * Updates the touchable object, handling interactions based on current touch points.
     */

    update() {
        this.interactive()
    }

    /**
     * Adds touch event listeners to the specified canvas element to handle touch input.
     * 
     * @param {HTMLCanvasElement} [canvas=new HTMLCanvasElement()] - The canvas element to attach listeners to.
     * @returns {boolean} Always returns true.
     */

    addControls(canvas = new HTMLCanvasElement) {
        const updateTouches = e => {
            this.preventDefaultWhenNeed(e)
            this.lastEvent = e
            this.getAllTouches(e)
        }

        canvas.addEventListener('touchstart', updateTouches)
        canvas.addEventListener('touchmove', updateTouches)
        canvas.addEventListener('touchend', updateTouches)
        canvas.addEventListener('touchcancel', updateTouches)

        return true
    }
}