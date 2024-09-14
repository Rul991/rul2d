import { drawImage } from "./canvasWork.js"
import Rectangle from "./Rectangle.js"

export default class CanvasImage extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.image = new Image
    }

    setImage(src = '') {
        this.isImageLoaded = false
        this.image.addEventListener('load', e => {
            this.isImageLoaded = true
            if(this.isUpdateSizeByImage) {
                let event = new CustomEvent('image-size-update', {detail: {element: this}, bubbles: true})
                this.image.dispatchEvent(event)
            }
        })
        this.image.src = src
    }

    cutImage(rect = this.size) {
        this.cuttedImage = rect
    }

    updateSizeByImage() {
        [this.width, this.height] = [this.image.naturalWidth, this.image.naturalHeight]
        if(this.cuttedImage) this.cutImage()
    }

    setSizeByImage() {
        this.isUpdateSizeByImage = true
        this.image.addEventListener('image-size-update', ({detail}) => {
            if(detail.element === this) this.updateSizeByImage()
        })
    }

    setSize(width, height) {
        this.isUpdateSizeByImage = false
        super.setSize(width, height)
    }

    draw(ctx) {
        if(!this.isImageLoaded) return
        drawImage(ctx, this.image, this.rect, this.cuttedImage)
    }
}