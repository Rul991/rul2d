import IManager from "../interfaces/IManager"
import Sorting from "../utils/Sorting"
import { Context } from "../utils/types"
import DrawableObject from "./DrawableObject"

export default class GameObject extends DrawableObject implements IManager {
    private _objects: DrawableObject[]

    constructor() {
        super()

        this._objects = []
    }

    addObject(object: DrawableObject): void {
        Sorting.addToArray(this._objects, object, obj => obj.zIndex)
        object.roots.set(this.id, object)
        object.managers.add(this)
    }

    removeObject(object: DrawableObject): boolean {
        let isDeleted: boolean = object.roots.delete(this.id)
        if(!isDeleted) return false

        object.roots.delete(this.id)
        object.managers.delete(this)

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

    protected _update(delta: number): void {}

    update(delta: number): void {
        this._update(delta)
    }

    updateZIndex(): void {
        this._objects = Sorting.merge(this._objects, obj => obj.zIndex)
    }
}