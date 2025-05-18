import GameScene from '../objects/core/GameScene'
import GameWorld from '../objects/core/GameWorld'

export default interface ICustomWorldFunctionality {
    doWhenAddNewScene(obj: GameScene): void
    doWhenDeleteScene(obj: GameScene): void
    doWhenAddInWorld(world: GameWorld): void
    doWhenRemoveFromWorld(world: GameWorld): void
    doWhenChangeScene(oldScene: GameScene | null, newScene: GameScene| null): void
    update(delta: number, world: GameWorld): void
}