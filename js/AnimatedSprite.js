import SpriteKeyFrame from "./SpriteKeyFrame.js"
import SpriteAnimation from "./SpriteAnimation.js"
import SpriteSheet from "./SpriteSheet.js"
import Rectangle from "./Rectangle.js"

/**
 * Class that animates and displays a sprite
 * @extends SpriteSheet
 */

export default class AnimatedSprite extends SpriteSheet {
    /**
     * Class that animates and displays a sprite
     * @param {number} x - left corner coordinate
     * @param {number} y - top corner coordinate
     * @param {number} width - width
     * @param {number} height - height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.animations = {}
        this.currentAnimation = new SpriteAnimation()
        this.currentAnimationFrame = new SpriteKeyFrame()
        this.currentTime = 0
    }

    /**
     * Load animations from json file
     * @param {string} src - path to the JSON file relative to the point of invocation
     */
    
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

    /**
     * Add or set animation by name
     * @param {string} key - animation's name
     * @param {SpriteAnimation} animation - animation
     */
    addAnimation(key = '', animation = new SpriteAnimation()) {
        this.animations[key] = animation
    }

    /**
     * Select the animation by name
     * @param {string} key - animation's name
     */
    selectAnimation(key = '') {
        this.pause()
        if(!this.animations[key]) this.currentAnimation = null
        else {
            this.currentAnimation = this.animations[key]
        }
    }
    
    /**
     * Get current frame if current animation not equal null
     * @returns {null | Rectangle}
     */
    getCurrentFrame() {
        if(!this.hasCurrentAnimation()) return null
        return this.frames[this.currentAnimationFrame.id]
    }

    /**
     * Play the animation by name if exist
     * @param {string} key - animation's name
     */

    play(key = '') {
        this.selectAnimation(key)
        this.playAnimation()
    }

    /**
     * Do current animation exist, returns true, else false
     * @returns {boolean}
     */
    hasCurrentAnimation() {
        return this.currentAnimation ? true : false
    }

    /**
     * Update animation's current time if animation exist and animation is playing
     * @param {number} delta - delta time
     * @returns {void}
     */
    updateTime(delta = 0) {
        if(!this.hasCurrentAnimation() || !this.isPlaying) return
        this.currentTime += delta
        if(this.currentTime > this.currentAnimation.totalDuration) this.currentTime = 0
    }

    /**
     * Start animation
     */

    playAnimation() {
        this.isPlaying = true
    }

    /**
     * Pause animation
     */

    pause() {
        this.isPlaying = false
    }

    /**
     * Update animation by time
     * @returns {void}
     */
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