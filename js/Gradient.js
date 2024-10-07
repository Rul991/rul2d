import { deg2rad } from './numberWork.js';
import { fillRect } from "./canvasWork.js"
import Rectangle from "./Rectangle.js"

export default class Gradient extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.gradient = null
        this.radians = 0
        this.isNeedUpdateGradient = true

        this.colors = {}
    }

    setColor(color, offset = 0.1) {
        this.colors[color] = offset
        this.isNeedUpdateGradient = true
    }

    set radians(value) {
        super.radians = value
        this.isNeedUpdateGradient = true
    }

    get radians() {
        return super.radians
    }

    updateGradient(ctx) {
        let [x1, y1, x2, y2] = this.rotateGradient()
        this.gradient = ctx.createLinearGradient(x1, y1, x2, y2)

        Object.entries(this.colors).forEach(([color, offset]) => {
            this.gradient.addColorStop(offset, color)
        })

        this.isNeedUpdateGradient = false

        return this.gradient
    }

    rotateGradient() {
        let {cos, sin} = Math

        return [
            this.x * cos(this.radians),
            this.y * sin(this.radians),
            this.right * cos(this.radians),
            this.bottom * sin(this.radians)
        ]
    }

    draw(ctx = new CanvasRenderingContext2D) {
        if(this.isNeedUpdateGradient) this.updateGradient(ctx)
        if(!this.gradient) return
        
        fillRect(ctx, this.x, this.y, this.width, this.height, this.gradient)
    }
}