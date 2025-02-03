import CanvasAudio from "./CanvasAudio.js"

/**
 * Represents stereo audio that can be panned left or right based on the position of a target object.
 * @extends CanvasAudio
 */

export default class CanvasStereoAudio extends CanvasAudio {

    /**
     * Creates an instance of CanvasStereoAudio positioned at (x, y).
     * 
     * @param {number} x - The x-coordinate of the stereo audio source.
     * @param {number} y - The y-coordinate of the stereo audio source.
     */

    constructor(x, y) {
        super(x, y)

        this.context = new AudioContext()
        this.panner = this.context.createStereoPanner()
        this.source = this.context.createMediaElementSource(this.audio)
        
        this.connect()
    }

    /**
     * Plays the audio and resumes the audio context.
     */

    play() {
        super.play()
        this.context.resume().then(() => this.audio.play())
    }

    /**
     * Connects the audio source to the panner and the panner to the audio context's destination.
     */

    connect() {
        this.source.connect(this.panner)
        this.panner.connect(this.context.destination)
    }

    /**
     * Sets the pan value for the audio. Values can range from -1 (left) to 1 (right).
     * 
     * @param {number} [value=0] - The pan value to set, default is 0 (center).
     */

    setPan(value = 0) {
        this.panner.pan.value = value
    }

    /**
     * Updates the audio settings based on the distance and angle to the listened object.
     * This adjusts the pan value to create a stereo effect based on the object's position.
     * 
     * @returns {boolean} True if the update was successful, false otherwise.
     */

    update() {
        if(!super.update()) return
        const angle = this.getAngle(this.listenedObject)
        this.setPan(Math.cos(angle))
    }
}