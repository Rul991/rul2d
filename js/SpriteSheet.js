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

    setSpriteSheet(columns = 1, rows = 1) {
        this.doWhenImageIsLoaded(e => {
            let rowSize = this.image.naturalHeight / rows,
            columnSize = this.image.naturalWidth / columns

            this.setSpriteSheetBySize(columnSize, rowSize)
        })
    }

    setSpriteSheetBySize(width = 1, height = 1) {
        const setSpriteSheetBySize = e => {
           this.frames = []

            for(let y = 0; y < this.image.naturalHeight; y += height) {
                for(let x = 0; x < this.image.naturalWidth; x += width) {
                    this.frames.push(new Rectangle(x, y, width, height))
                }
            }
    
            this.setCurrentFrame()
            this.dispatchImageSizeUpdateEvent()
        }

        this.doWhenImageIsLoaded(setSpriteSheetBySize)
    }

    setCurrentFrame(id = 0) {
        this.currentFrame = id >= this.frames.length ? 0 : id < 0 ? this.frames.length - 1 : id
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