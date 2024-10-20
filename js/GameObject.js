import Camera from "./Camera.js"
import GameWorld from "./GameWorld.js"
import InteractiveObject from "./InteractiveObject.js"
import Point from "./Point.js"
import Rectangle from "./Rectangle.js"

export default class GameObject extends Point {
    constructor(x, y) {
        super(x, y, 1)
        this.subObjects = {all: new Set()}
        this.colliders = new Set()
        this.mainCollider = null
        this.isRenderingFromCameraView()
    }

    get factRect() {
        let rect = new Rectangle(Infinity)
        
        let right = 0
        let bottom = 0

        this.forSubObjects(sub => {
            let temp = new Rectangle()

            if(sub.offset) temp.point = sub.offset

            if(sub.cornersArray) {
                let corners = new Point(
                    sub.cornersArray.map(({x}) => x),
                    sub.cornersArray.map(({y}) => y)
                )

                temp._right = Math.max(...corners.x)
                temp._bottom = Math.max(...corners.y)
                
                temp.x = Math.min(...corners.x)
                temp.y = Math.min(...corners.y)
            }
            else if(sub.width) {
                temp._right = sub.width + temp.x
                temp._bottom = sub.height + temp.y
            }

            rect.x = Math.min(rect.x, temp.x)
            rect.y = Math.min(rect.y, temp.y)

            right = Math.max(right, temp._right)
            bottom = Math.max(bottom, temp._bottom)
        })

        rect.setSize(right - rect.x, bottom - rect.y)

        return rect
    }

    get center() {
        return this.factRect.center
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

    drawOutline(ctx, color) {
        this.factRect.drawOutline(ctx, color)
    }

    drawCenter(ctx, color) {
        this.factRect.center.drawPoint(ctx, color)
    }

    update(ctx, delta) {
        this.updateCoordinate()
        this.updateSubObjectsCoordinates()
    }
}