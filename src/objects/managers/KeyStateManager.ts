import IKeyOptions from '../../interfaces/options/IKeyOptions'
import KeyCodes from '../../utils/KeyCodes'
import { KeyboardEventCallback } from '../../utils/types'
import CustomObject from '../core/CustomObject'
import KeyboardManager from './KeyboardManager'

export default class KeyStateManager extends CustomObject {
    public downKeyboardManager: KeyboardManager | null
    public upKeyboardManager: KeyboardManager | null

    private _key: KeyCodes | null
    private _options: IKeyOptions

    private _upCallback: KeyboardEventCallback
    private _downCallback: KeyboardEventCallback

    constructor () {
        super()

        this.downKeyboardManager = null
        this.upKeyboardManager = null
        this._key = null
        this._options = KeyboardManager.defaultOptions

        this._downCallback = e => { }
        this._upCallback = e => { }
    }

    setKey(key: KeyCodes, options?: IKeyOptions): void {
        this._key = key
        this._options = options ?? KeyboardManager.defaultOptions
    }

    setManager(down: KeyboardManager, up: KeyboardManager): void {
        this.downKeyboardManager = down
        this.upKeyboardManager = up
    }

    addKeyStateHandler(downCallback: KeyboardEventCallback, upCallback: KeyboardEventCallback) {
        this._downCallback = downCallback
        this._upCallback = upCallback

        this._addCallbacks()
    }

    removeKeyStateHandler(
        downCallback = this._downCallback,
        upCallback = this._upCallback): void {
            if (!(this.downKeyboardManager || this.upKeyboardManager)) return
            if (!this._key) return

            this.downKeyboardManager!.removeKey(this._key, downCallback, this._options)
            this.upKeyboardManager!.removeKey(this._key, upCallback, this._options)
    }

    private _addCallbacks(): void {
        if (!(this.downKeyboardManager || this.upKeyboardManager)) return
        if (!this._key) return

        this.downKeyboardManager!.addKey(this._key, this._downCallback, this._options)
        this.upKeyboardManager!.addKey(this._key, this._upCallback, this._options)
    }

}