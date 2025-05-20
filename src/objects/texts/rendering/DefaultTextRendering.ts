import { Context } from '../../../utils/types'
import ITextRendering from '../../../interfaces/ITextRendering'
import ISimplePoint from '../../../interfaces/simple/ISimplePoint'

export default class DefaultTextRendering implements ITextRendering {
    strokeDrawText(ctx: Context, args: [string, number, number]): void {
        ctx.strokeText(...args)
    }

    fillDrawText(ctx: Context, args: [string, number, number]): void {
        ctx.fillText(...args)
    }

    updateText(ctx: Context, point: ISimplePoint, text: string[]): string[] {
        return text
    }
}