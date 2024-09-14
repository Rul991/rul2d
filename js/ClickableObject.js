import InteractiveObject from './InteractiveObject.js'

export default class ClickableObject extends InteractiveObject {
    addControls(canvas = new HTMLCanvasElement) {
        canvas.addEventListener('click', e => {
            let {clientX: x, clientY: y} = e
            let {left, top} = canvas.getBoundingClientRect()
            this.update({x: x - left, y: y - top})
        })

        return true
    }
}