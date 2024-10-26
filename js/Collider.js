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
        this.maxVelocity = new Vector2(10, 50)
        
        this.isCollider = true
        this.onGround = false
        this.isFall = false
        
        this.doWhenBeganContact(collider => {
            this.handleCollision(collider)
        })
        this.doWhenContinuedContact((collider, delta) => {
            this.handleCollision(collider)
        })
        this.doWhenEndedContact(collider => {
            this.onGround = false
        })

        this.isMakeMainCollider(isMainCollider)
        this.setSpeed(50)
        this.setMass()
        this.setRestitution()
        this.setJumpPower()
    }

    setJumpPower(jump = 90) {
        this.jumpPower = jump
        if(this.maxVelocity.y < this.jumpPower) this.maxVelocity.y = this.jumpPower
    }

    set point(value) {
        this.prevPosition = new Point(this.x ?? 0, this.y ?? 0)
        super.point = value
    }

    get point() {
        return super.point
    }

    set friction(value) {
        this._friction = value
    }

    get friction() {
        return this._friction ?? this.speed / 10
    }

    handleCollision(collider = new Collider) {
        if(!this.mass) return

        let overlap = this.getOverlap(collider)
        // if(this.radians || collider.radians) overlap = this.getOverlapWithRotation(collider)
        // else overlap = this.getOverlap(collider)

        if(overlap.x < overlap.y) {
            if(this.x < collider.x) {
                this.x -= overlap.x
                if(this.mass > collider.mass && collider.mass && this.mass) collider.x -= overlap.x
            }
                
            else {
                this.x += overlap.x
                if(this.mass > collider.mass && collider.mass && this.mass) collider.x += overlap.x
            }
            this.velocity.x = 0
        }

        else {
            if(this.y < collider.y) {
                this.onGround = true
                this.y -= overlap.y
            }
            else {
                this.y += overlap.y
            }
            this.velocity.y = 0
        }
    }

    getOverlapWithRotation(collider = new Collider) {
        const rotatedCorners = collider.cornersArray
        let overlapX = Math.min(this.right - collider.x, collider.right - this.x)
        let overlapY = Math.min(this.bottom - collider.y, collider.bottom - this.y)

        for (const corner of rotatedCorners) {
            if (corner.x >= this.x && corner.x <= this.right && corner.y >= this.y && corner.y <= this.bottom) {
                overlapX = Math.min(overlapX, Math.abs(corner.x - this.x))
                overlapY = Math.min(overlapY, Math.abs(corner.y - this.y))
            }
        }

        return new Vector2(overlapX, overlapY)
    }

    getOverlap(collider = new Collider) {
        return new Vector2(
            Math.min(this.right - collider.x, collider.right - this.x),
            Math.min(this.bottom - collider.y, collider.bottom - this.y)
        )
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
            if(!this.isFall) this.velocity.y = 0
            this.isFall = true
        }
        else {
            this.velocity.move(this.world.gravity, delta * this.mass)
            this.isFall = false
        }
    }

    stopping(delta = 0) {
        let {x: vx, y: vy} = this.velocity
        let {abs} = Math

        if(abs(vx) > 0.1) this.velocity.x -= vx * this.friction * delta / 2
        else this.velocity.x = 0
        
        if(abs(vy) > 0.1) this.velocity.y -= vy * this.friction * delta / 2
        else this.velocity.y = 0
    }

    move(delta = 0 ) {
        if(this.velocity.x || this.velocity.y)
            super.move(this.velocity, delta * this.speed)
    }

    limitVelocity() {
        if(Math.abs(this.velocity.x) > this.maxVelocity.x) this.velocity.x = this.maxVelocity.x * getNumberSign(this.velocity.x)
        if(Math.abs(this.velocity.y) > this.maxVelocity.y) this.velocity.y = this.maxVelocity.y * getNumberSign(this.velocity.y)
    }

    isMakeMainCollider(isMainCollider = false) {
        this.isMainCollider = isMainCollider ?? false
    }

    update(delta) {
        this.fall(delta)
        this.limitVelocity()
        this.move(delta)
        this.stopping(delta)
        super.update(delta)
    }
}