import Point from "./Point.js"
import Rectangle from "./Rectangle.js"
import { strokeArc } from "./utils/canvasWork.js"

/**
 * Represents an audio source that can be placed at a specific point on canvas.
 * The audio source includes controls for loading, playing, pausing, and adjusting volume based on distance.
 * @extends Point
 */

export default class CanvasAudio extends Point {

    /**
     * Creates an instance of CanvasAudio at the specified coordinates.
     * 
     * @param {number} x - The x-coordinate of the audio source.
     * @param {number} y - The y-coordinate of the audio source.
     */

    constructor(x, y) {
        super(x, y)

        this.isAudioLoaded = false
        this.audio = new Audio()

        this.setListenedObject()
        this.setVolume()
        this.setRadius()
    }

    /**
     * Gets the rectangle that defines the area of audio emission.
     * 
     * @returns {Rectangle} The rectangle representing the audio area.
     */

    get factRect() {
        return new Rectangle(this.x - this.audioRadius, this.y - this.audioRadius, this.audioRadius * 2)
    }

    /**
     * Sets the radius for the audio emission area.
     * 
     * @param {number} [radius=1] - The radius of the audio emission.
     */

    setRadius(radius = 1) {
        this.audioRadius = radius
    }

    /**
     * Sets whether the audio should loop.
     * 
     * @param {boolean} [loop=false] - Whether to loop the audio.
     */

    setLoop(loop = false) {
        this.audio.loop = loop
    }

    /**
     * Sets the volume of the audio.
     * 
     * @param {number} [volume=1] - The volume level between 0 (muted) and 1 (max volume).
     */

    setVolume(volume = 1) {
        this.volume = volume
        this.audio.volume = this.volume
    }

    /**
     * Sets the object that this audio source listens to for distance calculations.
     * 
     * @param {Object|null} object - The object to listen to, or null to not listen to any object.
     */

    setListenedObject(object) {
        this.listenedObject = object ?? null
    }

    /**
     * Sets the audio source from a URL.
     * 
     * @param {string} [src=''] - The URL of the audio file to load.
     */

    setAudio(src = '') {
        if(!src.length) return
        this.isAudioLoaded = false

        this.audio.addEventListener('load', e => {
            this.isAudioLoaded = true
            this.setVolume(this.volume)

            this.dispatchAudioLoadEvent()
        })

        this.audio.src = src
    }

    /**
     * Dispatches an event to indicate that the audio has been loaded.
     */

    dispatchAudioLoadEvent() {
        let event = new Event('audio-load')
        this.audio.dispatchEvent(event)
    }

    /**
     * Executes a callback when the audio has been loaded.
     * 
     * @param {function(Event):void} [callback=event => {}] - The callback to execute when audio is loaded.
     */

    doWhenAudioIsLoaded(callback = event => {}) {
        const doWhenIsLoaded = e => {
            callback(e)
            this.audio.removeEventListener('audio-load', doWhenIsLoaded)
        }

        if(!this.isAudioLoaded) this.audio.addEventListener('audio-load', doWhenIsLoaded)
        else callback()
    }

    /**
     * Toggles the playback state (play or pause).
     */

    toggle() {
        if(this.isPlaying) this.pause()
        else this.play()
    }

    /**
     * Plays the audio.
     */

    play() {
        this.isPlaying = true
        this.audio.play()
    }

    /**
     * Pauses the audio.
     */

    pause() {
        this.isPlaying = false
        this.audio.pause()
    }

    /**
     * Updates the audio volume based on the distance to the listened object.
     * 
     * @returns {boolean} True if the update was successful, false otherwise.
     */

    update() {
        if(!this.listenedObject || this.audioRadius == -1) return false

        const distance = this.getDistance(this.listenedObject)
        if(!isFinite(distance)) return false

        let volume = Math.max(this.volume - (distance / this.audioRadius * this.volume), 0)
        if(!isFinite(volume)) return false

        this.audio.volume = volume

        return true
    }

    /**
     * Draws the audio emission area on the canvas.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @protected
     */

    _draw(ctx) {
        if(!this.isNeedDraw()) return
        strokeArc(ctx, this.x, this.y, this.audioRadius)
    }
}