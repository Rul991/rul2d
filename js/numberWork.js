export const floor = (number, numbersAfterDot = 0) => Math.floor(number * (10 ** numbersAfterDot)) / (10 ** numbersAfterDot)

export const randomRange = (min, max, numbersAfterDot = 0) =>  floor(Math.random() * (max - min) + min, numbersAfterDot)
export const randomArray = (length, [min, max]) => {
    let arr = []
    for (let i = 0; i < length; i++) {
        arr[i] = randomRange(min, max)
    }
    
    return arr
}

export const randomChance = (chance, maxChance) => randomRange(0, maxChance) < chance

export const getNumberSign = (num = 0) => num != 0 ? Math.abs(num) / num : 0
export const percents = (value, {min = 0, max = 100} = {}) => (value - min) / (max - min)

export const isDigit = char => !isNaN(parseInt(char))
const lastIndex = arr => arr.length - 1

export const getNumbersFromString = (string = '') => {
    let numbers = ['']
    let prevSymbolIsDigit = false

    const symbols = string.split('')

    symbols.forEach(symbol => {
        if(isDigit(symbol)) {
            numbers[lastIndex(numbers)] += symbol
            prevSymbolIsDigit = true
        }
        else if(symbol == '.') {
            if(prevSymbolIsDigit) numbers[lastIndex(numbers)] += symbol
        }
        else {
            if(numbers[lastIndex(numbers)] !== '') {
                numbers[lastIndex(numbers)] = +numbers[lastIndex(numbers)]
                numbers[lastIndex(numbers) + 1] = ''
            }

            prevSymbolIsDigit = false
        }
    })
    if(numbers[lastIndex(numbers)] !== '') numbers[lastIndex(numbers)] = +numbers[lastIndex(numbers)]
    else numbers.splice(numbers[lastIndex(numbers)] - 1, 1)

    return numbers
}

export const deg2rad = (degrees = 0) => degrees / 180 * Math.PI
export const rad2deg = (radians = 0) => radians / Math.PI * 180