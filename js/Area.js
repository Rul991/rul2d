import Collider from "./Collider.js"
import GameWorld from "./GameWorld.js"
import Rectangle from "./Rectangle.js"

export default class Area extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.colliders = new Set

        this.doWhenBeganContact()
        this.doWhenContinuedContact()
        this.doWhenEndedContact()
    }

    setWorld(world = new GameWorld) {
        this.world = world
        this.colliders = this.world.colliders
    }

    doWhenBeganContact(callback = (collider = new Collider) => {}) {
        this.beginContactCallback = callback
    }
    
    doWhenContinuedContact(callback = (collider = new Collider, delta = 0) => {}) {
        this.continueContactCallback = callback
    }

    doWhenEndedContact(callback = (collider = new Collider) => {}) {
        this.endContactCallback = callback
    }

    checkContacts(delta) {
        this.colliders.forEach(collider => {
            if(!collider.prevAreasContacted) collider.prevAreasContacted = new Set()
            
            if(this.hasCollision(collider)) {                
                if(collider.prevAreasContacted.has(this)) 
                    this.continueContactCallback(collider, delta)
                else {
                    this.beginContactCallback(collider)
                    collider.prevAreasContacted.add(this)
                }
            }

            else {
                if(collider.prevAreasContacted.has(this)) {
                    this.endContactCallback(collider)
                    collider.prevAreasContacted.delete(this)
                }
            }
        })
    }

    hasCollision(rect = new Rectangle()) {
        let {x, y, bottom, right} = rect
        return this.right > x && this.x < right && this.bottom > y && this.y < bottom
    }

    update(ctx, delta) {
        this.checkContacts(delta)
    }
}