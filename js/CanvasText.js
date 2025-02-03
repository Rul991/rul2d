import { measureText } from "./utils/canvasWork.js"
import Rectangle from "./Rectangle.js"

/**
 * Represents text that can be rendered within a rectangular area on a canvas.
 * The class manages font styles, text fitting based on size, and can resize based on the text content.
 * @extends Rectangle
 */

export default class CanvasText extends Rectangle {

    /**
     * Creates an instance of CanvasText positioned at (x, y) with specified width and height.
     * 
     * @param {number} x - The x-coordinate of the top-left corner of the text.
     * @param {number} y - The y-coordinate of the top-left corner of the text.
     * @param {number} width - The width of the text box.
     * @param {number} height - The height of the text box.
     */

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

    /**
     * Sets the maximum number of symbols allowed in the text.
     * 
     * @param {number} [max=-1] - The maximum number of symbols (-1 means no limit).
     */

    setMaxSymbols(max = -1) {
        this.maxSymbols = max
    }

    /**
     * Sets the text to be displayed. If the text exceeds the maximum symbols, it is truncated.
     * 
     * @param {string} text - The text to set.
     */

    setText(text) {
        this.text = text ?? ''
        if(this.maxSymbols != -1) this.text = this.text.substring(0, this.maxSymbols)

        this.isNeedUpdateFittedText = true
    }

    /**
     * Sets the size of the text box and marks the fitted text for update.
     * 
     * @param {number} width - The new width of the text box.
     * @param {number} height - The new height of the text box.
     */

    setSize(width, height) {
        super.setSize(width, height)

        this.isNeedUpdateFittedText = true
        this.isResizeableByText = false
    }

    /**
     * Updates the size of the text box based on the text dimensions.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context used for measuring text.
     */

    updateSizeByText(ctx) {
        let {width, height} = measureText(ctx, this.text)
        if(this.width == width && this.height == height) return

        this.setSize(width, height)
        this.isResizeableByText = true
    }

    /**
     * Enables or disables automatic resizing of the text box based on the text.
     * 
     * @param {boolean} [value=true] - True to enable resizing, false to disable.
     */

    setSizeByText(value = true) {
        this.isResizeableByText = value
    }

    /**
     * Updates the font settings in the canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to update.
     */

    updateFont(ctx) {
        ctx.font = `${this.font.size} ${this.font.family}`
        ctx.fillStyle = this.font.color
        ctx.fontStretch = this.font.stretch
        ctx.fontKerning = this.font.kerning
        ctx.fontVariantCaps = this.font.variant
        ctx.letterSpacing = this.font.letterSpacing
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'

        if(this.isResizeableByText) this.updateSizeByText(ctx)
    }

    // {
    //     family: `'Courier New'`, 
    //     size: '1rem', 
    //     stretch: 'condensed', 
    //     kerning: 'auto',  
    //     variant: 'normal',
    //     color: '#000',
    //     letterSpacing: '0px'
    // }

    /**
     * Sets font properties based on the provided object.
     * 
     * @param {{family: string, size: string, stretch: string, kerning: string, variant: string, color: string, letterSpacing: string}} font - The font properties to update.
     * @returns {Object}
     */

    set font(font) {
        Object.entries(font).forEach(([key, value]) => {
            if(this._font[key] !== undefined)
                this._font[key] = value
        })
        this.isNeedUpdateFittedText = true
    }

    /**
     * Determines whether to cut text that exceeds the height of the text box.
     * 
     * @param {boolean} [isCut=false] - True to cut text, false to allow overflow.
     */

    isCutTextBySize(isCut = false) {
        this.isIgnoreHeight = !isCut
    }

    /**
     * Gets the current font properties
     */

    get font() {
        return this._font
    }

    /**
     * Fits the text into the available space by breaking it into lines.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context used for measuring text.
     * @returns {string[]} The fitted lines of text.
     */

    fitText(ctx) {
        let fittedText = ['']
        let textHeight = 0
        let symbolsCount = 0

        this.isTextFull = false
        
        let text = this.text
        for(let symb of text) {
            let lastIndex = fittedText.length - 1
            
            let {width, height} = measureText(ctx, fittedText[lastIndex] + symb)

            if(width <= this.width) fittedText[lastIndex] += symb
            else {
                if(!this.isIgnoreHeight) {
                    if(textHeight + height > this.height) {
                        this.isTextFull = true
                        text = text.substring(0, symbolsCount)
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

    /**
     * Updates the fitted text based on current settings and measures.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context used for measuring text.
     */

    updateFittedText(ctx) {
        if(this.isNeedUpdateFittedText) {
            this.isNeedUpdateFittedText = false
            this.fittedText = this.fitText(ctx)
        }
    }

    /**
     * Draws the text on the canvas.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context used for drawing.
     * @protected
     */

    _draw(ctx) {
        if(!this.isNeedDraw()) return
        this.updateFont(ctx)
        this.updateFittedText(ctx)

        this.drawRotated(ctx, (x, newY, width, height) => {
            let y = newY
            this.fittedText.forEach(text => {
                ctx.fillText(text, x, y)
                y += measureText(ctx, text).height
            })
        })
    }
}