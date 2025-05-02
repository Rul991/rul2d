import Color from '../utils/Color'
import { TextHorisontalAlign, TextVerticalAlign } from '../utils/types'

export default interface IFont {
    family: string
    size: number
    kerning: CanvasFontKerning
    variant: CanvasFontVariantCaps
    stretch: CanvasFontStretch
    color: Color
    outlineColor: Color
    letterSpacing: number
    tabSize: number
    horisontalAlign: TextHorisontalAlign
    verticalAlign: TextVerticalAlign
}