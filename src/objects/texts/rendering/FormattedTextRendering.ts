import ITextRendering from '../../../interfaces/ITextRendering'
import ISimplePoint from '../../../interfaces/simple/ISimplePoint'
import SimpleRect from '../../../utils/SimpleRect'
import { Context, FormattedTextCallback, RenderType, TypeAndValue } from '../../../utils/types'

export default class FormattedTextRendering implements ITextRendering {
    private static _parsedSymbols: Record<string, FormattedTextCallback> = {
        '*': (ctx, text, rect, renderType) => {
            const {width} = ctx.measureText(text)
            ctx.font = ctx.font + ' bold'

            ctx[`${renderType}Text`](text, rect.x, rect.y)
        },
        '/': (ctx, text, rect, renderType) => {
            const {width} = ctx.measureText(text)
            ctx.font = ctx.font + ' italic'

            ctx[`${renderType}Text`](text, rect.x, rect.y)
        },
        '_': (ctx, text, rect, renderType) => {
            const {width} = ctx.measureText(text)
        },

        '#': (ctx, text, rect, renderType) => {
            const {width} = ctx.measureText(text)
            ctx[`${renderType}Text`](text, rect.x, rect.y)
            
            rect.x += width
        }
    }

    private _drawText(ctx: Context, type: RenderType) {
        if(type == 'stroke') {
            return ctx.strokeText
        }
        else return ctx.fillText
    }

    protected static _drawFormattedText(ctx: Context, line: string, x: number, y: number, renderType: RenderType): void {
        const parsedText = this._parseText(line)
        const rect = new SimpleRect(x, y, 1)

        for (const {type, value} of parsedText) {
            const callback = FormattedTextRendering._parsedSymbols[type]
            callback(ctx, value, rect, renderType)
        }
    }

    protected static _parseText(text: string): TypeAndValue<string, string>[] {
        // text example: #$*bold #$/italic #$_underline #$normal
        
        let parsed: TypeAndValue<string, string>[] = []
        let texts: string[] = text.split('#$')

        for (const text of texts) {
            if(text.length < 1) continue

            const firstSymb = text[0]
            const otherText = text.substring(1)

            if(FormattedTextRendering._parsedSymbols[firstSymb]) {
                if(otherText.length < 1) continue
                parsed.push({type: firstSymb, value: otherText})
            }
            else {
                parsed.push({type: '#', value: text})
            }
        }

        return parsed
    }

    strokeDrawText(ctx: Context, [line, x, y]: [string, number, number]): void {
        FormattedTextRendering._drawFormattedText(ctx, line, x, y, 'stroke')
    }

    fillDrawText(ctx: Context, [line, x, y]: [string, number, number]): void {
        FormattedTextRendering._drawFormattedText(ctx, line, x, y, 'fill')
    }

    updateText(ctx: Context, point: ISimplePoint, preUpdatedText: string[]): string[] {
        return preUpdatedText
    }
}