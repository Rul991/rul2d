import CanvasAudio from "./CanvasAudio.js"

export default class CanvasStereoAudio extends CanvasAudio {
    constructor(x, y) {
        super(x, y)

        this.context = new AudioContext()
        this.panner = this.context.createStereoPanner()
        this.source = this.context.createMediaElementSource(this.audio)
        
        this.connect()
    }

    play() {
        super.play()
        this.context.resume().then(() => this.audio.play())
    }

    connect() {
        this.source.connect(this.panner)
        this.panner.connect(this.context.destination)
    }

    setPan(value = 0) {
        this.panner.pan.value = value
    }

    update() {
        if(!super.update()) return
        const angle = this.getAngle(this.listenedObject)
        this.setPan(Math.cos(angle))
    }
}