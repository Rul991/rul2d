import CanvasImage from "./CanvasImage.js"
import Rectangle from "./Rectangle.js"

/**
 * Represents a sprite sheet image containing multiple frames.
 * Extends the CanvasImage class to provide functionality for sprite management.
 * @extends CanvasImage
 */

export default class SpriteSheet extends CanvasImage {

    /**
     * Creates an instance of SpriteSheet at the specified position and dimensions.
     * 
     * @param {number} x - The x-coordinate of the sprite sheet.
     * @param {number} y - The y-coordinate of the sprite sheet.
     * @param {number} width - The width of the sprite sheet.
     * @param {number} height - The height of the sprite sheet.
     */

    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.frames = []
        this.currentFrame = 0

        this.clearRowsAndColumns()
    }

    /**
     * Resets the number of rows and columns to zero.
     */

    clearRowsAndColumns() {
        this.rows = 0
        this.columns = 0
    }

    /**
     * Updates the size of the sprite sheet based on the current frame's size.
     */

    updateSizeByImage() {
        if(this.cuttedImage) this.cutImage(this.getCurrentFrame())
        if(this.frames.length) this.size = this.getCurrentFrame()
    }

    /**
     * Sets up the sprite sheet by specifying the number of columns and rows.
     * 
     * @param {number} [columns=1] - The number of columns in the sprite sheet.
     * @param {number} [rows=1] - The number of rows in the sprite sheet.
     */

    setSpriteSheet(columns = 1, rows = 1) {
        this.doWhenImageIsLoaded(e => {
            let rowSize = this.image.naturalHeight / rows,
            columnSize = this.image.naturalWidth / columns

            this.setSpriteSheetBySize(columnSize, rowSize)
        })
    }

    /**
     * Sets up the sprite sheet based on specified frame dimensions.
     * 
     * @param {number} [width=1] - The width of each frame in the sprite sheet.
     * @param {number} [height=1] - The height of each frame in the sprite sheet.
     */

    setSpriteSheetBySize(width = 1, height = 1) {
        this.clearRowsAndColumns()

        const setSpriteSheetBySize = e => {
           this.frames = []

            for(let y = 0; y < this.image.naturalHeight; y += height) {
                this.rows++
                for(let x = 0; x < this.image.naturalWidth; x += width) {
                    if(y == 0) this.columns++
                    this.frames.push(new Rectangle(x, y, width, height))
                }
            }
    
            this.setCurrentFrame()
            this.dispatchImageSizeUpdateEvent()
        }

        this.doWhenImageIsLoaded(setSpriteSheetBySize)
    }

    /**
     * Sets the currently active frame based on the provided ID.
     * 
     * @param {number} [id=0] - The ID of the frame to set as current.
     */

    setCurrentFrame(id = 0) {
        this.currentFrame = id >= this.frames.length ? 0 : id < 0 ? this.frames.length - 1 : id
        this.cutImage(this.getCurrentFrame())
    }

    /**
     * Retrieves the current frame being displayed.
     * 
     * @returns {Rectangle} The current frame as a Rectangle object.
     */

    getCurrentFrame() {
        return this.frames[this.currentFrame]
    }

    /**
     * Switches to the next frame in the sprite sheet.
     * If the current frame is the last, it wraps around to the first frame.
     */

    switchFrame() {
        if(this.currentFrame + 1 >= this.frames.length) this.setCurrentFrame(0)
        else this.setCurrentFrame(this.currentFrame + 1)
    }
}