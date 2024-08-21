import { Collider } from "./Collider.js"
import { Point } from "./Point.js"

export class MoveableCollider extends Collider {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.direction = new Point()
        this.speed = 1
    }

    set speed(value) {
        this._speed = value * 10
    }

    get speed() {
        return this._speed ?? 10
    }

    setDirection(x, y) {
        this.direction.setPosition(x, y)
    }

    addDirection({x, y}) {
        this.direction.addPosition({x, y})
    }

    move(delta) {
        this.addPosition(new Point(this.speed * this.direction.x * delta, this.speed * this.direction.y * delta))
    }

    collide() {
        this.collidedObjects.forEach(collider => {
            let depth = this.getDepthOfRectangleInside(collider)
            
            if(this.direction.x > 0) {
                this.x += depth.x
            }

            else  if(this.direction.x < 0) {
                this.x -= depth.x
            }
        })
    }
}