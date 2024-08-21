export const floor = (number, numbersAfterDot = 0) => Math.floor(number * (10 ** numbersAfterDot)) / (10 ** numbersAfterDot)

export const randomRange = (min, max, numbersAfterDot = 0) =>  floor(Math.random() * (max - min) + min, numbersAfterDot)
export const randomArray = (length, [min, max]) => {
    let arr = []
    for (let i = 0; i < length; i++) {
        arr[i] = randomRange(min, max)
    }
    
    return arr
}

export const getNumberSign = (num = 0) => Math.abs(num) / num
export const percents = (value, {min = 0, max = 100} = {}) => (value - min) / (max - min)

export const getNumbersFromString = (string = '') => {
    let numbers = ['']

    for (let symb of string.split('')) {
        let lastIndex = numbers.length - 1

        if(!isNaN(+symb)) {
            numbers[lastIndex] += symb
        }
        else {
            numbers[lastIndex + 1] = ''
        }
    }
    
    return numbers.filter(number => {
        if(number !== '') return +number
        else return false
    }).map(value => +value)
}