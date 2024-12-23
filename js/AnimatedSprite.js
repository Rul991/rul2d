import SpriteKeyFrame from "./SpriteKeyFrame.js"
import SpriteAnimation from "./SpriteAnimation.js"
import SpriteSheet from "./SpriteSheet.js"

export default class AnimatedSprite extends SpriteSheet {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.animations = {}
        this.currentAnimation = new SpriteAnimation()
        this.currentAnimationFrame = new SpriteKeyFrame()
        this.currentTime = 0
    }

    async loadFromJSON(src = '') {
        let responce = await fetch(src)
        let data = await responce.json()
        
        Object.entries(data).forEach(([animationKey, animation]) => {
            let spriteAnimation = new SpriteAnimation()
            let keyFrames = []
            animation.keyframes.forEach(keyframe => {
                keyFrames.push(new SpriteKeyFrame(keyframe.id, keyframe.duration))
            })
            spriteAnimation.addKeyFrames(...keyFrames)
            this.addAnimation(animationKey, spriteAnimation)
        })
    }

    addAnimation(key = '', animation = new SpriteAnimation()) {
        this.animations[key] = animation
    }

    selectAnimation(key = '') {
        this.pause()
        if(!this.animations[key]) this.currentAnimation = null
        else {
            this.currentAnimation = this.animations[key]
        }
    }

    getCurrentFrame() {
        if(!this.hasCurrentAnimation()) return
        return this.frames[this.currentAnimationFrame.id]
    }

    play(key = '') {
        this.selectAnimation(key)
        this.playAnimation()
    }

    hasCurrentAnimation() {
        return this.currentAnimation ? true : false
    }

    updateTime(delta = 0) {
        if(!this.hasCurrentAnimation() || !this.isPlaying) return
        this.currentTime += delta
        if(this.currentTime > this.currentAnimation.totalDuration) this.currentTime = 0
    }

    playAnimation() {
        this.isPlaying = true
    }

    pause() {
        this.isPlaying = false
    }

    updateAnimation() {
        if(!this.hasCurrentAnimation() || !this.isPlaying) return
        
        this.currentAnimationFrame = this.currentAnimation.getFrameByTime(this.currentTime)
        this.cuttedImage = this.getCurrentFrame()
    }

    update(delta = 0) {
        this.updateTime(delta)
        this.updateAnimation()
    }
}