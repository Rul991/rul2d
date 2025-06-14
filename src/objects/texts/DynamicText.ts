import IFont from '../../interfaces/IFont'
import ISimplePoint from '../../interfaces/simple/ISimplePoint'
import JsonDrawableText from '../../interfaces/jsons/JsonDrawableText'
import AssetsManager from '../../utils/AssetsManager'
import CachedValue from '../../utils/CachedValue'
import Color from '../../utils/Color'
import Size from '../../utils/Size'
import { Context, Dict, TextHorisontalAlign, TextVerticalAlign } from '../../utils/types'
import Point from '../Point'
import ShapeableObject from '../shapeable/ShapeableObject'
import ITextRendering from '../../interfaces/ITextRendering'
import DefaultTextRendering from './rendering/DefaultTextRendering'

export default class DynamicText extends ShapeableObject {
    private static _transformColorFromSimpleColor(font: Partial<IFont>, key: 'color' | 'outlineColor'): void {
        if(font[key]) {
            if(!(font[key] instanceof Color)) {
                font[key] = Color.fromSimple(font[key])
            }
        }
    }
    
    static getTextHeight(ctx: Context, text: string): number {
        let {fontBoundingBoxAscent, fontBoundingBoxDescent} = ctx.measureText(text)
        return fontBoundingBoxAscent + fontBoundingBoxDescent
    }

    protected _text: string
    protected _fittedText: CachedValue<string[], Context>
    protected _font: IFont
    protected _maxSymbols: number
    protected _ctx?: Context
    protected _customRenderingText: ITextRendering

    public replaceableSymbols: Dict<string>

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height)

        this._text = ''
        this._customRenderingText = new DefaultTextRendering()
        this._fittedText = new CachedValue([])
        this._maxSymbols = -1
        this.replaceableSymbols = new Map()

        this._font = {
            family: 'Arial',
            size: 30,
            kerning: 'auto',
            variant: 'normal',
            color: Color.Green,
            outlineColor: Color.Green,
            letterSpacing: 0,
            stretch: 'normal',
            tabSize: 1,
            horisontalAlign: 'left',
            verticalAlign: 'top'
        }

        this._updateTabSize()

        this._fittedText.setUpdateCallback(ctx => this._updateFittedText(ctx))
    }

    protected async _loadJSONFromFile({text, font}: JsonDrawableText): Promise<void> {
        if(text) {
            if(text.type == 'src') {
                this.text = await AssetsManager.instance.loadTextFile(text.value)
            }
            else {
                this.text = text.value
            }
        }
            
        if(font) {
            DynamicText._transformColorFromSimpleColor(font, 'color')
            DynamicText._transformColorFromSimpleColor(font, 'outlineColor')
            this.font = font
        }
        
    }

    setAlign(horisontal: TextHorisontalAlign, vertical: TextVerticalAlign): void {
        this._font.horisontalAlign = horisontal
        this._font.verticalAlign = vertical
    }

    protected _updateTabSize(): void {
        this.replaceableSymbols.set('\t', ' '.repeat(this._font.tabSize))
    }

    protected _drawText(ctx: Context, point: ISimplePoint = new Point): void {
        this._updateFont(ctx)
        
        let fittedText = this._fittedText.get(ctx)
        let totalHeight = 0
        const textHeights = fittedText.map(value => DynamicText.getTextHeight(ctx, value))

        if(this._font.verticalAlign != 'top') {
            totalHeight = fittedText.reduce((sum, _, i) => {
                return sum + textHeights[i]
            }, 0)
        }

        let {width, height} = this._getTextOffsetByAlign(totalHeight)
        let y = point.y + height

        fittedText.forEach((line, i) => {
            let args: [string, number, number] = [line, point.x + width, y]

            this.executeCallbackByDrawMode(
                () => {
                    this._customRenderingText.fillDrawText(ctx, args)
                },
                () => {
                    this._customRenderingText.strokeDrawText(ctx, args)
                }
            )

            y += textHeights[i]
        })
    }

    setCustomTextRendering(rendering: ITextRendering): void {
        this._customRenderingText = rendering
    }

    protected _updateFittedText(ctx?: Context): string[] {
        let result = ['']

        if(!ctx)
            return result

        let textHeight = 0
        let symbolsCount = 0
        let {width: rectWidth, height: rectHeight} = this.shape.size

        let text = this._text

        for (const symb of text) {
            let lastIndex = result.length - 1

            let {width} = ctx.measureText(result[lastIndex] + symb)
            let height = DynamicText.getTextHeight(ctx, text)

            if(width <= rectWidth && symb != '\n')
                result[lastIndex] += symb

            else {
                if(textHeight + height > rectHeight) {
                    text = text.substring(0, symbolsCount)
                    break
                }
                else textHeight += height

                if(symb == '\n') result.push('')
                else result.push(symb)

                symbolsCount++
            }
        }

        return this._customRenderingText.updateText(ctx, {x: 0, y: 0}, result)
    }

    protected _needUpdateText(value: boolean | null = true) {
        if(!this._fittedText) return

        this._fittedText.needUpdate(value)
    }

    setSize(width?: number, height?: number): void {
        super.setSize(width, height)
        this._needUpdateText()
    }

    set font(value: Partial<IFont>) {
        const filteredValue = Object.fromEntries(
            Object.entries(value).filter(([_, val]) => val !== undefined)
        )
        
        this._font = { ...this._font, ...filteredValue }

        if(value.tabSize) {
            this._updateTabSize()
        }
    }

    set text(text: string) {
        let splittedText = text.split('')
        for (let i = 0; i < text.length; i++) {
            const symb = text[i]
            
            this.replaceableSymbols.forEach((value, key) => {
                if(symb != key) return

                splittedText.splice(i, 1, value)
            })
        }

        this._text = splittedText.join('')

        if(this._maxSymbols != -1)
            this._text = this._text.substring(0, this._maxSymbols)

        this._needUpdateText()
    }

    get text(): string {
        return this._text
    }

    protected _updateFont(ctx: Context): void {
        ctx.textAlign = this._font.horisontalAlign
        ctx.textBaseline = 'top'

        ctx.fillStyle = this._font.color.toString()
        ctx.strokeStyle = this._font.outlineColor.toString()

        ctx.letterSpacing = `${this._font.letterSpacing}px`
        ctx.font = `${this._font.size}px ${this._font.family}`

        ctx.fontStretch = this._font.stretch
        ctx.fontKerning = this._font.kerning
        ctx.fontVariantCaps = this._font.variant
    }

    protected _getTextOffsetByAlign(totalHeight: number): Size {
        let size = new Size

        switch (this._font.horisontalAlign) {
            case 'center':
                size.width = this.size.width / 2
                break

            case 'right':
                size.width = this.size.width
                break
        
            default:
                break
        }

        let diffHeight = Math.max(this.size.height - totalHeight, 0)

        switch (this._font.verticalAlign) {
            case 'middle':
                size.height = diffHeight / 2
                break

            case 'bottom':
                size.height = diffHeight
                break
        
            default:
                break
        }

        return size
    }

    protected _fill(ctx: Context): void {
        this.shape.drawTransformed(ctx, (x, y) => {
            this._drawText(ctx, {x, y})
        })
    }
}