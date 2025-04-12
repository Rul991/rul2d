import IPointerable from "../interfaces/IPointerable"
import IRoot from "../interfaces/IRoot"
import ISimplePoint from "../interfaces/ISimplePoint"

// callbacks
export type Callback = () => void
export type SearchCallback<T> = (obj: T) => number | string
export type KeyboardEventCallback = (e: KeyboardEvent) => void

// union

export type NumberOrNull = number | null
export type CurrentRoot = null | IRoot
export type SmoothingQuality = 'low' | 'medium' | 'high'

// short names

export type Context = CanvasRenderingContext2D
export type Canvas = HTMLCanvasElement
export type Dict<T> = Map<string, T>

// intersections

export type PointType = IPointerable & ISimplePoint