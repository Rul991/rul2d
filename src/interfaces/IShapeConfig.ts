import Shape from '../objects/shapes/Shape'

export default interface IShapeConfig {
    setShape(shape: Shape): void

    set shape(shape: Shape)
    get shape(): Shape
}