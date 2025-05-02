import DrawMode from '../enums/DrawMode'
import IFont from '../interfaces/IFont'
import ISimpleColor from '../interfaces/ISimpleColor'
import JsonDrawableText from '../interfaces/jsons/JsonDrawableText'
import AssetsManager from '../utils/AssetsManager'
import CachedValue from '../utils/CachedValue'
import Color from '../utils/Color'
import Size from '../utils/Size'
import Logging from '../utils/static/Logging'
import { Context, Dict, TextHorisontalAlign, TextVerticalAlign } from '../utils/types'
import Rectangle from './Rectangle'
import ShapeableObject from './ShapeableObject'

export default class DrawableText extends ShapeableObject {
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

    public replaceableSymbols: Dict<string>

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height)

        this._text = ''
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

        this._drawMode = DrawMode.All

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
            DrawableText._transformColorFromSimpleColor(font, 'color')
            DrawableText._transformColorFromSimpleColor(font, 'outlineColor')
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
            let height = DrawableText.getTextHeight(ctx, text)

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

        return result
    }

    setSize(width?: number, height?: number): void {
        super.setSize(width, height)
        if(this._fittedText)
            this._fittedText.needUpdate()
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

        this._fittedText.needUpdate()
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

        let diffHeight = this.size.height - totalHeight

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

    protected _draw(ctx: Context): void {
        this._updateFont(ctx)
        let fittedText = this._fittedText.get(ctx)
        
        const textHeights = fittedText.map(value => DrawableText.getTextHeight(ctx, value))
        
        let totalHeight = 0

        if(this._font.horisontalAlign != 'left') {
            totalHeight = fittedText.reduce((sum, _, i) => {
                return sum + textHeights[i]
            }, 0)
        }

        let {width, height} = this._getTextOffsetByAlign(totalHeight)

        this.shape.clip(ctx, () => {
            this.shape.drawTransformed(ctx, (x, newY) => {
                let y = newY + height
    
                fittedText.forEach((line, i) => {
                    let args: [string, number, number] = [line, x + width, y]
    
                    this._executeCallbackByDrawMode(
                        () => {
                            ctx.fillText(...args)
                        },
                        () => {
                            ctx.strokeText(...args)
                        }
                    )
                    y += textHeights[i]
                })
            })
        })
    }
}