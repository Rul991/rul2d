import Area from "./Area.js"
import GameWorld from "./GameWorld.js"
import { getNumberSign } from "./numberWork.js"
import Point from "./Point.js"
import Rectangle from "./Rectangle.js"

export default class Collider extends Area {
    constructor(x, y, width, height, isMainCollider) {
        super(x, y, width, height)

        this.velocity = new Point()
        
        this.isCollider = true
        this.onGround = false
        this.isFall = false
        
        this.doWhenBeganContact(collider => this.handleCollision(collider))
        this.doWhenContinuedContact((collider, delta) => this.handleCollision(collider))
        this.endContactCallback(collider => this.onGround = false)

        this.setIsMainCollider(isMainCollider)
        this.setSpeed(50)
        this.setMass()
    }

    handleCollision(collider) {
        if(!this.mass) return
        
        let {x, y, bottom, right} = collider
        let {x: vx, y: vy} = this.velocity

        if(vx > 0) {
            this.addPosition(new Point(-(this.right - x), 0))
            this.velocity.x = 0
        }
        else if(vx < 0) {
            this.addPosition(new Point(-(this.x - right), 0))
            this.velocity.x = 0
        }

        if(vy > 0) {
            this.addPosition(new Point(0, -(this.bottom - y)))
            this.velocity.y = 0
            this.onGround = true
        }
        else if(vy < 0) {
            this.addPosition(new Point(0, -(this.y - bottom)))
            this.velocity.y = 0
        }
    }

    setMass(mass) {
        this.mass = mass ?? 0
    }

    setSpeed(speed) {
        this.speed = Math.max(speed, 0)
    }

    force(delta) {
        if(this.velocity) return
    }

    fall(delta) {
        if(this.onGround) {
            if(!this.isFall) this.velocity.setPosition()
            this.isFall = true
        }
        else {
            this.velocity.move(this.world.gravity, delta * this.mass)
            this.isFall = false
        }
    }

    stopping(delta) {
        let {x: vx, y: vy} = this.velocity
        let {abs} = Math

        if(abs(vx) > this.speed / 10) this.velocity.x -= this.speed * 0.9 * delta * getNumberSign(vx)
        else this.velocity.x = 0
        
        if(abs(vy) > this.speed / 10) this.velocity.y -= this.speed * 0.9 * delta * getNumberSign(vy)
        else this.velocity.y = 0
    }

    move(delta) {
        super.move(this.velocity, delta * this.speed)
    }

    hasCollision(rect = new Rectangle) {
        if(rect == this) return false

        return super.hasCollision(rect)
    }

    setIsMainCollider(isMainCollider) {
        this.isMainCollider = isMainCollider ?? false
    }

    update(ctx, delta) {
        this.fall(delta)
        this.move(delta)
        this.stopping(delta)
        super.update(ctx, delta)
    }
}