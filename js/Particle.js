import Point from "./Point.js"
import { randomRange } from "./utils/numberWork.js"
import Vector2 from "./Vector2.js"

/**
 * Represents a particle in 2D space, extending from Point.
 * The particle has properties for movement, rotation, and lifetime.
 * @extends Point
 */

export default class Particle extends Point {

    /**
     * Creates an instance of Particle at the specified position.
     * 
     * @param {number} x - The x-coordinate of the particle.
     * @param {number} y - The y-coordinate of the particle.
     */

    constructor(x, y) {
        super(x, y)

        this.lifeTime = 0
        this.currentTime = 0

        this.degrees = 0
        this.angularVelocity = 0

        this.velocity = new Vector2
        this.drawableObject = null

        this.isNeedRecreate = false
        this.isPlaying = false
    }

    /**
     * Sets the rotation angle of the particle in degrees, normalized to [0, 360).
     * 
     * @param {number} [degrees=0] - The angle in degrees.
     */

    setDegrees(degrees = 0) {
        this.degrees = degrees % 360
    }

    /**
     * Pauses the particle, stopping any updates or rendering.
     */

    pause() {
        this.isPlaying = false
    }

    /**
     * Resumes the particle, allowing for updates and rendering.
     */

    play() {
        this.isPlaying = true
    }

    /**
     * Sets the lifetime of the particle and resets the current time.
     * 
     * @param {number} [time=0] - The lifetime of the particle.
     */

    setLifeTime(time = 0) {
        this.lifeTime = time
        this.currentTime = 0
        this.isNeedRecreate = false
    }

    /**
     * Sets the drawable object used for rendering the particle.
     * 
     * @param {Point} [obj=new Point] - The drawable object.
     */

    setDrawableObject(obj = new Point) {
        this.drawableObject = obj
    }

    /**
     * Moves the particle to a specified position and back, executing a callback.
     * 
     * @param {Point} [obj=new Point] - The object to move to.
     * @param {Function} [callback=(obj=new Point)=>{}] - The callback function to execute.
     */

    moveToPositionAndBack(obj = new Point, callback = (obj = new Point) => {}) {
        let initPosition = new Point
        let initAngle 
        if(obj.degrees !== undefined) {
            initAngle = obj.degrees
            obj.degrees = this.degrees
        }

        initPosition.point = obj
        obj.point = this
        if(obj.updateSubObjectsCoordinates) obj.updateSubObjectsCoordinates()

        callback(obj)

        obj.point = initPosition
        if(obj.updateSubObjectsCoordinates) obj.updateSubObjectsCoordinates()

        if(obj.degrees !== undefined) {
            obj.degrees = initAngle
        }
    }

    /**
     * Sets a random velocity for the particle within specified ranges.
     * 
     * @param {Point} [min=new Point] - The minimum velocity component values.
     * @param {Point} [max=new Point] - The maximum velocity component values.
     */

    setRandomVelocity(min = new Point, max = new Point) {
        this.velocity.setPosition(
            randomRange(min.x, max.x, 2),
            randomRange(min.y, max.y, 2)
        )
    }

    /**
     * Sets a random angular velocity for the particle.
     * 
     * @param {number} [min=0] - The minimum angular velocity.
     * @param {number} [max=0] - The maximum angular velocity.
     */

    setRandomAngularVelocity(min = 0, max = 0) {
        this.degrees = 0
        this.angularVelocity = randomRange(min, max)
    }

    /**
     * Renders the particle on the provided canvas context.
     * 
     * @param {CanvasRenderingContext2D} [ctx=new CanvasRenderingContext2D] - The rendering context to draw on.
     */

    draw(ctx = new CanvasRenderingContext2D) {
        if(!this.drawableObject) return
        if(!this.isPlaying) return
        if(!this.isNeedDraw()) return

        this.moveToPositionAndBack(this.drawableObject, obj => {
            this.doWithOpacity(ctx, () => {
                this.camera.culling(obj, () => obj.draw(ctx))
            })
        })
    }

    /**
     * Updates the particle's time, checking if it has lived longer than its lifetime.
     * 
     * @param {number} [delta=0] - The time delta for the update.
     */

    updateTime(delta = 0) {
        this.currentTime += delta
        
        if(this.currentTime > this.lifeTime) {
            this.isNeedRecreate = true
            this.pause()
        }
    }

    /**
     * Updates the opacity of the particle based on its lifetime.
     */

    updateOpacity() {
        this.opacity = Math.max((this.lifeTime - this.currentTime) / this.lifeTime, 0)
    }

    /**
     * Updates the particle's state based on the time delta.
     * 
     * @param {number} delta - The time delta to update the particle.
     */

    update(delta) {
        if(!this.drawableObject || !this.isPlaying) return

        this.updateTime(delta)
        this.updateOpacity()
        this.setDegrees(this.degrees + this.angularVelocity * delta)
        this.move(this.velocity, delta)
    }
}