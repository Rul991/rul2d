import GameEntity from './GameEntity'

export default abstract class UIObject extends GameEntity {
    abstract setSize(width?: number, height?: number): void
}