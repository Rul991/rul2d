import Point from "./Point.js"
import Rectangle from "./Rectangle.js"
import Vector2 from "./Vector2.js"
import {Body, Box} from './utils/p2.js'
import { randomRGBA } from "./utils/colorWork.js"

/**
 * Represents a collider in the 2D physics world, extending from Rectangle.
 * Provides functionality for physical properties such as velocity, angle, and mass.
 * @extends Rectangle
 */

export default class P2Collider extends Rectangle {
    
    /**
     * Creates an instance of Collider at specified position and size.
     * 
     * @param {number} x - The x-coordinate of the collider.
     * @param {number} y - The y-coordinate of the collider.
     * @param {number} width - The width of the collider.
     * @param {number} height - The height of the collider.
     * @param {boolean} isMainCollider - Indicates if this collider is the main collider in the game object.
     */
    
    constructor(x, y, width, height, isMainCollider) {
        super(x, y, width, height)
        this.setPosition(this.x, this.y)
        this.lockAngle(false)

        this.isCollider = true
        this.isMainCollider = isMainCollider
        this.color = randomRGBA()
        this.maxSpeed = 100
    }

    /**
     * Locks or unlocks the angle of the collider.
     * 
     * @param {boolean} isLock - True to lock the angle, false to unlock.
     */

    lockAngle(isLock = false) {
        this.isLockAngle = isLock
    }

    /**
     * Sets the angle of the collider in radians.
     * Also updates the internal body angle in the physics engine.
     * 
     * @param {number} value - The angle value in radians.
     */

    set radians(value) {
        super.radians = value
        this.body.angle = this.radians
    }

    /**
     * Gets the current angle of the collider in radians.
     * 
     * @returns {number} The angle of the collider in radians.
     */

    get radians() {
        return this.body.angle
    }

    /**
     * Retrieves the current velocity of the collider as a Vector2.
     * 
     * @returns {Vector2} The velocity vector of the collider.
     */

    get velocity() {
        return new Vector2(...this.body.velocity)
    }

    /**
     * Sets the velocity of the collider.
     * 
     * @param {Object} velocity - The velocity object containing x and y components.
     * @param {number} velocity.x - The x-component of the velocity.
     * @param {number} velocity.y - The y-component of the velocity.
     */

    set velocity({x, y}) {
        this.body.velocity = [x, y]
    }

    /**
     * Sets the velocity of the collider using x and y components.
     * 
     * @param {number} [x=0] - The x-component of the velocity.
     * @param {number} [y=0] - The y-component of the velocity.
     */

    setVelocity(x, y) {
        this.velocity = new Point(x ?? this.velocity.x ?? 0, y ?? this.velocity.y ?? this.velocity.x ?? 0)
    }

    /**
     * Adds velocity to the collider.
     * 
     * @param {number} x - The amount to add to the x-component of the velocity.
     * @param {number} y - The amount to add to the y-component of the velocity.
     */

    addVelocity(x, y) {
        this.velocity = new Point(this.velocity.x + x, this.velocity.y + y)
    }

    /**
     * Sets the size of the collider and updates its physical body.
     * 
     * @param {number} width - The new width of the collider.
     * @param {number} height - The new height of the collider.
     */

    setSize(width, height) {
        super.setSize(width, height)

        this.setBox(width ?? 1, height ?? width ?? 1)
        this.setBody()
    }

    /**
     * Sets the position of the collider in the physics world.
     * 
     * @param {number} x - The new x-coordinate of the collider.
     * @param {number} y - The new y-coordinate of the collider.
     */

    setPosition(x, y) {
        super.setPosition(x, y)
        if(this.body) this.body.position = [x + this.width / 2, y + this.height / 2]
    }

    /**
     * Creates or updates the Box shape for the collider.
     * 
     * @param {number} width - The width of the box shape.
     * @param {number} height - The height of the box shape.
     */

    setBox(width, height) {
        this.box = new Box({width, height})
    }

    /**
     * Creates or updates the physics body for the collider in the world.
     */

    setBody() {
        if(this.world && this.body) this.world.removeBody(this.body)
        
        this.body = new Body({mass: this.mass ?? 1, position: [this.x, this.y]})
        this.body.addShape(this.box)

        if(this.world) this.world.addBody(this.body)
    }

    /**
     * Sets the mass of the collider and updates its physical properties.
     * 
     * @param {number} [mass=0] - The mass of the collider.
     */

    setMass(mass = 0) {
        this.mass = mass ?? 0
        this.body.mass = this.mass
        this.body.updateMassProperties()
        this.body.updateSolveMassProperties()
    }

    /**
     * Draws the actual rectangle shape of the collider on the canvas.
     * 
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
     * @param {string} color - The color to use for drawing the rectangle.
     * @returns {Rectangle} The drawn rectangle.
     */

    drawFactRect(ctx, color) {
        let [x, y] = this.body.position
        let {width, height} = this.box
        let rect = new Rectangle(x - width / 2, y - height / 2, width, height)
        rect.radians = this.body.angle
        return rect.draw(ctx, color)
    }

    /**
     * Updates the position of the collider based on its physics body position.
     */

    updatePosition() {
        let [x, y] = this.body.position
        this.x = x - this.width / 2
        this.y = y - this.height / 2
    }

    /**
     * Ensures the collider does not exceed the maximum speed limit.
     */

    updateVelocity() {
        let speedMagnitude = this.velocity.magnitude()
        let normalizedSpeed = this.velocity.normalize()
        if(speedMagnitude > this.maxSpeed) this.setVelocity(this.maxSpeed * normalizedSpeed.x, this.maxSpeed * normalizedSpeed.y)
    }

    /**
     * Updates the angle of the collider based on the lock status.
     */

    updateAngle() {
        if(this.isLockAngle) {
            this.body.angle = 0
            this.body.angularVelocity = 0
            this.body.angularForce = 0
            this.body.angularDamping = 0
        }
    }

    /**
     * Updates the collider's physics state (velocity, angle, and position).
     */

    update() {
        this.updateVelocity()
        this.updateAngle()
        this.updatePosition()
    }
}