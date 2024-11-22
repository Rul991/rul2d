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

    setCamera(camera = new Camera) {
        this.camera = camera ?? new Camera
    }

    get factRect() {
        let rect = new Rectangle(Infinity)
        
        let right = 0
        let bottom = 0

        this.forSubObjects(subObject => {
            let sub
            if(subObject.factRect) sub = subObject.factRect
            else sub = subObject

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

        let width = right - rect.x
        let height = bottom - rect.y


        rect.setPosition(
            isFinite(rect.x) ? rect.x : this.x, 
            isFinite(rect.y) ? rect.y : this.y
        )

        rect.setSize(
            isFinite(width) ? width : 1, 
            isFinite(height) ? height : 1
        )

        return rect
    }

    get center() {
        return this.factRect.center
    }

    doIfExist(object, callback = () => {}) {
        if(object !== undefined) callback()
    }

    addSubObjects(...subObjects) {
        subObjects.forEach(sub => {
            if(sub.isMainCollider && !this.mainCollider) {
                this.mainCollider = sub
                this.setPosition = this.mainCollider.setPosition
            }

            const subName = sub.constructor.name.toLowerCase()

            this.setOffsetForSubObject(sub)

            this.subObjects.all.add(sub)

            if(!this.subObjects[subName]) this.subObjects[subName] = new Set()
            this.subObjects[subName].add(sub)

            if(sub.isCollider) {
                this.colliders.add(sub)
                sub.root = this
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

    setSize(width, height) {
        let oldSize = new Rectangle(0, 0, this.width, this.height)
        
        this.width = width || 1
        this.height = height || this.width
        
        if(oldSize.width == 1 && oldSize.height == 1) oldSize.rect = this

        this.forSubObjects(sub => {
            if(sub.setSize) sub.setSize((sub.width / oldSize.width) * this.width, (sub.height / oldSize.height) * this.height)
        })
    }

    init(canvas = new HTMLCanvasElement, camera = new Camera, world = new GameWorld) {
        this.canvas = canvas
        this.camera = camera
        this.world = world
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

    draw(ctx) {
        super.draw(ctx, this.color)
    }

    update(delta) {
        this.updateCoordinate()
        this.updateSubObjectsCoordinates()
    }
}