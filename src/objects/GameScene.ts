import GameObject from "./GameObject"
import GameWorld from './GameWorld'

export default class GameScene extends GameObject {
    get canBeSubObject(): boolean {
        return false
    }

    init(world: GameWorld): void {
        this.forEach(obj => obj.init(world))
    }
}