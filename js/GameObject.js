import Camera from "./Camera.js"
import GameWorld from "./GameWorld.js"
import InteractiveObject from "./InteractiveObject.js"
import Point from "./Point.js"
import Rectangle from "./Rectangle.js"

/**
 * Represents a game object that can contain sub-objects and handle collision detection.
 * This class extends the Point class, allowing the game object to have a position in 2D space.
 * @extends Point
 */

export default class GameObject extends Point {

    /**
     * Creates an instance of GameObject at the specified position (x, y).
     * Initializes sub-objects and collider sets, and checks for rendering from camera view.
     * 
     * @param {number} x - The x-coordinate of the game object.
     * @param {number} y - The y-coordinate of the game object.
     */

    constructor(x, y) {
        super(x, y, 1)
        this.subObjects = {all: new Set()}
        this.colliders = new Set()
        this.mainCollider = null
        this.isRenderingFromCameraView()
    }

    /**
     * Sets the camera for the game object.
     * 
     * @param {Camera} [camera=new Camera] - The camera to associate with this game object.
     */

    setCamera(camera = new Camera) {
        this.camera = camera ?? new Camera
    }

    /**
     * Gets the bounding rectangle that encloses the actual size of the game object and its sub-objects.
     * 
     * @returns {Rectangle} The bounding rectangle representing the actual dimensions and position.
     */

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

    /**
     * Gets the center point of the actual size rectangle of the game object.
     * 
     * @returns {Point} The center point of the bounding rectangle.
     */

    get center() {
        return this.factRect.center
    }

    /**
     * Executes a callback if the specified object exists (is not undefined).
     * 
     * @param {Object} object - The object to check for existence.
     * @param {Function} [callback=()=>{}] - The callback function to execute if the object exists.
     */

    doIfExist(object, callback = () => {}) {
        if(object !== undefined) callback()
    }

    /**
     * Adds sub-objects to the game object, managing their relationships and collider states.
     * 
     * @param {...Object} subObjects - The sub-objects to add to this game object.
     */

    addSubObjects(...subObjects) {
        subObjects.forEach(sub => {
            sub.root = this

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
            }
            
        })
    }

    /**
     * Removes sub-objects from the game object, managing their relationships and collider states.
     * 
     * @param {...Object} subObjects - The sub-objects to remove from this game object.
     */

    removeSubObjects(...subObjects) {
        subObjects.forEach(sub => {
            if(!this.subObjects.all.delete(sub)) return

            sub.root = null

            const subName = sub.constructor.name.toLowerCase()
            this.subObjects[subName].delete(sub)

            if(sub.isCollider) {
                this.colliders.delete(sub)

                if(this.mainCollider == sub) this.mainCollider = null
            }
        })
    }

    /**
     * Sets whether the game object and its sub-objects are rendered from the camera's view.
     * 
     * @param {boolean} [value=true] - True to enable rendering from the camera view, false to disable.
     */

    isRenderingFromCameraView(value = true) {
        this.isRenderedFromCameraView = value
        this.forSubObjects(sub => {
            if(sub instanceof InteractiveObject) sub.isRenderedFromCameraView = value
        })
    }

    /**
     * Sets the size of the game object and adjusts the sizes of sub-objects proportionally.
     * 
     * @param {number} width - The new width of the game object.
     * @param {number} height - The new height of the game object.
     */

    setSize(width, height) {
        let oldSize = new Rectangle(0, 0, this.width, this.height)
        
        this.width = width || 1
        this.height = height || this.width
        
        if(oldSize.width == 1 && oldSize.height == 1) oldSize.rect = this

        this.forSubObjects(sub => {
            if(sub.setSize) sub.setSize((sub.width / oldSize.width) * this.width, (sub.height / oldSize.height) * this.height)
        })
    }

    /**
     * Sets the offset for a specific sub-object to be based on its current position.
     * 
     * @param {Object} sub - The sub-object for which to set the offset.
     */

    setOffsetForSubObject(sub) {
        sub.offset = new Point()
        sub.offset.point = sub
    }

    /**
     * Updates the coordinates of a specific sub-object based on the main object's position.
     * 
     * @param {Object} sub - The sub-object whose coordinates will be updated.
     */

    updateSubObjectCoordinates(sub) {
        if(this.mainCollider == sub) return
        
        sub.setPosition(sub.offset.x + this.x, sub.offset.y + this.y)
    }

    /**
     * Updates the positions of all sub-objects based on the main object's current position.
    */

    updateSubObjectsCoordinates() {
        this.forSubObjects(sub => {
            this.updateSubObjectCoordinates(sub)
        })
    }

    /**
     * Iterates over sub-objects and executes a callback function for each sub-object.
     * Can filter sub-objects by type if specified.
     * 
     * @param {Function} [callback=(sub=new Point)=>{}] - The function to execute for each sub-object. Receives the sub-object as an argument.
     * @param {string} [type=''] - The type of sub-objects to process. If specified, only sub-objects of this type are passed to the callback.
     */

    forSubObjects(callback = (sub = new Point) => {}, type = '') {
        if(type) this.subObjects[type.toLowerCase()].forEach(sub => callback(sub))
        
        else this.subObjects.all.forEach(sub => callback(sub))
    }

    /**
     * Updates the coordinates of the main point of the game object based on the position of the main collider.
     */

    updateCoordinate() {
        if(this.mainCollider) this.point = this.mainCollider
    }

    /**
     * Draws the outline of the bounding rectangle of the game object on the specified canvas context.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     * @param {Color} color - The color to use for the outline.
     */

    drawOutline(ctx, color) {
        this.factRect.drawOutline(ctx, color)
    }

    /**
     * Draws the center point of the bounding rectangle of the game object on the specified canvas context.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     * @param {Color} color - The color to use for the center point.
     */

    drawCenter(ctx, color) {
        this.factRect.center.drawPoint(ctx, color)
    }

    /**
     * Draws the game object onto the canvas context.
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
     */

    draw(ctx) {
        super.draw(ctx, this.color)
    }

    /**
     * Updates the game object's state based on the time elapsed since the last update.
     * This includes updating the main coordinates and the positions of sub-objects.
     * 
     * @param {number} delta - The time elapsed since the last update, typically in milliseconds.
     */

    update(delta) {
        this.updateCoordinate()
        this.updateSubObjectsCoordinates()
    }
}