import { Context } from '../../utils/types'
import ISimpleSize from '../simple/ISimpleSize'

export default interface ITempCanvasOptions {
    size: ISimpleSize
    callback: (ctx: Context) => void
    quality?: number
    mimeImageType?: string
}