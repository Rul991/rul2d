import IPointerable from "../interfaces/IPointerable"
import IRoot from "../interfaces/IRoot"
import ISimplePoint from "../interfaces/ISimplePoint"
import IRectangle from "../interfaces/IRectangle"
import ISimpleRect from "../interfaces/ISimpleRect"
import Point from '../objects/Point'
import DrawableObject from '../objects/DrawableObject'
import Shape from '../objects/Shape'
import ShapeableObject from '../objects/ShapeableObject'

// callbacks
export type Callback = () => void
export type SearchCallback<T> = (obj: T) => number | string
export type EventCallback<T extends Event = Event> = (e: T) => void
export type KeyboardEventCallback = EventCallback<KeyboardEvent>
export type PointerCallback = (point: Point) => void

// union

export type CurrentRoot = null | IRoot
export type SmoothingQuality = 'low' | 'medium' | 'high'
export type LocalStorageEmitKeys = 'init' | 'load' | 'set'
export type FollowedCameraObject = DrawablePointerable | Shape | ShapeableObject | null 

// short names

export type Context = CanvasRenderingContext2D
export type Canvas = HTMLCanvasElement
export type Dict<T> = Map<string, T>

// intersections

export type PointType = IPointerable & ISimplePoint
export type RectType = IRectangle & ISimpleRect
export type DrawablePointerable = DrawableObject & PointType
