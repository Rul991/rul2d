import { deg2rad } from './numberWork.js';
import { fillRect } from "./canvasWork.js"
import Rectangle from "./Rectangle.js"

export default class LinearGradient extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.gradient = null
        this.gradientRadians = 0
        this.isNeedUpdateGradient = true

        this.colors = {}
    }

    setColor(color, offset = 0.1) {
        this.colors[offset] = color
        this.isNeedUpdateGradient = true
    }

    set gradientRadians(value) {
        this._gradientRadians = value
        this.isNeedUpdateGradient = true
    }

    get gradientRadians() {
        return this._gradientRadians
    }

    updateGradient(ctx) {
        let [x1, y1, x2, y2] = this.rotateGradient()
        this.gradient = ctx.createLinearGradient(x1, y1, x2, y2)

        Object.entries(this.colors).forEach(([offset, color]) => {
            this.gradient.addColorStop(offset, color)
        })

        this.isNeedUpdateGradient = false

        return this.gradient
    }

    rotateGradient() {
        let {cos, sin} = Math

        return [
            this.x * cos(this.gradientRadians),
            this.y * sin(this.gradientRadians),
            this.right * cos(this.gradientRadians),
            this.bottom * sin(this.gradientRadians)
        ]
    }

    draw(ctx = new CanvasRenderingContext2D) {
        if(this.isNeedUpdateGradient) this.updateGradient(ctx)
        if(!this.gradient) return
        
        this.drawRotated(ctx, (x, y, width, height) => {
            fillRect(ctx, x, y, width, height, this.gradient)
        })
    }
}