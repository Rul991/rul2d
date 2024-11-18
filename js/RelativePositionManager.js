import Rectangle from "./Rectangle.js"

export default class RelativePositionManager extends Rectangle {
    constructor(obj = new Rectangle) {
        super(0, 0, -1)
        this.setObject(obj)
        this.isInitUpdatingPosition = false
        this.initUpdatingPosition()
    }

    setObject(obj = new Rectangle) {
        this.object = obj
    }

    setCanvas(canvas = new HTMLCanvasElement) {
        this.canvas = canvas
        this.initUpdatingPosition()
    }

    updatePosition() {
        let {width, height} = this.canvas
        this.object.setPosition(this.x * width, this.y * height)
        if(this.object.setSize && (this.width != -1 || this.height != -1)) this.object.setSize(this.width * width, this.height * height)
    }

    initUpdatingPosition() {
        if(this.isInitUpdatingPosition) return
        if(!this.canvas) return

        this.isInitUpdatingPosition = true

        this.updatePosition()
        addEventListener('resize', e => this.updatePosition())
    }
}