import IManager from "./IManager"

export default interface IControlsManager extends IManager {
    addControls(key: string): void
}