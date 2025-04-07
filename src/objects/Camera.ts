import Bounds from "../utils/Bounds"
import { Callback, Context } from "../utils/types"
import CustomObject from "./CustomObject"

export default class Camera extends CustomObject {
    protected _ctx: Context | null
    protected _zoomLimit: Bounds

    constructor(ctx: Context | null = null) {
        super()

        this._zoomLimit = new Bounds(0.5, 5)
        this._ctx = null
        if(ctx) this.setContext(ctx)
    }

    get isContextExist(): boolean {
        return Boolean(this._ctx)
    }

    setContext(ctx: Context) {
        this._ctx = ctx
    }

    begin() {

    }

    translate() {

    }

    scale() {

    }

    rotate() {

    }

    end() {

    }

    update(callback: Callback) {
        if(!this.isContextExist) return

        this.begin()
        this.translate()
        this.scale()
        this.rotate()
        this.end()
    }
}