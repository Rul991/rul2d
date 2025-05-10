import IPointable from "../interfaces/IPointable"
import IRoot from "../interfaces/IRoot"
import ISimplePoint from "../interfaces/simple/ISimplePoint"
import IRectangle from "../interfaces/IRectangle"
import ISimpleRect from "../interfaces/simple/ISimpleRect"
import Point from '../objects/Point'
import DrawableObject from '../objects/core/DrawableObject'
import Shape from '../objects/shapes/Shape'
import ShapeableObject from '../objects/ShapeableObject'

// callbacks
export type Callback = () => void
export type SearchCallback<T> = (obj: T) => number | string
export type EventCallback<T extends Event = Event> = (e: T) => void
export type PointerCallback = (point: Point) => void
export type Constructor<T = {}> = new (...args: any[]) => T
export type KeyboardEventCallback = EventCallback<KeyboardEvent>

// unions

export type CurrentRoot = null | IRoot
export type FollowedCameraObject = DrawablePointerable | Shape | ShapeableObject | null 

export type SmoothingQuality = 'low' | 'medium' | 'high'
export type LocalStorageEmitKeys = 'init' | 'load' | 'set'
export type CacheDictTypes = 'image' | 'text' | 'json'
export type TextHorisontalAlign = 'left' | 'center' | 'right'
export type TextVerticalAlign = 'top' | 'middle' | 'bottom'

// short names

export type Context = CanvasRenderingContext2D
export type Canvas = HTMLCanvasElement
export type Dict<T> = Map<string, T>

// intersections

export type PointType = IPointable & ISimplePoint
export type RectType = IRectangle & ISimpleRect
export type DrawablePointerable = DrawableObject & PointType
export type PositionableObject = ISimplePoint & {doWhenUpdatePosition: Function}

// objects
export type TypeAndValue<T, V> = {type: T, value: V}