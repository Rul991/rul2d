import Area from "./Area.js"
import GameWorld from "./GameWorld.js"
import { getNumberSign } from "./utils/numberWork.js"
import Point from "./Point.js"
import Rectangle from "./Rectangle.js"
import Vector2 from "./Vector2.js"

export default class Collider extends Area {
    constructor(x, y, width, height, isMainCollider) {
        super(x, y, width, height)

        this.velocity = new Vector2()
        
        this.isCollider = true
        this.onGround = false
        this.isFall = false
        
        this.doWhenBeganContact(collider => {
            this.handleCollision(collider)
            // console.log('begin', collider.mass)
        })
        this.doWhenContinuedContact((collider, delta) => {
            this.handleCollision(collider)
            // console.log('continue', collider.mass)
        })
        this.doWhenEndedContact(collider => {
            // console.log('end', collider.mass)
        })

        this.isMakeMainCollider(isMainCollider)
        this.setSpeed(50)
        this.setMass()
        this.setRestitution()
    }

    set friction(value) {
        this._friction = value
    }

    get friction() {
        return this._friction ?? this.speed / 50
    }

    calculateRelativeVelocity({velocity} = new Collider) {
        return new Vector2(this.velocity.x - velocity.x, this.velocity.y - velocity.y)
    }

    calculateImpulse(collider = new Collider, normal = new Vector2, relativeVelocity = new Vector2) {
        return (-(1 + this.restitution) * (relativeVelocity.x * normal.x + relativeVelocity.y * normal.y)) / (1 / this.mass + 1 / collider.mass)
    }

    updateVelocity(impulse = 0, normal = new Vector2) {
        this.velocity.x -= impulse / this.mass * normal.x
        this.velocity.y -= impulse / this.mass * normal.y
    }

    updateAngle() {
        this.radians = Math.atan2(this.velocity.y, this.velocity.x)
    }

    handleCollision(collider = new Collider) {
        if(!collider.mass) return
        
        const [colliderVector] = Vector2.toVectors(collider)

        const normal = colliderVector.calcNormal(this).normalize()
        const relativeVelocity = collider.calculateRelativeVelocity(this)
        const impulse = collider.calculateImpulse(this, normal, relativeVelocity)

        collider.updateVelocity(impulse, normal)
        collider.move(1)
        collider.updateAngle()

        // console.log(collider.radians, this.radians)

        // console.log(colliderVector, normal, relativeVelocity, impulse)
    }

    setRestitution(value = 0.5) {
        this.restitution = value ?? 0.5
    }

    setMass(mass = 0) {
        this.mass = mass ?? 0
    }

    setSpeed(speed = 0) {
        this.speed = Math.max(speed, 0)
    }

    fall(delta = 0) {
        if(this.onGround) {
            if(!this.isFall) this.velocity.setPosition()
            this.isFall = true
        }
        else {
            this.velocity.move(this.world.gravity, delta * this.mass)
            this.isFall = false
            // console.log(this.point)
        }
    }

    stopping(delta = 0) {
        let {x: vx, y: vy} = this.velocity
        let {abs} = Math

        if(abs(vx) > this.friction) this.velocity.x -= this.friction * delta * getNumberSign(vx)
        else this.velocity.x = 0
        
        if(abs(vy) > this.friction) this.velocity.y -= this.friction * delta * getNumberSign(vy)
        else this.velocity.y = 0
    }

    move(delta = 0 ) {
        super.move(this.velocity, delta * this.speed)
    }

    isMakeMainCollider(isMainCollider = false) {
        this.isMainCollider = isMainCollider ?? false
    }

    update(delta) {
        this.fall(delta)
        this.move(delta)
        this.stopping(delta)
        super.update(delta)
    }
}