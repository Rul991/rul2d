import Point from "./Point.js"
import Rectangle from "./Rectangle.js"
import { strokeArc } from "./utils/canvasWork.js"

export default class CanvasAudio extends Point {
    constructor(x, y) {
        super(x, y)

        this.isAudioLoaded = false
        this.audio = new Audio()

        this.setListenedObject()
        this.setVolume()
        this.setRadius()
    }

    get factRect() {
        return new Rectangle(this.x - this.audioRadius, this.y - this.audioRadius, this.audioRadius * 2)
    }

    setRadius(radius = 1) {
        this.audioRadius = radius
    }

    setLoop(loop = false) {
        this.audio.loop = loop
    }

    setVolume(volume = 1) {
        this.volume = volume
        this.audio.volume = this.volume
    }

    setListenedObject(object) {
        this.listenedObject = object ?? null
    }

    toggleMusicIfNeed() {
        if(this.isPlaying) this.audio.play()
        else this.audio.pause()
    }

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

    dispatchAudioLoadEvent() {
        let event = new Event('audio-load')
        this.audio.dispatchEvent(event)
    }

    doWhenAudioIsLoaded(callback = event => {}) {
        const doWhenIsLoaded = e => {
            callback(e)
            this.audio.removeEventListener('audio-load', doWhenIsLoaded)
        }

        if(!this.isAudioLoaded) this.audio.addEventListener('audio-load', doWhenIsLoaded)
        else callback()
    }

    toggle() {
        if(this.isPlaying) this.pause()
        else this.play()
    }

    play() {
        this.isPlaying = true
        this.audio.play()
    }

    pause() {
        this.isPlaying = false
        this.audio.pause()
    }

    update() {
        if(!this.listenedObject || this.audioRadius == -1) return false

        const distance = this.getDistance(this.listenedObject)
        if(!isFinite(distance)) return false

        let volume = Math.max(this.volume - (distance / this.audioRadius * this.volume), 0)
        if(!isFinite(volume)) return false

        this.audio.volume = volume

        return true
    }

    draw(ctx, color = null) {
        if(!this.isInViewport && !this.isVisible) return
        ctx.lineWidth = this.lineWidth
        strokeArc(ctx, this.x, this.y, this.audioRadius, color ?? this.color)
    }
}