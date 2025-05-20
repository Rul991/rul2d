import { Context } from '../utils/types'
import ISimplePoint from './simple/ISimplePoint'

export default interface ITextRendering {
    updateText(ctx: Context, point: ISimplePoint, text: string[]): string[]
    strokeDrawText(ctx: Context, args: [string, number, number]): void
    fillDrawText(ctx: Context, args: [string, number, number]): void
}