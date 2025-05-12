import Point from '../../objects/Point'
import HotKey from '../../utils/HotKey'
import { PointCallback } from '../../utils/types'

export default interface IKeyVectorOptions {
    negativeX: HotKey
    positiveX: HotKey
    
    negativeY: HotKey
    positiveY: HotKey

    callback: PointCallback
}