import ITextRendering from '../../../interfaces/ITextRendering'
import ISimplePoint from '../../../interfaces/simple/ISimplePoint'
import { Context } from '../../../utils/types'

export default class FormattedTextRendering implements ITextRendering {
    protected static _parseText(text: string[]): string[][] {
        return [[]]
    }

    strokeDrawText(ctx: Context, [line, x, y]: [string, number, number]): void {
        ctx.strokeText('in progress', x, y)
    }

    fillDrawText(ctx: Context, [line, x, y]: [string, number, number]): void {
        ctx.fillText('in progress', x, y)
    }

    updateText(ctx: Context, point: ISimplePoint, updatedText: string[]): string[] {
        return updatedText
    }
}