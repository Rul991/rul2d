import { drawImage } from "./canvasWork.js"
import { Rectangle } from "./Rectangle.js"

export class CanvasImage extends Rectangle {
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
                this.dispatchEvent(event)
            }
        })
        this.image.src = src
    }

    updateSizeByImage() {
        [this.width, this.height] = [this.image.naturalWidth, this.image.naturalHeight]
    }

    setSizeByImage() {
        this.isUpdateSizeByImage = true
        this.addEventListener('image-size-update', ({detail}) => {
            if(detail.element === this) this.updateSizeByImage()
        })
    }

    setSize(width, height) {
        this.isUpdateSizeByImage = false
        super.setSize(width, height)
    }

    draw(ctx) {
        if(!this.isImageLoaded) return
        drawImage(ctx, this.image, this.rect)
    }
}