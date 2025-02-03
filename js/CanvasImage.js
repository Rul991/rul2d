import { drawImage } from "./utils/canvasWork.js"
import Rectangle from "./Rectangle.js"

/**
 * Represents an image that can be rendered within a rectangular area on a canvas.
 * The image can also handle loading events and resizing based on the loaded image dimensions.
 * @extends Rectangle
 */

export default class CanvasImage extends Rectangle {

    /**
     * Creates an instance of CanvasImage positioned at (x, y) with specified width and height.
     * 
     * @param {number} x - The x-coordinate of the top-left corner of the image.
     * @param {number} y - The y-coordinate of the top-left corner of the image.
     * @param {number} width - The width of the image.
     * @param {number} height - The height of the image.
     */

    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.image = new Image
    }

    /**
     * Dispatches an event to indicate that the image size has been updated.
     */

    dispatchImageSizeUpdateEvent() {
        if(this.isUpdateSizeByImage) {
            let event = new CustomEvent('image-size-update', {detail: {element: this}, bubbles: true})
            this.image.dispatchEvent(event)
        }
    }

    /**
     * Dispatches an event to indicate that the image has been loaded.
     */

    dispatchImageLoadEvent() {
        let event = new Event('image-load')
        this.image.dispatchEvent(event)
    }

    /**
     * Executes a callback when the image has been loaded.
     * 
     * @param {function(Event):void} [callback=event => {}] - The callback to execute when the image is loaded.
     * @param {boolean} [once=false] - If true, the event listener will be removed after the first invocation.
     */

    doWhenImageIsLoaded(callback = event => {}, once = false) {
        const doWhenIsLoaded = e => {
            callback(e)
            if(once) this.image.removeEventListener('image-load', doWhenIsLoaded)
        }

        if(!this.isImageLoaded) this.image.addEventListener('image-load', doWhenIsLoaded)
        else callback()
    }

    /**
     * Sets the image source and handles the loading event.
     * 
     * @param {string} [src=''] - The source URL of the image.
     */

    setImage(src = '') {
        this.isImageLoaded = false
        this.image.addEventListener('load', e => {
            this.isImageLoaded = true
            this.dispatchImageSizeUpdateEvent()
            this.dispatchImageLoadEvent()
        })
        this.image.src = src
    }

    /**
     * Sets the area of the image to be cut.
     * 
     * @param {Rectangle} [rect=this.size] - The rectangle area to cut from the image.
     */

    cutImage(rect = this.size) {
        this.cuttedImage = rect
    }

    /**
     * Updates the dimensions of the image based on its natural size.
     */

    updateSizeByImage() {
        [this.width, this.height] = [this.image.naturalWidth, this.image.naturalHeight]
        if(this.cuttedImage) this.cutImage()
    }

    /**
     * Enables automatic resizing of the rectangle based on the loaded image size.
     */

    setSizeByImage() {
        this.isUpdateSizeByImage = true
        this.image.addEventListener('image-size-update', ({detail}) => {
            if(!this.isUpdateSizeByImage) return
            if(detail.element === this) this.updateSizeByImage()
        })
    }

    /**
     * Sets the size of the rectangle manually, disabling size updates from the image.
     * @param {number} width - The new width of the rectangle.
     * @param {number} height - The new height of the rectangle.
     */

    setSize(width, height) {
        this.isUpdateSizeByImage = false
        super.setSize(width, height)
    }

    /**
     * Draws the image on the canvas.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @protected
     */

    _draw(ctx) {
        if(!this.isImageLoaded) return
        if(!this.isNeedDraw()) return
        
        this.drawRotated(ctx, (x, y, width, height) => {
            drawImage(ctx, this.image, {x, y, width, height}, this.cuttedImage)
        })
    }
}