import IManager from "../interfaces/IManager"
import Sorting from "../utils/Sorting"
import { Context } from "../utils/types"
import DrawableObject from "./DrawableObject"

export default class GameObject extends DrawableObject implements IManager {
    static createdObjectCount: number = 0

    private _objects: DrawableObject[]
    private _needUpdateZ: boolean
    private _id: number

    constructor() {
        super()
        GameObject.createdObjectCount++

        this._id = GameObject.createdObjectCount
        this._objects = []
        this._needUpdateZ = true
    }

    addObject(object: DrawableObject): void {
        Sorting.addToArray(this._objects, object, obj => obj.zIndex)
        object.roots.set(this._id, object)
    }

    removeObject(object: DrawableObject): boolean {
        let isDeleted: boolean = object.roots.delete(this._id)
        if(!isDeleted) return false

        this._updateObjectsOrder()

        return true
    }

    forEach(callback: (obj: DrawableObject, index: number) => void): void {
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

    protected _updateObjectsOrder(): void {
        this._needUpdateZ = false
        this.forEach((obj, i) => {
            obj.zIndex = i
        })
        this._needUpdateZ = true
    }

    update(delta: number): void {
        this.forEach(obj => {
            obj.update(delta)
        })
    }

    updateZIndex(): void {
        if(!this._needUpdateZ) return

        this._objects = Sorting.merge(this._objects, obj => obj.zIndex)
        this._updateObjectsOrder()
    }
}