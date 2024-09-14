import CanvasImage from "./CanvasImage.js"
import Rectangle from "./Rectangle.js"

export default class SpriteSheet extends CanvasImage {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.frames = []
        this.currentFrame = 0
    }

    updateSizeByImage() {
        if(this.cuttedImage) this.cutImage(this.getCurrentFrame())
        if(this.frames.length) this.size = this.getCurrentFrame()
    }

    setSpriteSheet(rows = 1, columns = 1) {
        const setSpriteSheet = () => {
            this.frames = []

            let rowSize = this.image.naturalHeight / rows,
                columnSize = this.image.naturalWidth / columns

            for(let y = 0; y < rows; y++) {
                for(let x = 0; x < columns; x++) {
                    this.frames.push(new Rectangle(x * columnSize, y * rowSize, columnSize, rowSize))
                }
            }

            this.setCurrentFrame()
            this.dispatchImageSizeUpdateEvent()
        }

        if(!this.isImageLoaded) this.image.addEventListener('load', setSpriteSheet)
        else setSpriteSheet()
    }

    setCurrentFrame(id = 0) {
        this.currentFrame = id
        this.cutImage(this.getCurrentFrame())
    }

    getCurrentFrame() {
        return this.frames[this.currentFrame]
    }

    switchFrame() {
        if(this.currentFrame + 1 >= this.frames.length) this.setCurrentFrame(0)
        else this.setCurrentFrame(this.currentFrame + 1)
    }
}