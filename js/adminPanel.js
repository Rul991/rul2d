export const createAdminPanelSetting = ({text = '', inputType = 'range', root = document.body, inputCallback = ([element, event, label]) => {}, attributes = {}, eventType = 'input'}) => {
    const label = document.createElement('label')
    label.textContent = `${text}: `

    const input = document.createElement('input')
    input.type = inputType
    input.addEventListener(eventType, e => inputCallback([input, e, label]))

    Object.entries(attributes).forEach(([key, value]) => input.setAttribute(key, value))

    const container = document.createElement('div')
    container.className = 'grid grid-column-2-auto'

    container.appendChild(label)
    container.appendChild(input)

    root.appendChild(container)

    return input
}