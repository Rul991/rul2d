import GameWorld from "./GameWorld.js"
import { getNumberSign } from "./utils/numberWork.js"
import Point from "./Point.js"
import Rectangle from "./Rectangle.js"
import Vector2 from "./Vector2.js"
import {Body, Box, Constraint, Ray, World} from './utils/p2.js'
import { randomRGBA } from "./utils/colorWork.js"

export default class Collider extends Rectangle {
    constructor(x, y, width, height, isMainCollider) {
        super(x, y, width, height)
        this.setPosition(this.x, this.y)
        this.lockAngle(true)

        this.isCollider = true
        this.isMainCollider = isMainCollider
        this.color = randomRGBA()
        this.maxSpeed = 100
    }

    lockAngle(isLock = false) {
        this.isLockAngle = isLock
    }

    set radians(value) {
        super.radians = value
        this.body.angle = this.radians
    }

    get radians() {
        return this.body.angle
    }

    get velocity() {
        return new Vector2(...this.body.velocity)
    }

    set velocity({x, y}) {
        this.body.velocity = [x, y]
    }

    setVelocity(x, y) {
        this.velocity = new Point(x ?? this.velocity.x ?? 0, y ?? this.velocity.y ?? this.velocity.x ?? 0)
    }

    addVelocity(x, y) {
        this.velocity = new Point(this.velocity.x + x, this.velocity.y + y)
    }

    setSize(width, height) {
        super.setSize(width, height)

        this.setBox(width ?? 1, height ?? width ?? 1)
        this.setBody()
    }

    set point(value) {
        super.point = value
        if(this.body) this.body.position = [value.x + this.width / 2, value.y + this.height / 2]
    }

    get point() {
        return super.point
    }

    setBox(width, height) {
        this.box = new Box({width, height})
    }

    setBody() {
        if(this.world && this.body) this.world.removeBody(this.body)
        
        this.body = new Body({mass: this.mass ?? 1, position: [this.x, this.y]})
        this.body.addShape(this.box)

        if(this.world) this.world.addBody(this.body)
    }

    setMass(mass = 0) {
        this.mass = mass ?? 0
        this.body.mass = this.mass
        this.body.updateMassProperties()
        this.body.updateSolveMassProperties()
    }

    drawFactRect(ctx, color) {
        let [x, y] = this.body.position
        let {width, height} = this.box
        let rect = new Rectangle(x - width / 2, y - height / 2, width, height)
        rect.radians = this.body.angle
        return rect.draw(ctx, color)
    }

    updatePosition() {
        let [x, y] = this.body.position
        this.x = x - this.width / 2
        this.y = y - this.height / 2
    }

    update() {
        let speedMagnitude = this.velocity.magnitude()
        let normalizedSpeed = this.velocity.normalize()
        if(speedMagnitude > this.maxSpeed) this.setVelocity(this.maxSpeed * normalizedSpeed.x, this.maxSpeed * normalizedSpeed.y)

        if(this.isLockAngle) {
            this.body.angle = 0
            this.body.angularVelocity = 0
            this.body.angularForce = 0
            this.body.angularDamping = 0
        }

        let [x, y] = this.body.position
        this.updatePosition()
    }
}