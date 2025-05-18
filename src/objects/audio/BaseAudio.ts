import ValueEvent from '../../utils/events/ValueEvent'
import ISimplePoint from '../../interfaces/simple/ISimplePoint'
import ISimpleRect from '../../interfaces/simple/ISimpleRect'
import AssetsManager from '../../utils/AssetsManager'
import Bounds from '../../utils/bounds/Bounds'
import SimpleRect from '../../utils/SimpleRect'
import Logging from '../../utils/static/Logging'
import { Callback, Context } from '../../utils/types'
import Camera from '../camera/Camera'
import DrawableObject from '../core/DrawableObject'
import EventEmitter from '../EventEmitter'

export default class BaseAudio extends DrawableObject {
    static volumeBounds: Bounds = new Bounds(0, 10)

    protected _context: AudioContext
    protected _audioSource: AudioBufferSourceNode
    protected _gain: GainNode
    protected _audioNodes: AudioNode[]
    protected _src: string

    protected _isInitialStarted: boolean
    protected _paused: boolean
    protected _loop: boolean

    constructor() {
        super()

        this._context = new AudioContext()

        this._gain = this._context.createGain()

        this._audioSource = this._context.createBufferSource()
        this._audioNodes = []
        this._isInitialStarted = false
        this._paused = true
        this._loop = false
        this._src = ''

        this.eventEmitter = new EventEmitter<ValueEvent>()

        this._audioSource.addEventListener('ended', e => {
            Logging.engineLog('audio ended', this)
            this.eventEmitter.emitDefault('end')
            if(!this._loop) 
                this.stop()
        })
    }

    set loop(value: boolean) {
        Logging.engineLog('loop changed', this)
        this._loop = value
        this._audioSource.loop = value
    }

    get loop(): boolean {
        return this._audioSource.loop
    }

    set volume(value: number) {
        this._gain.gain.value = BaseAudio.volumeBounds.get(value)
        Logging.engineLog('volume changed', this)
    }

    get volume(): number {
        return this._gain.gain.value
    }

    get audioContext(): AudioContext {
        return this._context
    }

    get allNodes(): AudioNode[] {
        return [this._audioSource, ...this._audioNodes, this._gain]
    }

    protected _disconnectAllNodes(): void {
        this.allNodes.forEach(node => {
            node.disconnect()
        })
        Logging.engineLog('nodes disconnected', this)
    }

    protected _connectAllNodes(): void {
        let lastNode: AudioNode | undefined

        for (const node of this.allNodes) {
            if(lastNode) {
                lastNode.connect(node)
            }

            lastNode = node
        }

        lastNode!.connect(this._context.destination)
        Logging.engineLog('nodes connected', this)
    }

    protected _updateAllNodes(cb: Callback = () => {}): void {
        this._disconnectAllNodes()
        cb()
        this._connectAllNodes()
    }

    addAudioNode(node: AudioNode): void {
        this._updateAllNodes(() => {
            this._audioNodes.push(node)
        })
        Logging.engineLog('added audio node', this)
    }

    removeAudioNode(node: AudioNode): void {
        let i = this._audioNodes.indexOf(node)
        if(i == -1) return
        
        this._updateAllNodes(() => {
            this._audioNodes.splice(i, 1)
        })
        Logging.engineLog('removed audio node', this)
    }

    insertAudioNode(index: number, node: AudioNode): void {
        this._updateAllNodes(() => {
            this._audioNodes.splice(index, 0, node)
        })
        Logging.engineLog('inserted audio node', this)
    }

    setAudioBuffer(buffer: AudioBuffer): void {
        this._audioSource.buffer = buffer
        this.eventEmitter.emitDefault('load')
        Logging.engineLog('set audio buffer', this)
    }

    async loadFromFile(src: string): Promise<void> {
        this._audioSource.buffer = null
        const assets = new AssetsManager
        const buffer = await assets.loadAudioFile(src, this._context)
        this._src = src

        this.setAudioBuffer(buffer)
    }

    protected _recreateSource(): void {
        this._updateAllNodes(() => {
            this._audioSource.stop()
            this._audioSource.disconnect()

            let source = this._context.createBufferSource()
            source.buffer = this._audioSource.buffer

            this._audioSource = source
        })
        Logging.engineLog('recreated source', this)
    }

    start(secs: number = 0): void {
        if(!this._audioSource.buffer) 
            return Logging.warn('no buffer', this)

        if(!this._isInitialStarted) {
            this._connectAllNodes()
        }
        
        if(this._paused) {
            if(this._isInitialStarted) 
                this._recreateSource()

            this._audioSource.start(0, secs)
            this._context.resume()
        }

        this._isInitialStarted = true
        
        this._paused = false
        this.eventEmitter.emitDefault('play')
        Logging.engineLog('audio played', this)
    }

    stop(): void {
        if(!this._audioSource.buffer) 
            return Logging.warn('no buffer', this)

        this._audioSource.stop()
        this._paused = true
        this.eventEmitter.emitDefault('pause')
        Logging.engineLog('audio paused', this)
    }

    get factRect(): ISimpleRect {
        return new SimpleRect()
    }

    updatePositionByOffset(point: ISimplePoint): void {}

    protected _draw(ctx: Context): void {}

    isObjectInViewport(camera: Camera): boolean {
        return true
    }

    simplify() {
        return {
            ...super.simplify(),
            volume: this.volume,
            loop: this.loop,
            src: this._src
        }
    }
}