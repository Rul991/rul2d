import IManager from "../interfaces/IManager"
import ISimplePoint from '../interfaces/ISimplePoint'
import ISimpleRect from '../interfaces/ISimpleRect'
import Search from '../utils/Search'
import SimpleRect from '../utils/SimpleRect'
import Sorting from "../utils/Sorting"
import { Context } from "../utils/types"
import Camera from './Camera'
import DrawableObject from "./DrawableObject"

export default abstract class GameObject extends DrawableObject implements IManager {
    protected _objects: DrawableObject[]    

    constructor() {
        super()

        this._objects = []
    }

    addObject(object: DrawableObject): boolean {
        if(!object.canBeSubObject) {
            console.warn('Cant be sub object', object)
            return false
        }
        Sorting.addToArray(this._objects, object, obj => obj.zIndex)
        // this._objects.push(object)
        // this.updateZIndex()
        object.root = this
        object.managers.add(this)

        return true
    }

    removeObject(object: DrawableObject): boolean {
        let isDeleted: boolean = Boolean(object.root)
        if(!isDeleted) return false

        object.managers.delete(this)

        let i = Search.binary(this._objects, object, obj => obj.zIndex)
        this._objects.splice(i, 1)

        return true
    }

    forEach(callback = (obj: DrawableObject, index: number) => {}): void {
        for (let i = 0; i < this._objects.length; i++) {
            const obj = this._objects[i]
            callback(obj, i)
        }
    }

    protected _draw(ctx: Context): void {
        this.forEach(obj => {
            obj.draw(ctx)
        })
    }

    updateObjects(delta: number): void {
        this.forEach(obj => {
            obj.update(delta)
        })
    }

    updatePositionByOffset(point: ISimplePoint): void {
        return
    }

    protected _update(delta: number): void {
        this.updateObjects(delta)
    }

    update(delta: number): void {
        this._update(delta)
    }

    updateZIndex(): void {
        this._objects = Sorting.merge(this._objects, obj => obj.zIndex)
    }

    isObjectInViewport(camera: Camera): boolean {
        return true
    }

    get factRect(): ISimpleRect {
        return new SimpleRect(0, 0, 1, 1)
    }
}