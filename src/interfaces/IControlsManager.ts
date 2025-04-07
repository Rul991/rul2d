import IManager from "./IManager"

export default interface IControlManager extends IManager {
    addControls(key: string): void
}