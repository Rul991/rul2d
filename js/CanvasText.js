import { measureText } from "./canvasWork.js"
import { Rectangle } from "./Rectangle.js"

export class CanvasText extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.text = ''

        this._font = {
            family: `'Courier New'`, 
            size: '1rem', 
            stretch: 'condensed', 
            kerning: 'auto',  
            variant: 'normal',
            color: '#000',
            letterSpacing: '0px'
        }
    }

    setText(text) {
        this.text = text ?? ''
    }

    setSize(width, height) {
        super.setSize(width, height)

        this.isResizeableByText = false
    }

    setSizeByText(ctx) {
        let {width, height} = measureText(ctx, this.text)
        if(this.width == width && this.height == height) return

        this.setSize(width, height)
        this.isResizeableByText = true
    }

    updateFont(ctx) {
        ctx.font = `${this.font.size} ${this.font.family}`
        ctx.fillStyle = this.font.color
        ctx.fontStretch = this.font.stretch
        ctx.fontKerning = this.font.kerning
        ctx.fontVariantCaps = this.font.variant
        ctx.letterSpacing = this.font.letterSpacing
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'

        if(this.isResizeableByText) this.setSizeByText(ctx)
    }

    set font(font) {
        Object.entries(font).forEach(([key, value]) => {
            if(this._font[key] !== undefined)
                this._font[key] = value
        })
    }

    get font() {
        return this._font
    }

    fitText(ctx) {
        let fittedText = ['']
        this.text.split('').forEach(symb => {
            let lastIndex = fittedText.length - 1
            
            let {width} = measureText(ctx, fittedText[lastIndex] + symb)

            if(width <= this.width) fittedText[lastIndex] += symb
            else 
                fittedText.push(symb)
        })
        
        return fittedText
    }

    draw(ctx) {
        this.updateFont(ctx)
        let y = this.y
        this.fitText(ctx).forEach(text => {
            ctx.fillText(text, this.x, y)
            y += measureText(ctx, text).height
        })
    }
}