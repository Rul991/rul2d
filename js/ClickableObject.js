import { InteractiveObject } from './InteractiveObject.js'

export class ClickableObject extends InteractiveObject {
    addControls(canvas) {
        canvas.addEventListener('click', e => {
            let {clientX: x, clientY: y} = e
            this.update({x, y})
        })

        return true
    }
}