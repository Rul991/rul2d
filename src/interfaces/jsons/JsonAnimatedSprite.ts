import ISimplePoint from '../simple/ISimplePoint'
import JsonSpriteSheet from './JsonSpriteSheet'

export default interface JsonAnimatedSprite extends JsonSpriteSheet {
    animations: Record<string, (ISimplePoint & {duration: number})[]>
}