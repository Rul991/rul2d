import IKeyOptions from '../../interfaces/options/IKeyOptions'
import CustomObject from '../../objects/core/CustomObject'
import KeyCodes from './KeyCodes'

export default class HotKey extends CustomObject {
    public key: KeyCodes
    public options: IKeyOptions

    constructor(key: KeyCodes, options: IKeyOptions = {}) {
        super()
        this.key = key
        this.options = options
    }

    simplify() {
        return {
            key: this.key,
            options: this.options
        }
    }
}