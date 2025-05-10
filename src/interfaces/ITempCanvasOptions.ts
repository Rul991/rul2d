import { Context } from '../utils/types'
import ISimpleSize from './ISimpleSize'

export default interface ITempCanvasOptions {
    size: ISimpleSize
    callback: (ctx: Context) => void
}