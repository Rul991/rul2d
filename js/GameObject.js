import Camera from "./Camera.js"
import GameWorld from "./GameWorld.js"
import InteractiveObject from "./InteractiveObject.js"
import Point from "./Point.js"

export default class GameObject extends Point {
    constructor(x, y) {
        super(x, y, 1)
        this.subObjects = {all: new Set()}
        this.colliders = new Set()
        this.mainCollider = null
        this.isRenderingFromCameraView()
    }

    setPosition(x, y) {
        if(this.mainCollider) this.mainCollider.setPosition(x, y)
        else super.setPosition(x, y)
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

            if(sub.isCollider) {
                this.colliders.add(sub)
            }
            
        })
    }

    removeSubObjects(...subObjects) {
        subObjects.forEach(sub => {
            if(!this.subObjects.all.delete(sub)) return

            const subName = sub.constructor.name.toLowerCase()
            this.subObjects[subName].delete(sub)

            if(sub.isCollider) {
                this.colliders.delete(sub)

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

    init(canvas = new HTMLCanvasElement, camera = new Camera, world = new GameWorld) {
        return null
    }

    setOffsetForSubObject(sub) {
        if(this.mainCollider == sub) return
        sub.offset = new Point()
        sub.offset.point = sub
    }

    updateSubObjectCoordinates(sub) {
        if(this.mainCollider == sub) return
        sub.setPosition(sub.offset.x + this.x, sub.offset.y + this.y)
    }

    updateSubObjectsCoordinates() {
        this.forSubObjects(sub => {
            this.updateSubObjectCoordinates(sub)
        })
    }

    forSubObjects(callback = (sub = new Point) => {}, type = '') {
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