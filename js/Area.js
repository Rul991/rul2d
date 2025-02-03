import Collider from "./P2Collider.js"
import GameWorld from "./GameWorld.js"
import Point from "./Point.js"
import Rectangle from "./Rectangle.js"

/**
 * Class that shows if there are intersections with an object
 * @extends Rectangle
 */
export default class Area extends Rectangle {
    /**
     * Class that shows if there are intersections with an object
     * @param {number} x - left corner coordinate
     * @param {number} y - top corner coordinate
     * @param {number} width - width 
     * @param {number} height - height
     */
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.colliders = new Set

        this.doWhenBeganContact()
        this.doWhenContinuedContact()
        this.doWhenEndedContact()
    }

    /**
     * Set GameWorld and world's colliders
     * @param {GameWorld} world 
     */
    setWorld(world = new GameWorld) {
        this.world = world
        this.colliders = this.world.colliders
    }

    /**
     * Set callback that is called when the intersection begins
     * @param {(collider = new Collider) => {}} callback - callback that is called when the intersection begins
     */
    doWhenBeganContact(callback = (collider = new Collider) => {}) {
        this.beginContactCallback = callback
    }
    
    /**
    * Set callback that is called when the intersection continues
    * @param {(collider = new Collider) => {}} callback - callback that is called when the intersection continues
    */
    doWhenContinuedContact(callback = (collider = new Collider, delta = 0) => {}) {
        this.continueContactCallback = callback
    }

    /**
    * Set callback that is called when the intersection ends
    * @param {(collider = new Collider) => {}} callback - callback that is called when the intersection ends
    */
    doWhenEndedContact(callback = (collider = new Collider) => {}) {
        this.endContactCallback = callback
    }

    /**
     * Check contacts with colliders
     * @param {number} delta - delta time
     */
    checkContacts(delta) {
        for(const collider of this.colliders) {
            if(!collider.prevAreasContacted) collider.prevAreasContacted = new Set()

            let isCollide = this.hasCollision(collider)

            if(isCollide) {           
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
        }   
    }

    /**
     * Is lines intersect
     * @param {Point} p1 - start point of first line
     * @param {Point} p2 - end point of first line
     * @param {Point} p3 - start point of second line 
     * @param {Point} p4 - end point of second line 
     * @returns {boolean}
     */
    isLinesIntersect(p1 = new Point, p2 = new Point, p3 = new Point, p4 = new Point) {
        let x1 = p1.x, y1 = p1.y,
            x2 = p2.x, y2 = p2.y,
            x3 = p3.x, y3 = p3.y,
            x4 = p4.x, y4 = p4.y

        let denominator = ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1))

        let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / denominator
        let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / denominator

        return (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
    }

    /**
     * Is AABB Intersecting
     * @param {Rectangle} rect - collider's rectangle
     * @returns {boolean}
     */
    isAABBIntersecting(rect = new Rectangle) {
        let {x, y, bottom, right, radians} = rect
        if(!radians && !this.radians) return this.x < right && this.right > x && this.y < bottom && this.bottom > y
        else {
            let thisBox = this.getBoundingBox()
            let rectBox = rect.getBoundingBox()

            return thisBox.x < rectBox.right && thisBox.right > rectBox.x && thisBox.y < rectBox.bottom && thisBox.bottom > rectBox.y
        }
    }

    /**
     * Do area has collision with collider
     * @param {Rectangle} rect - collider's rectangle
     * @returns {boolean}
     */
    hasCollision(rect = new Rectangle()) {
        if(rect == this) return false

        if(!this.isAABBIntersecting(rect)) return false
        else if(!this.radians && !rect.radians) return true

        let len = this.cornersArray.length

        for (let i = 0; i < len; i++) {
            const p1 = this.cornersArray[i]
            const p2 = this.cornersArray[(i + 1) % len]

            for (let j = 0; j < len; j++) {
                
                const p3 = rect.cornersArray[j]
                const p4 = rect.cornersArray[(j + 1) % len]

                if(this.isLinesIntersect(p1, p2, p3, p4)) return true
            }
        }

        return false
    }

    /**
     * Update contacts 
     * @param {number} delta - delta time
     */
    update(delta) {
        super.update(delta)
        this.checkContacts(delta)
    }
}