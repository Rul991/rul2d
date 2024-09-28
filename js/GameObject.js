import InteractiveObject from "./InteractiveObject.js"
import Point from "./Point.js"

export default class GameObject extends Point {
    constructor(x, y) {
        super(x, y, 1)
        this.subObjects = {all: new Set()}
        this.colliders = new Set()
        this.mainCollider = null
        this.camera = null
        this.isRenderingFromCameraView()
    }

    doIfExist(object, callback = () => {}) {
        if(object !== undefined) callback()
    }

    addSubObjects(...subObjects) {
        subObjects.forEach(sub => {
            if(sub.isMainCollider && !this.mainCollider) this.mainCollider = sub

            const subName = sub.constructor.name.toLowerCase()

            this.setOffsetForSubObject(sub)

            this.subObjects.all.add(sub)

            if(!this.subObjects[subName]) this.subObjects[subName] = new Set()
            this.subObjects[subName].add(sub)

            if(sub.body) {
                this.colliders.add(sub)
            }
            
        })
    }

    removeSubObjects(...subObjects) {
        subObjects.forEach(sub => {
            if(!this.subObjects.all.delete(sub)) return

            const subName = sub.constructor.name.toLowerCase()
            this.subObjects[subName].delete(sub)

            if(sub.body) {
                this.colliders.delete(sub)
                this.world.world.removeBody(sub.body)

                if(this.mainCollider == sub) this.mainCollider = null
            }
        })
    }

    isRenderingFromCameraView(value = true) {
        this.isRenderedFromCameraView = value
        this.forSubObjects(sub => {
            if(sub instanceof InteractiveObject) sub.isRenderedFromCameraView = value
        })
    }

    init() {
        return false
    }

    setOffsetForSubObject(sub) {
        sub.offset = new Point()
        sub.offset.point = sub
    }

    updateSubObjectCoordinates(sub) {
        if(sub.isMainCollider) return
        sub.setPosition(sub.offset.x + this.x, sub.offset.y + this.y)
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

    updateCoordinate() {
        if(this.mainCollider) this.point = this.mainCollider
    }

    draw(ctx) {
        this.forSubObjects(sub => {
            if(sub.draw) sub.draw(ctx)
        })
    }

    update(ctx, delta) {
        this.updateCoordinate()
        this.updateSubObjectsCoordinates()
    }
}