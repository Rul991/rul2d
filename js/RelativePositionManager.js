import Rectangle from "./Rectangle.js"

/**
 * Manages the relative position and size of an object based on a canvas size.
 * Extends from Rectangle to provide additional functionality for positioning.
 * @extends Rectangle
 */

export default class RelativePositionManager extends Rectangle {

    /**
     * Creates an instance of RelativePositionManager.
     * 
     * @param {Rectangle} [obj=new Rectangle()] - The rectangle object to manage.
     */

    constructor(obj = new Rectangle) {
        super(0, 0, -1)
        this.setObject(obj)
        this.isInitUpdatingPosition = false
        this.initUpdatingPosition()
    }

    /**
     * Sets the rectangle object managed by this manager.
     * 
     * @param {Rectangle} [obj=new Rectangle()] - The rectangle object to manage.
     */

    setObject(obj = new Rectangle) {
        this.object = obj
    }

    /**
     * Sets the canvas element that the position manager operates on.
     * 
     * @param {HTMLCanvasElement} [canvas=new HTMLCanvasElement()] - The canvas element to use.
     */

    setCanvas(canvas = new HTMLCanvasElement) {
        this.canvas = canvas
        this.initUpdatingPosition()
    }

    /**
     * Updates the position and size of the managed object based on the canvas dimensions.
     */

    updatePosition() {
        let {width, height} = this.canvas

        this.object.setOffsetPosition(this.x * width, this.y * height)

        if(this.object.setSize && (this.width != -1 || this.height != -1)) this.object.setSize(this.width * width, this.height * height)
    }

    /**
     * Initializes position updating for the managed object.
     * Sets up an event listener for resizing the canvas.
     */

    initUpdatingPosition() {
        if(this.isInitUpdatingPosition) return
        if(!this.canvas) return

        this.isInitUpdatingPosition = true

        this.updatePosition()
        addEventListener('resize', e => this.updatePosition())
    }
}