import IManager from "../../interfaces/IManager"
import ISimplePoint from '../../interfaces/simple/ISimplePoint'
import ISimpleRect from '../../interfaces/simple/ISimpleRect'
import Logging from '../../utils/static/Logging'
import Search from '../../utils/static/Search'
import SimpleRect from '../../utils/SimpleRect'
import Sorting from "../../utils/static/Sorting"
import { Context } from "../../utils/types"
import Camera from '../camera/Camera'
import DrawableObject from "./DrawableObject"
import GameWorld from './GameWorld'

export default abstract class GameObject extends DrawableObject implements IManager {
    protected _objects: DrawableObject[]    

    constructor() {
        super()

        this._objects = []
    }

    protected _addObjectToArray<T extends DrawableObject>(object: T, arr: T[]): boolean {
        if(!object.canBeSubObject) {
            Logging.engineWarn('Cant be sub object', object)
            return false
        }

        Sorting.addToArray(arr, object, obj => obj.zIndex)
        // arr.push(object)
        // let sorted = Sorting.quick(arr, obj => obj.zIndex)
        // arr.splice(0, arr.length, ...sorted)
        
        object.root = this
        object.managers.add(this)

        return true
    }

    protected _removeObjectFromArray<T extends DrawableObject>(object: T, arr: T[]): boolean {
        let isDeleted: boolean = Boolean(object.root)
        if(!isDeleted) return false

        object.managers.delete(this)

        let i = Search.binary(arr, object, obj => obj.zIndex)
        this._objects.splice(i, 1)

        return true
    }

    addObjects(...objects: DrawableObject[]): void {
        objects.forEach(obj => this.addObject(obj))
    }

    addObject(object: DrawableObject): boolean {
        return this._addObjectToArray(object, this._objects)
    }

    removeObject(object: DrawableObject): boolean {
        return this._removeObjectFromArray(object, this._objects)
    }

    forEach(callback = (obj: DrawableObject, index: number) => {}): void {
        for (let i = 0; i < this._objects.length; i++) {
            const obj = this._objects[i]
            callback(obj, i)
        }
    }

    protected async _preload(world: GameWorld): Promise<void> {

    }

    async preload(world: GameWorld): Promise<void> {
        await this._preload(world)
    }

    protected _create(world: GameWorld): DrawableObject[] {
        return []
    }

    init(world: GameWorld): void {
        if(this._isInitialized) return

        this.addObjects(...this._create(world))
        Logging.engineLog('create', this)
        super.init(world)
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