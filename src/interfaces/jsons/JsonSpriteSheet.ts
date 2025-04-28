import ISimpleSize from '../ISimpleSize'
import JsonCanvasImage from './JsonCanvasImage'

export default interface JsonSpriteSheet extends JsonCanvasImage {
    size: ISimpleSize & {type: 'grid' | 'dimensions'}
}