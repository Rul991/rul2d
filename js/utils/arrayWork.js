export const randomArray = (length, min, max) => {
    let arr = []
    for (let i = 0; i < length; i++) {
        arr[i] = randomRange(min, max)
    }
    
    return arr
}

export const deleteOldValues = (arr = [], maxLength = 1) => {
    const pointsLength = arr.length
    if(arr.length > maxLength) return arr.splice(0, pointsLength - maxLength)

    return arr
}