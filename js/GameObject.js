import { Point } from "./Point.js"
import { Rectangle } from "./Rectangle.js"

export class GameObject extends Rectangle {
    constructor(x, y) {
        super(x, y, 1)
        this.subObjects = {all: []}
        this.colliders = []
    }

    addSubObjects(...subObjects) {
        subObjects.forEach(sub => {
            const subName = sub.constructor.name.toLowerCase()

            this.setOffsetForSubObject(sub)

            this.subObjects.all.push(sub)

            if(!this.subObjects[subName]) this.subObjects[subName] = []
            this.subObjects[subName].push(sub)

            if(sub.body) this.colliders.push(sub)
        })
    }

    setOffsetForSubObject(sub) {
        sub.offset = new Point()
        sub.offset.point = sub
    }

    fitSizeBySubObject(sub) {
        if(sub.width === undefined) return
        
        let x1, x2, y1, y2 = 0
        x1 = x2 = this.x
        y1 = y2 = this.y
    }

    updateSubObjectCoordinates(sub) {
        [sub.x, sub.y] = [sub.offset.x + this.x, sub.offset.y + this.y]
    }

    updateSubObjectsCoordinates() {
        this.forSubObjects(sub => {
            this.updateSubObjectCoordinates(sub)
        })
    }

    forSubObjects(callback = sub => {}, type = '') {
        if(type) this.subObjects[type.toLowerCase()].forEach(sub => callback(sub))
        
        else this.subObjects.all.forEach(sub => callback(sub))
    }

    draw(ctx) {
        this.forSubObjects(sub => {
            if(sub.draw) sub.draw(ctx)
        })
    }

    update(ctx, delta) {
        this.updateSubObjectsCoordinates()
        this.draw(ctx)
    }
}