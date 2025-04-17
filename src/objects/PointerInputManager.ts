import IManager from '../interfaces/IManager'
import { Canvas, SearchCallback } from '../utils/types'
import PointerableObject from './PointerableObject'
import Point from './Point'
import CustomObject from './CustomObject'
import Sorting from '../utils/Sorting'
import Search from '../utils/Search'
import Camera from './Camera'

export default class PointerInputManager extends CustomObject implements IManager {
    private static _pointerableSortCallback: SearchCallback<PointerableObject> = obj => -obj.zIndex

    private _pointersLocation: Point[]
    private _cursorPosition: Point
    private _pointerables: PointerableObject[]
    private _camera: Camera | null

    private _isPressed: boolean

    constructor() {
        super()

        this._isPressed = false
        this._cursorPosition = Point.NaN
        this._pointersLocation = []
        this._pointerables = []
        this._camera = null
    }

    private _setCursorPoint(e: PointerEvent): void {
        this._cursorPosition.point = this._createPoint(e)
    }

    private _getPointerIndex(e: PointerEvent): number {
        return e.pointerId - 1
    }

    private _createPoint(e: PointerEvent): Point {
        let point = new Point(e.offsetX, e.offsetY)
        return this._updatePointWithCamera(point)
    }

    private _editPoint(index: number, e: PointerEvent): void {
        this._pointersLocation[index].point = this._createPoint(e)
    }

    private _downEventCallback(e: PointerEvent): void {
        this._isPressed = true
        this._pointersLocation.push(this._createPoint(e))
    }

    private _moveEventCallback(e: PointerEvent): void {
        let i = this._getPointerIndex(e)
        if(i >= this._pointersLocation.length) return
        this._editPoint(i, e)
    }

    private _upEventCallback(e: PointerEvent): void {
        let i = this._getPointerIndex(e)
        this._pointersLocation.splice(i, 1)
        this._isPressed = this._pointerables.length > 0
    }

    private _allControlsEventCallback(e: PointerEvent): void {
        this._setCursorPoint(e)
    }

    setCamera(camera: Camera): void {
        this._camera = camera
    }

    getCursorPosition(): Point {
        return this._cursorPosition
    }

    private _updatePointWithCamera(point: Point): Point {
        if(!this._camera) return point

        const {x, y} = point
        const getUpdatedCoordinate = (position: number, cameraPosition: number) => position / this._camera!.zoom - cameraPosition
        return new Point(
            getUpdatedCoordinate(x, this._camera.x),
            getUpdatedCoordinate(y, this._camera.y),
        )
    }

    addPointerable(obj: PointerableObject): void {
        obj.managers.add(this)
        Sorting.addToArray(this._pointerables, obj, PointerInputManager._pointerableSortCallback)
        // this.updateZIndex()
    }

    removePointerable(obj: PointerableObject): void {
        obj.managers.delete(this)
        
        let i = Search.binary(this._pointerables, obj, PointerInputManager._pointerableSortCallback)
        this._pointerables.splice(i, 1)
    }

    addControls(canvas: Canvas): void {
        canvas.addEventListener('pointerdown', e => {
            this._downEventCallback(e)
            this._allControlsEventCallback(e)
        })

        canvas.addEventListener('pointermove', e => {
            this._moveEventCallback(e)
            this._allControlsEventCallback(e)
        })

        canvas.addEventListener('pointerup', e => {
            this._upEventCallback(e)
            this._allControlsEventCallback(e)
        })

        canvas.addEventListener('pointercancel', e => {
            this._upEventCallback(e)
            this._allControlsEventCallback(e)
        })

        canvas.addEventListener('pointerout', e => {
            this._upEventCallback(e)
            this._allControlsEventCallback(e)
        })
    }
    
    updateZIndex(): void {
        this._pointerables = Sorting.merge(this._pointerables, PointerInputManager._pointerableSortCallback)
    }

    update(): void {      
        for (const pointerable of this._pointerables) {
            pointerable.isPressed = false
        }

        if (this._isPressed && this._pointersLocation.length > 0) {
            for (const point of this._pointersLocation) {
                let interactionHandled = false

                for (const pointerable of this._pointerables) {
                    if (pointerable.isPointInShape(point)) {
                        pointerable.isPressed = true
                        pointerable.pressedCallback(point)
                        interactionHandled = true
                        break
                    }
                }

                if (!interactionHandled) {
                    for (const pointerable of this._pointerables) {
                        pointerable.nonAnyInteractiveCallback(point)
                    }
                }
            }
        } 

        else {
            let hoverHandled = false
            for (const pointerable of this._pointerables) {
                if (pointerable.isPointInShape(this._cursorPosition)) {
                    pointerable.hoverCallback(this._cursorPosition)
                    hoverHandled = true
                    break
                }
            }

            if (!hoverHandled) {
                for (const pointerable of this._pointerables) {
                    pointerable.nonAnyInteractiveCallback(this._cursorPosition)
                }
            }
        }
    }
}