import SpriteAnimation from '../utils/animations/SpriteAnimation'
import SpriteKeyFrame from '../utils/animations/SpriteKeyFrame'
import SimpleRect from '../utils/SimpleRect'
import Logging from '../utils/static/Logging'
import PeriodicTimer from '../utils/timers/PeriodicTimer'
import { Context, Dict } from '../utils/types'
import Point from './Point'
import SpriteSheet from './SpriteSheet'

export default class AnimatedSprite extends SpriteSheet {
    protected _currentAnimation?: SpriteAnimation
    protected _currentAnimationFrame: SpriteKeyFrame
    protected _currentAnimationKey: string

    protected _animations: Dict<SpriteAnimation>
    protected _timer: PeriodicTimer

    public isPlaying: boolean

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height)

        this._animations = new Map
        this._timer = new PeriodicTimer(0)
        this._currentAnimationFrame = new SpriteKeyFrame(0, 0, 0)
        this._currentAnimationKey = ''

        this.isPlaying = false
    }

    protected _loadJSONFromFile<T extends Record<string, any> = Record<string, any>>(result: T): void {
        
    }

    play(key: string): void {
        this.selectAnimation(key)

        if(!this.hasCurrentAnimation()) return
        this.isPlaying = true
        this.updateTimer()
    }

    pause(): void {
        this.isPlaying = false
    }

    addAnimation(key: string, animation: SpriteAnimation): void {
        this._animations.set(key, animation)
    }

    selectAnimation(key: string): void {
        if(!this._animations.has(key)) {
            this._currentAnimation = undefined
            return Logging.engineWarn(this, `hasnt key: ${key}`)
        }
        
        if(key != this._currentAnimationKey) {
            this._currentAnimationKey = key
            this._timer.reset()
        }
        
        this._currentAnimation = this._animations.get(key)
    }

    updateTimer(): void {
        if(!this.hasCurrentAnimation()) return

        this._timer.targetTime = this._currentAnimation!.totalDuration
    }

    removeAnimation(key: string): void {
        this._animations.delete(key)
    }

    hasCurrentAnimation(): boolean {
        return Boolean(this._currentAnimation)
    }

    protected _updateTime(delta: number): void {
        if(!this.isPlaying || !this.hasCurrentAnimation()) return

        this._timer.update(delta)
    }

    protected _updateAnimation(): void {
        if(!this.hasCurrentAnimation()) return
        
        this._currentAnimationFrame = this._currentAnimation!.getFrameByTime(this._timer.currentTime)!
        this.setCurrentFrame(this._currentAnimationFrame)
    }

    update(delta: number): void {
        this._updateTime(delta)
        this._updateAnimation()
    }

    protected _draw(ctx: Context): void {
        if(!this.hasCurrentAnimation()) return
        super._draw(ctx)
    }
}