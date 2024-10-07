import { measureText } from "./canvasWork.js"
import Rectangle from "./Rectangle.js"

export default class CanvasText extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.text = ''
        this.fittedText = ['']

        this._font = {
            family: `'Courier New'`, 
            size: '1rem', 
            stretch: 'condensed', 
            kerning: 'auto',  
            variant: 'normal',
            color: '#000',
            letterSpacing: '0px'
        }

        this.setMaxSymbols()
    }

    setMaxSymbols(max = -1) {
        this.maxSymbols = max
    }

    setText(text) {
        this.text = text ?? ''
        if(this.maxSymbols != -1) this.text = this.text.substring(0, this.maxSymbols)

        this.isNeedUpdateFittedText = true
    }

    setSize(width, height) {
        super.setSize(width, height)

        this.isNeedUpdateFittedText = true
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
        this.isNeedUpdateFittedText = true
    }

    ignoreHeight(ignore = false) {
        this.isIgnoreHeight = ignore
    }

    get font() {
        return this._font
    }

    fitText(ctx) {
        let fittedText = ['']
        let textHeight = 0
        let symbols = this.text.split('')
        let symbolsCount = 0

        this.isTextFull = false
        
        for(let symb of symbols) {
            let lastIndex = fittedText.length - 1
            
            let {width, height} = measureText(ctx, fittedText[lastIndex] + symb)

            if(width <= this.width) fittedText[lastIndex] += symb
            else {
                if(!this.isIgnoreHeight) {
                    if(textHeight + height > this.height) {
                        this.isTextFull = true
                        this.text = this.text.substring(0, symbolsCount)
                        break
                    }
                    else textHeight += height
                }

                fittedText.push(symb)
            }
            
            symbolsCount++
        }
        
        return fittedText
    }

    updateFittedText(ctx) {
        if(this.isNeedUpdateFittedText) {
            this.isNeedUpdateFittedText = false
            this.fittedText = this.fitText(ctx)
        }
    }

    draw(ctx) {
        this.updateFont(ctx)
        this.updateFittedText(ctx)

        let y = this.y
        this.fittedText.forEach(text => {
            ctx.fillText(text, this.x, y)
            y += measureText(ctx, text).height
        })
    }
}