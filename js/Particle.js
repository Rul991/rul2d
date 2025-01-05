import Point from "./Point.js"
import { randomRange } from "./utils/numberWork.js"
import Vector2 from "./Vector2.js"

export default class Particle extends Point {
    constructor(x, y) {
        super(x, y)

        this.lifeTime = 0
        this.currentTime = 0

        this.angle = 0

        this.velocity = new Vector2
        this.drawableObject = null

        this.isNeedRecreate = false
        this.isPlaying = false
    }

    pause() {
        this.isPlaying = false
    }

    play() {
        this.isPlaying = true
    }

    setLifeTime(time = 0) {
        this.lifeTime = time
        this.currentTime = 0
        this.isNeedRecreate = false
    }

    setDrawableObject(obj = new Point) {
        this.drawableObject = obj
    }

    moveToPositionAndBack(obj = new Point, callback = (obj = new Point) => {}) {
        let initPosition = new Point
        let initAngle 
        if(obj.degrees !== undefined) {
            initAngle = obj.degrees
            obj.degrees = this.angle
        }

        initPosition.point = obj
        obj.point = this

        callback(obj)
        obj.point = initPosition

        if(obj.degrees !== undefined) {
            obj.degrees = initAngle
        }
    }

    setRandomVelocity(min = new Point, max = new Point) {
        this.velocity.setPosition(
            randomRange(min.x, max.x, 2),
            randomRange(min.y, max.y, 2)
        )
    }

    draw(ctx = new CanvasRenderingContext2D) {
        if(!this.drawableObject) return
        if(!this.isPlaying) return
        if(!this.isNeedDraw()) return

        this.moveToPositionAndBack(this.drawableObject, obj => {
            let initAlpha = ctx.globalAlpha
            ctx.globalAlpha = this.opacity
            obj.draw(ctx)
            ctx.globalAlpha = initAlpha
        })
    }

    updateTime(delta = 0) {
        this.currentTime += delta
        
        if(this.currentTime > this.lifeTime) {
            this.isNeedRecreate = true
            this.pause()
        }
    }

    updateOpacity() {
        this.opacity = Math.max((this.lifeTime - this.currentTime) / this.lifeTime, 0)
    }

    update(delta) {
        if(!this.drawableObject || !this.isPlaying) return

        this.updateTime(delta)
        this.updateOpacity()
        this.move(this.velocity, delta)
    }
}