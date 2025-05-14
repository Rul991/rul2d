import HotKey from '../../utils/keys/HotKey'
import { PointCallback } from '../../utils/types'

export default interface IKeyAxisOptions {
    negative: HotKey
    positive: HotKey

    callback: (value: number) => void
}