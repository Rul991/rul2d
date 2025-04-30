import Bounds from '../utils/Bounds'
import Logging from '../utils/static/Logging'
import VectorUtils from '../utils/static/VectorUtils'
import PositionedAudio from './PositionedAudio'

export default class StereoPositionedAudio extends PositionedAudio {
    static panBounds = new Bounds(-1, 1)

    protected _panner: StereoPannerNode

    constructor(x?: number, y?: number, radius?: number) {
        super(x, y, radius)

        this._panner = this._context.createStereoPanner()
    }

    get allNodes(): AudioNode[] {
        return [...super.allNodes, this._panner]
    }

    set pan(pan: number) {
        if(!isFinite(pan)) {
            Logging.engineWarn(this, `pan isnt finite: ${pan}`)
        }
        else this._panner.pan.value = StereoPositionedAudio.panBounds.get(pan)
    }

    get pan(): number {
        return this._panner.pan.value
    }

    update(delta: number): void {
        if(!this._listenedObject) return
        super.update(delta)

        const angle = VectorUtils.getAngle(this.circle.center, this._listenedObject)
        this.pan = -Math.cos(+angle)
    }
}