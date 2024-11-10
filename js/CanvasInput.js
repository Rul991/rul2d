import CanvasText from "./CanvasText.js"
import ClickableObject from "./ClickableObject.js"
import { rgba } from "./utils/colorWork.js"
import GameObject from "./GameObject.js"
import KeyboardEventManager from "./KeyboardEventManager.js"
import Rectangle from "./Rectangle.js"

export default class CanvasInput extends GameObject {
    constructor(x, y, width, height) {
        super(x, y)

        this._style = {
            outlineColor: '#000000',
            background: '#00000000',
            focusOutlineColor: '#0000ff',
            focusBackground: '#00000000',
            focusFontColor: '#ff0000',
            selectedRectangleColor: rgba(0, 0, 255, 0.2)
        }

        this.createClickableButton()
        this.createStyleRectangle()
        this.createText()
        this.createSelectedRectangle()
        this.createPlaceholder()

        this.setSize(width, height)
        this.addControls()
    }

    setText(text) {
        this.text.setText(text)
        
    }

    set font(value) {
        this.text.font = value
        this.placeholder.font = this.font
    }

    get font() {
        return this.text.font
    }

    setSize(width, height) {
        this.forSubObjects(sub => {
            if(sub.width) sub.setSize(width, height)
        })
    }

    set style(style) {
        Object.entries(style).forEach(([key, value]) => {
            if(this._style[key]) this._style[key] = value
        })
    }

    get style() {
        return this._style
    }

    createStyleRectangle() {
        this.styleRectangle = new Rectangle()
        this.addSubObjects(this.styleRectangle)
    }

    createText() {
        this.text = new CanvasText()
        this.addSubObjects(this.text)
    }

    focus() {
        this.isFocus = true
    }

    blur() {
        this.isFocus = false
        this.isSelected = false
    }

    checkFocus() {
        if(this.isFocus == this.button.isInteracted) return
        if(this.button.isInteracted) this.focus()
        else this.blur()
    }

    inputText(e, otherText = null) {
        if(!this.isFocus) return
        if(this.text.isTextFull) return

        let { code, key, ctrlKey, altKey } = e

        if((!otherText && ctrlKey || altKey || (code.includes(key) && !code.includes('Key'))) && isNaN(+key)) return

        let text = this.text.text
        key = otherText ?? key

        if(!this.isSelected) {
            this.text.setText(text + key)
        }
        else this.text.setText(key)

        this.isSelected = false
    }

    copy(e) {
        if(!this.isFocus) return

        navigator.clipboard.writeText(this.text.text)
    }

    paste(e) {
        if(!this.isFocus) return

        const paste = value => {
            value[0].getType('text/plain')
            .then(blob => blob.text()
                .then(string => this.inputText(e, string))
            )
        }

        navigator.clipboard.read().then(paste)
        navigator.clipboard.addEventListener('paste', paste)
    }

    selectAllText(e) {
        if(!this.isFocus) return

        e.preventDefault()

        this.isSelected = true
        
    }
    
    deleteAllText() {
        this.text.setText('')
        this.isSelected = false
    }

    deleteLastSymbol() {
        let text = this.text.text
        text = text.substring(0, text.length-1)

        this.text.setText(text)
        this.isSelected = false
    }

    deleteText(e) {
        if(!this.isFocus) return

        e.preventDefault()
        
        if(!this.isSelected) this.deleteLastSymbol()
        else this.deleteAllText()
    }

    addControls() {
        this.controls = new KeyboardEventManager()
        this.controls.addControls('keydown')
        this.controls.addKey('KeyA', e => this.selectAllText(e), {ctrlKey: true})
        this.controls.addKey('KeyV', e => this.paste(e), {ctrlKey: true})
        this.controls.addKey('KeyC', e => this.copy(e), {ctrlKey: true})

        this.controls.addKeys(['Delete', 'Backspace'], e => this.deleteText(e))

        this.controls.addKey('null', e => this.inputText(e))
    }

    createSelectedRectangle() {
        this.selectedRectangle = new Rectangle()
        this.addSubObjects(this.selectedRectangle)
    }

    createClickableButton() {
        this.button = new ClickableObject()
        this.button.setCallback(point => {
            this.focus()
        })

        this.addSubObjects(this.button)
    }

    createPlaceholder() {
        this.placeholder = new CanvasText()
        this.setPlaceHolderText('no niggers')
        this.placeholder.font = this.font
        this.addSubObjects(this.placeholder)
    }

    setPlaceHolderText(text = '') {
        this.placeholder.setText(text)
    }

    drawPlaceholder(ctx) {
        ctx.globalAlpha /= 2
        this.placeholder.draw(ctx)
        ctx.globalAlpha *= 2
    }

    init(canvas, camera) {
        this.button.initInteractiveObject(canvas, camera)
    }

    draw(ctx) {
        if(!this.isInViewport && !this.isVisible) return

        if(this.isFocus) {
            this.styleRectangle.draw(ctx, this.style.focusBackground)
            this.styleRectangle.drawOutline(ctx, this.style.focusOutlineColor)
        }
        else {
            this.styleRectangle.draw(ctx, this.style.background)
            this.styleRectangle.drawOutline(ctx, this.style.outlineColor)
        }

        this.text.draw(ctx)
        if(!this.text.text.length) this.drawPlaceholder(ctx)
        if(this.isSelected) this.selectedRectangle.draw(ctx, this.style.selectedRectangleColor)
    }

    update(delta) {
        super.update(delta)
        this.checkFocus()
    }
}