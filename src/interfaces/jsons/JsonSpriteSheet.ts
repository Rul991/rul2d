import ISimpleSize from '../simple/ISimpleSize'
import JsonCanvasImage from './JsonCanvasImage'

export default interface JsonSpriteSheet extends JsonCanvasImage {
    size: ISimpleSize & {type: 'grid' | 'dimensions'}
}