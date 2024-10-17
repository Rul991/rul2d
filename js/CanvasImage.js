import { drawImage } from "./utils/canvasWork.js"
import Rectangle from "./Rectangle.js"

export default class CanvasImage extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.image = new Image
    }

    dispatchImageSizeUpdateEvent() {
        if(this.isUpdateSizeByImage) {
            let event = new CustomEvent('image-size-update', {detail: {element: this}, bubbles: true})
            this.image.dispatchEvent(event)
        }
    }

    dispatchImageLoadEvent() {
        let event = new Event('image-load')
        this.image.dispatchEvent(event)
    }

    doWhenImageIsLoaded(callback = event => {}) {
        const doWhenIsLoaded = e => {
            callback(e)
            this.image.removeEventListener('image-load', doWhenIsLoaded)
        }

        if(!this.isImageLoaded) this.image.addEventListener('image-load', doWhenIsLoaded)
        else callback()
    }

    setImage(src = '') {
        this.isImageLoaded = false
        this.image.addEventListener('load', e => {
            this.isImageLoaded = true
            this.dispatchImageSizeUpdateEvent()
            this.dispatchImageLoadEvent()
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
            if(!this.isUpdateSizeByImage) return
            if(detail.element === this) this.updateSizeByImage()
        })
    }

    setSize(width, height) {
        this.isUpdateSizeByImage = false
        super.setSize(width, height)
    }

    draw(ctx) {
        if(!this.isVisible) return
        if(!this.isImageLoaded) return
        
        this.drawRotated(ctx, (x, y, width, height) => {
            drawImage(ctx, this.image, {x, y, width, height}, this.cuttedImage)
        })
    }
}