export const $ = (id, root = document) => root.querySelector(id)
export const all$ = (id, root = document) => root.querySelectorAll(id)

export const setDefaultDisplay = element => element.defaultDisplay = getComputedStyle(element).getPropertyValue('display')

export const showElement = element => {
    if(element.defaultDisplay === undefined) setDefaultDisplay(element)
    element.style.display = element.defaultDisplay
}

export const hideElement = element => {
    if(element.defaultDisplay === undefined) setDefaultDisplay(element)
    element.style.display = 'none'
}