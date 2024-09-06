import { Collider } from "./Collider.js"
import { Point } from "./Point.js"

export class MoveableCollider extends Collider {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.body.mass = 1
        this.body.updateMassProperties()

        this.direction = new Point()
        this.speed = 100
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
        [this.x, this.y]
    }    
}