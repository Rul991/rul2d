export const getNestedProperty = (object = {}, path = '') => {
    let nestedValue = {}
    let isNestedValueEmpty = true

    for (const key of path.split('.')) {
        if (isNestedValueEmpty) nestedValue = object[key]
        else nestedValue = nestedValue[key]
        isNestedValueEmpty = false
    }

    return nestedValue
}