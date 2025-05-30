import IManager from '../../interfaces/IManager'
import { Canvas, SearchCallback } from '../../utils/types'
import PointerableObject from '../shapeable/PointerableObject'
import Point from '../Point'
import CustomObject from '../core/CustomObject'
import Sorting from '../../utils/static/Sorting'
import Search from '../../utils/static/Search'
import Camera from '../camera/Camera'
import PointerPoint from '../../utils/PointerPoint'

export default class PointerInputManager extends CustomObject implements IManager {
    private static _pointerableSortCallback: SearchCallback<PointerableObject> = obj => -obj.zIndex

    private _pointersLocation: PointerPoint[]
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

    private _setCursorPoint(e: WheelEvent | PointerEvent): void {
        this._cursorPosition.point = this._createPoint(e)
    }

    private _getPointerIndex(e: PointerEvent): number {
        let i = 0

        let { pointerId } = e
        for (let j = 0; j < this._pointersLocation.length; j++) {
            const point = this._pointersLocation[j];
            if(pointerId == point.pointerId) {
                i = j
                break
            }
        }

        return i
    }

    private _createPoint(e: PointerEvent | (WheelEvent & {pointerId?: number})): PointerPoint {
        let point = new PointerPoint(
            e.offsetX, 
            e.offsetY, 
            e.pointerId ?? 0
        )
        return this._updatePointWithCamera(point)
    }

    private _editPoint(index: number, e: PointerEvent): void {
        if(!this._pointersLocation[index]) return
        this._pointersLocation[index].point = this._createPoint(e)
    }

    private _downEventCallback(e: PointerEvent): void {
        this._isPressed = true
        this._pointersLocation.push(this._createPoint(e))
    }

    private _moveEventCallback(e: PointerEvent): void {
        let i = this._getPointerIndex(e)
        if(i == -1) return

        this._editPoint(i, e)
    }

    private _upEventCallback(e: PointerEvent): void {
        let i = this._getPointerIndex(e)
        if(i == -1) return

        this._pointersLocation.splice(i, 1)
        this._isPressed = this._pointersLocation.length > 0
    }

    private _allControlsEventCallback(e: WheelEvent | PointerEvent): void {
        this._setCursorPoint(e)
    }

    setCamera(camera: Camera): void {
        this._camera = camera
    }

    getCursorPosition(): Point {
        return this._cursorPosition
    }

    private _updatePointWithCamera(point: PointerPoint): PointerPoint {
        if(!this._camera) return point

        const {x, y} = point
        const getUpdatedCoordinate = (cursorPosition: number, cameraPosition: number) => cursorPosition / this._camera!.zoom - cameraPosition
        return new PointerPoint(
            getUpdatedCoordinate(x, this._camera.x),
            getUpdatedCoordinate(y, this._camera.y),
            point.pointerId
        )
    }

    addPointerable(obj: PointerableObject): void {
        obj.managers.add(this)
        this._pointerables.push(obj)
        this.updateZIndex()
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

        canvas.addEventListener('wheel', e => {
            this._allControlsEventCallback(e)
        })
    }
    
    updateZIndex(): void {
        this._pointerables = Sorting.merge(this._pointerables, PointerInputManager._pointerableSortCallback)
    }

    get isPressed(): boolean {
        return this._isPressed
    }

    update(): void {
        if(!this._pointerables.length) return

        for (const pointerable of this._pointerables) {
            pointerable.isPressedInFrame = false
        }

        for (const point of [...this._pointersLocation, this._cursorPosition]) {
            let isPointPressed = point === this._cursorPosition
            let isPointNonInteractive = isPointPressed

            for (const pointerable of this._pointerables) {
                let inShape = pointerable.isPointInShape(point)
                if(!isPointPressed && inShape) {
                    pointerable.isPressedInFrame = true
                    pointerable.pressedCallback(point)

                    isPointNonInteractive = false
                    isPointPressed = inShape || isPointPressed
                }

                else if(!pointerable.isPressedInFrame) {
                    if(inShape)
                        pointerable.hoverCallback(point)
                    else if(isPointNonInteractive)
                        pointerable.nonInteractiveCallback(point)
                }
            }
        }
    }
}